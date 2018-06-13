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
    return parse_xml(resp.content)
