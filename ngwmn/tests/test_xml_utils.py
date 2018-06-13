"""
Unit tests for XML manipulation functions
"""
from unittest import TestCase

from lxml import etree

from ..xml_utils import parse_xml


class TestParseXml(TestCase):

    def setUp(self):
        self.good_xml = '<a><b>SOME TEXT</b></a>'
        self.bad_xml = 'Ich habe eine Katze.'

    def test_good_xml(self):
        result = parse_xml(self.good_xml)
        self.assertIsInstance(result, etree._Element)

    def test_bad_xml(self):
        result = parse_xml(self.bad_xml)
        self.assertIsNone(result)
