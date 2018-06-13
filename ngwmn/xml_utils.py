"""
Utility functions manipulating XML

"""
from lxml import etree


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
