"""
Unit tests for utility functions
"""

from unittest import TestCase, mock

from lxml import etree
import requests as r

from ..utils import get_well_lithography, parse_xml


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


class TestGetWellLithography(TestCase):

    def setUp(self):
        self.test_service_root = 'http://fake.gov'
        self.test_agency_cd = 'DOOP'
        self.test_location_id = 'BP-1729'
        self.test_xml = '<site><agency>DOOP</agency><id>BP-1729</id></site>'

    @mock.patch('ngwmn.utils.r.get')
    def test_success(self, r_mock):
        m_resp = mock.Mock(r.Response)
        m_resp.content = self.test_xml
        m_resp.status_code = 200,
        r_mock.return_value = m_resp
        result = get_well_lithography(self.test_service_root, self.test_agency_cd, self.test_location_id)
        self.assertEqual(result.tag, 'site')
        r_mock.assert_called_with(
            'http://fake.gov/ngwmn/iddata',
            params={'request': 'well_log', 'agency_cd': 'DOOP', 'siteNo': 'BP-1729'}
        )

    @mock.patch('ngwmn.utils.r.get')
    def test_syntax_error(self, r_mock):
        m_resp = mock.Mock(r.Response)
        m_resp.content = 'Stuff'
        m_resp.status_code = 200,
        r_mock.return_value = m_resp
        result = get_well_lithography(self.test_service_root, self.test_agency_cd, self.test_location_id)
        self.assertIsNone(result)
