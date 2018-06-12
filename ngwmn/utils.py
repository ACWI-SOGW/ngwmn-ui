"""
Utility functions

"""
from urllib.parse import urljoin

from lxml import etree
import requests as r


def parse_xml(xml_string):
    try:
        parsed = etree.fromstring(xml_string)
    except etree.XMLSyntaxError:
        parsed = None
    return parsed


def get_well_lithography(service_root, agency_cd, location_id):
    lithography_target = urljoin(service_root, 'ngwmn/iddata')
    query_params = {
        'request': 'well_log',
        'agency_cd': agency_cd,
        'siteNo': location_id
    }
    resp = r.get(lithography_target, params=query_params)
    return parse_xml(resp.content)
