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

    return parse_xml(resp.content)


def get_water_quality_results(agency_cd, location_id):
    xml = get_iddata('water_quality', agency_cd, location_id)
    if xml is None:
        return None

    activity = xml.find('.//Organization/Activity', xml.nsmap)

    return [{
        'pcode': result.find('USGSPcode', xml.nsmap).text,
        'provider_name': result.find('ProviderName', xml.nsmap).text,
        'result_description': (lambda desc: {
            'detection_condition_text': desc.find('ResultDetectionConditionText', xml.nsmap).text,
            'characteristic_name': desc.find('CharacteristicName', xml.nsmap).text,
            'sample_fraction_text': desc.find('ResultSampleFractionText', xml.nsmap).text,
            'measure': (lambda measure: {
                'measure_value': measure.find('ResultMeasureValue', xml.nsmap).text,
                'measure_unit_code': measure.find('MeasureUnitCode', xml.nsmap).text,
            })(desc.find('ResultMeasure', xml.nsmap)),
            'value_type_name': desc.find('ResultValueTypeName', xml.nsmap).text,
            'temperature_basis_text': desc.find('ResultTemperatureBasisText', xml.nsmap).text,
            'comment_text': desc.find('ResultCommentText', xml.nsmap).text
        })(result.find('ResultDescription', xml.nsmap)),
        'result_analytical_method': (lambda method: {
            'identifier': method.find('MethodIdentifier', xml.nsmap).text,
            'identifier_context': method.find('MethodIdentifierContext', xml.nsmap).text,
            'name': method.find('MethodName', xml.nsmap).text
        })(result.find('ResultAnalyticalMethod', xml.nsmap)),
        'result_lab_information': (lambda info: {
            'analysis_start_date': info.find('AnalysisStartDate', xml.nsmap).text,
            'analysis_start_time': (lambda start_time: {
                'time': start_time.find('Time', xml.nsmap).text,
                'time_zone_code': start_time.find('TimeZoneCode', xml.nsmap).text
            })(info.find('AnalysisStartTime', xml.nsmap)),
            'result_detection_quantitation_limit': (lambda limit: {
                'type_name': limit.find('DetectionQuantitationLimitTypeName', xml.nsmap).text,
                'measure': (lambda measure: {
                    'value': measure.find('MeasureValue', xml.nsmap).text,
                    'unit_code': measure.find('MeasureUnitCode', xml.nsmap).text
                })(limit.find('DetectionQuantitationLimitMeasure', xml.nsmap))
            })(info.find('ResultDetectionQuantitationLimit', xml.nsmap))
        })(result.find('ResultLabInformation', xml.nsmap))
    } for result in activity.findall('Result', xml.nsmap)]


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
