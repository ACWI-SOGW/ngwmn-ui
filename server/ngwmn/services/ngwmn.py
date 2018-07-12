"""
Utility functions for fetching data

"""
from urllib.parse import urljoin

import requests as r

from ngwmn import app
from ngwmn.services import ServiceException
from ngwmn.xml_utils import parse_xml


SERVICE_ROOT = app.config.get('SERVICE_ROOT')


def get_well_lithography(agency_cd, location_id, service_root=SERVICE_ROOT):
    """
    Make a NGWMN service request to get well lithography data.

    :param str agency_cd: agency code for the agency that manages the location
    :param str location_id: the location's identifier
    :return: lxml object represent the location's lithography XML
    :param str service_root: hostname of the service
    :rtype: etree._Element or None

    """
    lithography_target = urljoin(service_root, 'ngwmn/iddata')
    query_params = {
        'request': 'well_log',
        'agency_cd': agency_cd,
        'siteNo': location_id
    }

    resp = r.get(lithography_target, params=query_params)

    if resp.status_code == 404:
        return None

    if resp.status_code != 200:
        msg = '%s error from %s (reason: %s)'
        app.logger.error(msg, resp.status_code, resp.url, resp.reason)
        raise ServiceException()

    return parse_xml(resp.content)


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
