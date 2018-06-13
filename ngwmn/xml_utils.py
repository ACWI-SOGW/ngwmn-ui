"""
Utility functions manipulating XML

"""
from defusedxml.lxml import fromstring
from lxml.etree import XMLSyntaxError


def parse_xml(xml_string):
    """
    Parse an XML string into an lxml object.
    If the XML is invalid, None is returned.

    :param str xml_string: a string of XML
    :return: lxml object representing the XML content
    :rtype: etree._Element or None

    """
    try:
        parsed = fromstring(xml_string)
    except XMLSyntaxError:
        parsed = None
    return parsed
