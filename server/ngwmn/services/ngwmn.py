"""
Utility functions for fetching data

"""
from urllib.parse import urljoin

import requests as r

from ngwmn import app
from ngwmn.services import ServiceException
from ngwmn.xml_utils import parse_xml


SERVICE_ROOT = app.config.get('SERVICE_ROOT')


def get_iddata(request, agency_cd, location_id, service_root=SERVICE_ROOT):
    """
    Make a NGWMN iddata service request.

    :param str request: request parameter for service call
    :param str agency_cd: agency code for the agency that manages the location
    :param str location_id: the location's identifier
    :return: lxml object represent the location's response XML
    :param str service_root: hostname of the service
    :rtype: etree._Element or None

    """

    resp = r.get(urljoin(service_root, 'ngwmn/iddata'), params={
        'request': request,
        'agency_cd': agency_cd,
        'siteNo': location_id
    })

    if resp.status_code == 404:
        return None

    if resp.status_code != 200:
        msg = '%s error from %s (reason: %s)'
        app.logger.error(msg, resp.status_code, resp.url, resp.reason)
        raise ServiceException()

    app.logger.debug('Got %s response from %s', resp.status_code, resp.url)
    return parse_xml(resp.content)


def _find(parent, tag):
    if parent is None:
        return None

    node = parent.find(tag, parent.nsmap)
    if node is None:
        return None

    return node.text


def get_water_quality_activities(agency_cd, location_id):
    """
    Retrieves water-quality data from the NGWMN iddata service.

    :param str agency_cd: agency code for the agency that manages the location
    :param str location_id: the location's identifier
    :return: array of activity dictionaries
    :rtype: array
    """
    xml = get_iddata('water_quality', agency_cd, location_id)
    if xml is None:
        return []

    organization = xml.find('.//Organization', xml.nsmap)
    if organization is None:
        return []

    return [{
        'description': (lambda desc: {
            'identifier': _find(desc, 'ActivityIdentifier'),
            'type_code': _find(desc, 'ActivityTypeCode'),
            'media_name': _find(desc, 'ActivityMediaName'),
            'start_date': _find(desc, 'ActivityStartDate'),
            'start_time': (lambda time: {
                'time': _find(time, 'Time'),
                'time_zone_code': _find(time, 'TimeZoneCode')
            })(desc.find('ActivityStartTime', xml.nsmap)),
            'project_identifier': _find(desc, 'ProjectIdentifier'),
            'monitoring_location_identifier': _find(desc, 'MonitoringLocationIdentifier'),
            'comment_text': _find(desc, 'ActivityCommentText')
        })(activity.find('ActivityDescription', xml.nsmap)),
        'sample_description': (lambda desc: {
            'collection_method': (lambda method: {
                'identifier': _find(method, 'MethodIdentifier'),
                'identifier_context': _find(method, 'MethodIdentifierContext'),
                'name': _find(method, 'MethodName')
            })(desc.find('SampleCollectionMethod', xml.nsmap)),
            'collection_equipment_name': _find(desc, 'SampleCollectionEquipmentName')
        })(activity.find('SampleDescription', xml.nsmap)),
        'results': [{
            'pcode': _find(result, 'USGSPcode'),
            'provider_name': _find(result, 'ProviderName'),
            'description': (lambda desc: {
                'detection_condition_text': _find(desc, 'ResultDetectionConditionText'),
                'characteristic_name': _find(desc, 'CharacteristicName'),
                'sample_fraction_text': _find(desc, 'ResultSampleFractionText'),
                'measure': (lambda measure: {
                    'value': _find(measure, 'ResultMeasureValue'),
                    'unit_code': _find(measure, 'MeasureUnitCode'),
                })(desc.find('ResultMeasure', xml.nsmap)),
                'value_type_name': _find(desc, 'ResultValueTypeName'),
                'temperature_basis_text': _find(desc, 'ResultTemperatureBasisText'),
                'comment_text': _find(desc, 'ResultCommentText')
            })(result.find('ResultDescription', xml.nsmap)),
            'analytical_method': (lambda method: {
                'identifier': _find(method, 'MethodIdentifier'),
                'identifier_context': _find(method, 'MethodIdentifierContext'),
                'name': _find(method, 'MethodName')
            })(result.find('ResultAnalyticalMethod', xml.nsmap)),
            'lab_information': (lambda info: {
                'analysis_start_date': _find(info, 'AnalysisStartDate'),
                'analysis_start_time': (lambda start_time: {
                    'time': _find(start_time, 'Time'),
                    'time_zone_code': _find(start_time, 'TimeZoneCode')
                })(info.find('AnalysisStartTime', xml.nsmap) if info is not None else None),
                'detection_quantitation_limit': (lambda limit: {
                    'type_name': _find(limit, 'DetectionQuantitationLimitTypeName'),
                    'measure': (lambda measure: {
                        'value': _find(measure, 'MeasureValue'),
                        'unit_code': _find(measure, 'MeasureUnitCode')
                    })(limit.find('DetectionQuantitationLimitMeasure', xml.nsmap) if limit is not None else None)
                })(info.find('ResultDetectionQuantitationLimit', xml.nsmap) if info is not None else None)
            })(result.find('ResultLabInformation', xml.nsmap))
        } for result in activity.findall('Result', xml.nsmap)]
    } for activity in organization.findall('Activity', xml.nsmap)]


def generate_bounding_box_values(latitude, longitude, delta=0.01):
    """
    Calculate a small bounding box around a point

    :param latitude: decimal latitude
    :param longitude: decimal longitude
    :param float delta: difference to use when calculating the bounding box
    :return: bounding box values in the following order: lower longitude, lower latitude,
        upper longitude, upper latitude
    :rtype: tuple

    """
    flt_lat = float(latitude)
    flt_lon = float(longitude)
    lat_lower = flt_lat - delta
    lon_lower = flt_lon - delta
    lat_upper = flt_lat + delta
    lon_upper = flt_lon + delta
    return lon_lower, lat_lower, lon_upper, lat_upper


def get_features(latitude, longitude, service_root=SERVICE_ROOT):
    """
    Call geoserver GetFeature for a bounding box around the given latitude/longitude.

    :param latitude: decimal latitude
    :param longitude: decimal longitude
    :param str service_root: hostname of the service
    """
    bbox = generate_bounding_box_values(latitude, longitude)
    data = {
        'SERVICE': 'WFS',
        'VERSION': '1.0.0',
        'srsName': 'EPSG:4326',
        'outputFormat': 'json',
        'typeName': 'ngwmn:VW_GWDP_GEOSERVER',
        'CQL_FILTER': "((QW_SN_FLAG='1') OR (WL_SN_FLAG='1')) AND (BBOX(GEOM,{},{},{},{}))".format(*bbox)
    }
    params = {'request': 'GetFeature'}
    target = urljoin(service_root, 'ngwmn/geoserver/wfs')
    response = r.post(target, params=params, data=data)

    if response.status_code != 200:
        raise ServiceException()

    return response.json()
