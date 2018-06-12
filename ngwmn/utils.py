"""
Utility functions

"""
from urllib.parse import urljoin

from lxml import etree
import requests as r


def parse_xml(xml_string):
    """
    Parse an XML string into an lxml object.
    If the XML is invalid, None is returned.

    :param str xml_string: a string of XML
    :return: lxml object representing the XML content
    :rtype: etree._Element or None

    """
    try:
        parsed = etree.fromstring(xml_string)
    except etree.XMLSyntaxError:
        parsed = None
    return parsed


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
