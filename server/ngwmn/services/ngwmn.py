"""
Utility functions for fetching data
"""
import calendar
import json
import re
from urllib.parse import urljoin

import requests as r

from ngwmn import app
from ngwmn.services import ServiceException
from ngwmn.services.lithology_parser import classify_material, get_colors
from ngwmn.xml_utils import parse_xml

SERVICE_ROOT = app.config.get('SERVICE_ROOT')
SERVICE_ROOT_CACHE = app.config.get('SERVICE_ROOT_CACHE')


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


def _find(parent, tag, default=None):
    if parent is None:
        return default

    node = parent.find(tag, parent.nsmap)
    if node is None:
        return default

    if not node.text or node.text == 'unknown':
        return default

    return node.text


def _cast(to_type, value):
    if value is None:
        return None
    try:
        return to_type(value)
    except ValueError:
        return None


def _default(value, default):
    if value in (None, 'Unknown'):
        return default
    return value


def _coordinates(value):
    if value in (None, 'Unknown'):
        return None
    coordinates = value.split(' ')
    return {
        'start': _cast(float, coordinates[0]),
        'end': _cast(float, coordinates[1])
    }


def get_water_quality(agency_cd, location_id):
    """
    Retrieves water-quality data from the NGWMN iddata service.

    :param str agency_cd: agency code for the agency that manages the location
    :param str location_id: the location's identifier
    :return: array of activity dictionaries
    :rtype: array
    """
    xml = get_iddata('water_quality', agency_cd, location_id)
    if xml is None:
        return {}

    organization = xml.find('.//Organization', xml.nsmap)
    if organization is None:
        return {}

    return {
        'organization': (lambda desc: {
            'id': _find(desc, 'OrganizationIdentifier'),
            'name': _find(desc, 'OrganizationFormalName')
        })(organization.find('OrganizationDescription', xml.nsmap)),
        'activities': [{
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
    }


def get_well_log(agency_cd, location_id):
    """
    Retrieves water-quality data from the NGWMN iddata service.

    :param str agency_cd: agency code for the agency that manages the location
    :param str location_id: the location's identifier
    :return: array of activity dictionaries
    :rtype: array
    """
    # pylint: disable=line-too-long
    xml = get_iddata('well_log', agency_cd, location_id)
    if xml is None:
        return {}

    water_well = xml.find('.//gwml:WaterWell', xml.nsmap)
    if water_well is None:
        return {}

    return {
        'name': _find(water_well, 'gml:name'),
        'location': (lambda pos: {
            'latitude': pos[0],
            'longitude': pos[1]
        })(_find(water_well, 'gml:boundedBy/gml:envelope/gml:pos').split(' ')),
        'elevation': (lambda elev: {
            'value': _cast(float, elev.text),
            'unit': _default(elev.get('uom'), 'ft'),
            'scheme': _find(water_well, 'gwml:wellStatus/gsml:CGI_TermValue/gsml:value[@codeSpace="urn:gov.usgs.nwis.alt_datum_cd"]')
        })(water_well.find('gwml:referenceElevation', xml.nsmap)),
        'well_depth': (lambda depth: {
            'value': _cast(float, depth.text),
            'unit': _default(depth.get('uom'), 'ft')
        })(water_well.find('gwml:wellDepth/gsml:CGI_NumericValue/gsml:principalValue', xml.nsmap)),
        'water_use': _find(water_well, 'gwml:wellType/gsml:CGI_TermValue/gsml:value'),
        'link': (lambda link: {
            'url': link.get('{http://www.w3.org/1999/xlink}href'),
            'title': link.get('{http://www.w3.org/1999/xlink}title')
        })(water_well.find('gwml:onlineResource', xml.nsmap)),
        'log_entries': [{
            'method': _find(entry, 'gsml:observationMethod/gsml:CGI_TermValue/gsml:value'),
            'unit': (lambda unit: {
                'description': _find(unit, 'gml:description'),
                'ui': (lambda words: {
                    'colors': get_colors(words),
                    'materials': classify_material(words)
                })(re.findall(r'\w+', _find(unit, 'gml:description', default='').lower())),
                'purpose': _find(unit, 'gsml:purpose'),
                'composition': (lambda part: {
                    'role': _find(part, 'gsml:role'),
                    'lithology': (lambda lith: {
                        'scheme': lith.get('codeSpace'),
                        'value': lith.text
                    })(part.find('gsml:lithology/gsml:ControlledConcept/gml:name', xml.nsmap)),
                    'material': (lambda material: {
                        'name': _find(material, 'gml:name'),
                        'purpose': _find(material, 'gsml:purpose')
                    })(part.find('gsml:material/gsml:UnconsolidatedMaterial', xml.nsmap)),
                    'proportion': (lambda proportion: {
                        'scheme': proportion.get('codeSpace'),
                        'value': proportion.text
                    })(part.find('gsml:proportion/gsml:CGI_TermValue/gsml:value', xml.nsmap)),
                })(unit.find('gsml:composition/gsml:CompositionPart', xml.nsmap))
            })(entry.find('gsml:specification/gwml:HydrostratigraphicUnit', xml.nsmap)),
            'shape': (lambda shape: {
                'dimension': shape.get('srsDimension'),
                'unit': _default(shape.get('uom'), 'ft'),
                'coordinates': _coordinates(_find(shape, 'gml:coordinates'))
            })(entry.find('gsml:shape/gml:LineString', xml.nsmap)),
        } for entry in water_well.findall('gwml:logElement/gsml:MappedInterval', xml.nsmap)],
        'construction': [{
            'type': 'casing',
            'position': (lambda line: {
                'unit': _default(_find(line, 'gml:uom'), 'ft'),
                'coordinates': _coordinates(_find(line, 'gml:coordinates'))
            })(elem.find('gwml:position/gml:LineString', xml.nsmap)),
            'material': _find(elem, 'gwml:material/gsml:CGI_TermValue/gsml:value'),
            'diameter': (lambda dimension: {
                'value': _cast(float, dimension.text),
                'unit': _default(dimension.get('uom'), 'in')
            })(elem.find('gwml:nominalPipeDimension/gsml:CGI_NumericValue/gsml:principalValue', xml.nsmap))
        } for elem in water_well.findall('gwml:construction/gwml:WellCasing/gwml:wellCasingElement/gwml:WellCasingComponent', xml.nsmap)] + [{
            'type': 'screen',
            'position': (lambda line: {
                'unit': _default(_find(line, 'gml:uom'), 'ft'),
                'coordinates': _coordinates(_find(line, 'gml:coordinates'))
            })(elem.find('gwml:position/gml:LineString', xml.nsmap)),
            'material': _find(elem, 'gwml:material/gsml:CGI_TermValue/gsml:value'),
            'diameter': (lambda dimension: {
                'value': _cast(float, dimension.text),
                'unit': _default(dimension.get('uom'), 'in')
            })(elem.find('gwml:nomicalScreenDiameter/gsml:CGI_NumericValue/gsml:principalValue', xml.nsmap))
        } for elem in water_well.findall('gwml:construction/gwml:Screen/gwml:screenElement/gwml:ScreenComponent', xml.nsmap)]
    }


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
    app.logger.debug('Got %s response from %s', response.status_code, response.url)

    if response.status_code != 200:
        raise ServiceException()

    return response.json()


def get_sites(agency_cd, service_root=SERVICE_ROOT):
    params = {'request': 'GetFeature'}
    data = {
        'SERVICE': 'WFS',
        'VERSION': '1.1.0',
        'srsName': 'EPSG:4326',
        'outputFormat': 'json',
        'typeName': 'ngwmn:VW_GWDP_GEOSERVER',
        'CQL_FILTER': "(AGENCY_CD='{0}')".format(agency_cd)
    }
    target = urljoin(service_root, 'ngwmn/geoserver/wfs')
    response = r.post(target, params=params, data=data)
    app.logger.debug('Got %s response from %s', response.status_code, response.url)


    features = response.json().get('features')
    return list(map(lambda x: convert_keys_and_booleans(x.get('properties', {})), features))


def get_statistic(agency_cd, site_no, stat_type, service_root=SERVICE_ROOT_CACHE):
    """
    fetches the statistics from the ngwmn cache

    :param agency_cd: the agency code
    :param site_no:  the site number
    :param stat_type: there are three statistic types:
    'site-info', 'wl-overall', 'wl-monthly'
    :param service_root: the server for the ngwmn_cache service. This has the
    potential to be different than the UI service and hence has its own const.
    Example Service Roots
    http://cida-eros-ngwmndev:8080
    https://cida.usgs.gov

    :return: json data response from the http(s) request

    SAMPLE overall
    {
      "CALC_DATE": "2018-07-04",
      "LATEST_VALUE": "213.84",
      "MAX_DATE": "2018-04-10T13:18:00-06:00",
      "AGENCY_CD": "USGS",
      "MEDIAN_VALUE": "217.82",
      "RECORD_YEARS": "31.6",
      "MAX_VALUE": "181.7",
      "MEDIATION": "BelowLand",
      "MIN_VALUE": "232.96",
      "SAMPLE_COUNT": "7456",
      "SITE_NO": "353945105574502",
      "MIN_DATE": "1986-09-26T12:00:00",
      "LATEST_PCTILE": "0.78606",
      "IS_RANKED": "Y"
    }
    SAMPLE monthly
    {
      "3": {
        "RECORD_YEARS": "23",
        "P50": "216.54",
        "P25": "222.72",
        "P10": "226.24",
        "P50_MAX": "184.17",
        "P90": "188.72",
        "P75": "212.37",
        "AGENCY_CD": "USGS",
        "SAMPLE_COUNT": "673",
        "MONTH": "3",
        "SITE_NO": "353945105574502",
        "P50_MIN": "227.46"
      },
      "1": {
        "RECORD_YEARS": "20",
        "P50": "218.28",
        "P25": "225.50",
        "P10": "227.03",
        "P50_MAX": "184.14",
        "P90": "190.49",
        "P75": "214.81",
        "AGENCY_CD": "USGS",
        "SAMPLE_COUNT": "608",
        "MONTH": "1",
        "SITE_NO": "353945105574502",
        "P50_MIN": "227.89"
      }
    }
    """
    url = '/'.join([service_root, 'ngwmn_cache', 'direct', 'json', stat_type, agency_cd, site_no])
    resp = r.get(url)
    app.logger.debug('Got %s response from %s', resp.status_code, resp.url)

    statistics = {
            'is_ranked': False,
            'is_fetched': False
        }
    if resp.status_code == 404:
        return statistics

    if resp.status_code != 200:
        msg = '%s statistics fetch error from %s (reason: %s)'
        app.logger.error(msg, resp.status_code, resp.url, resp.reason)
        raise ServiceException()

    json_txt = resp.text
    stats = json.loads(json_txt)
    stats['is_fetched'] = True

    statistics = convert_keys_and_booleans(stats)
    app.logger.debug(statistics)

    return statistics


def get_providers(service_root=SERVICE_ROOT):
    """
    Retrieves the list of providers
    :param service_root: root url of service which serves provider metadata
    :return: a list of dictionaries containing the list of providers. Note that
    the JSON that is returned from the service will have it's keys changed to lowercase
    """
    target = urljoin(service_root, 'ngwmn/metadata/agencies')
    response = r.get(target)
    app.logger.debug('Got %s response from %s', response.status_code, response.url)

    if response.status_code != 200:
        app.logger.error('Service request error for {0}'.format(target))
        raise ServiceException()

    return list(map(convert_keys_and_booleans, response.json()))


def convert_keys_and_booleans(dictionary):
        """
        Local recursive helper method to convert 'all caps' keys to lowercase
        :param dictionary: the dict for whom's keys need lowercase
        :return: the new dictionary with lowercase keys
        """
        lower_case = {}
        for key in dictionary:
            value = dictionary[key]
            if isinstance(value, dict):
                value = convert_keys_and_booleans(value)
            elif value in ['N', 'Y']:
                value = (value == 'Y')
            lower_case[key.lower()] = value
        return lower_case


def get_statistics(agency_cd, site_no):
    """
    Call ngwmn_cache for site statistics data.

    :param agency_cd: string agency code
    :param site_no: alphanumeric site number
    :returns overall and monthly statistics
    """
    # handle to potential fetch fail with default
    stats = {
        'overall': {
            'alt_datum': 'unknown',
            'calc_date': 'unknown',
        },
        'monthly': []
    }

    overall = get_statistic(agency_cd, site_no, 'wl-overall')
    if overall.get('is_fetched'):
        stats['overall'] = overall
        site_info = get_statistic(agency_cd, site_no, 'site-info')
        alt_datum_cd = ''
        if site_info.get('is_fetched'):
            alt_datum_cd = site_info['altdatumcd']

        if overall.get('is_ranked'):
            monthly = get_statistic(agency_cd, site_no, 'wl-monthly')
            if monthly.get('is_fetched'):
                stats['monthly'] = []
                month_num = 0
                for month_abbr in calendar.month_abbr[1:]:
                    month_num += 1
                    if str(month_num) in monthly:
                        month_stats = monthly[str(month_num)]
                        month_stats['month'] = month_abbr
                        stats['monthly'].append(month_stats)

        if overall.get('mediation', '') == 'BelowLand':
            stats['overall']['alt_datum'] = 'Depth to water, feet below land surface'
        else:
            stats['overall']['alt_datum'] = 'Water level in feet relative to ' + alt_datum_cd

    # { SAMPLE stats
    #     "alt_datum": 'Below Land Surface',
    #     "calc_date": '2018-10-10',
    #     "overall": ['1.0', '5.5', '42', '2001-01-01', '2018-10-10', '4242', '18'],
    #     "monthly": [
    #         ['Jan', '5.5', '42', '24', '12', '6.6', '3.3', '12', '10', '18'],
    #         ['Feb', '5.5', '42', '24', '12', '6.6', '3.3', '12', '10', '18'],
    #         ['Mar', '5.5', '42', '24', '12', '6.6', '3.3', '12', '10', '18'],
    #         ['Apr', '5.5', '42', '24', '12', '6.6', '3.3', '12', '10', '18'],
    #         ['May', '5.5', '42', '24', '12', '6.6', '3.3', '12', '10', '18'],
    #         ['Jun', '5.5', '42', '24', '12', '6.6', '3.3', '12', '10', '18'],
    #         ['Jul', '5.5', '42', '24', '12', '6.6', '3.3', '12', '10', '18'],
    #         ['Aug', '5.5', '42', '24', '12', '6.6', '3.3', '12', '10', '18'],
    #         ['Sep', '5.5', '42', '24', '12', '6.6', '3.3', '12', '10', '18'],
    #         ['Oct', '5.5', '42', '24', '12', '6.6', '3.3', '12', '10', '18'],
    #         ['Nov', '5.5', '42', '24', '12', '6.6', '3.3', '12', '10', '18'],
    #         ['Dec', '5.5', '42', '24', '12', '6.6', '3.3', '12', '10', '18']
    #     ]
    # }
    return stats
