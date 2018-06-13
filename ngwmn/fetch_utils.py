"""
Utility functions for fetching data

"""
from urllib.parse import urljoin

import requests as r

from .xml_utils import parse_xml


def get_well_lithography(service_root, agency_cd, location_id):
    """
    Make a NGWMN service request to get well lithography data.

    :param str service_root: hostname of the service
    :param str agency_cd: agency code for the agency that manages the location
    :param str location_id: the location's identifier
    :return: lxml object represent the location's lithography XML
    :rtype: etree._Element or None

    """
    lithography_target = urljoin(service_root, 'ngwmn/iddata')
    query_params = {
        'request': 'well_log',
        'agency_cd': agency_cd,
        'siteNo': location_id
    }
    resp = r.get(lithography_target, params=query_params)
    if resp.status_code == 200:
        return parse_xml(resp.content)
    else:
        return None


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
