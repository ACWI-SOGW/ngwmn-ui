"""
Unit tests for NGWMN views

"""
from unittest import TestCase, mock

from defusedxml.lxml import fromstring
import requests as r

from .. import app


class TestWellPageView(TestCase):

    def setUp(self):
        self.app_client = app.test_client()
        self.test_agency_cd = 'DOOP'
        self.test_location_id = 'BP-1729'
        self.test_well_xml = (
            '<wfs xmlns:gml="http://www.opengis.net/gml"><gml:Point srsName="EPSG:4269">'
            '<gml:pos srsDimension="2">39.443328281 -75.634096999</gml:pos></gml:Point></wfs>'
        )
        self.test_summary_xml = (
            '<wfs xmlns:ngwmn="gov.usgs.cida.ngwmn"><ngwmn:VW_GWDP_GEOSERVER>'
            '<ngwmn:SITE_NAME>Water Farm 1</ngwmn:SITE_NAME></ngwmn:VW_GWDP_GEOSERVER></wfs>'
        )

    @mock.patch('ngwmn.views.r.post')
    @mock.patch('ngwmn.views.get_well_lithography')
    def test_best_case(self, well_lith_mock, post_mock):
        well_lith_mock.return_value = fromstring(self.test_well_xml)
        post_resp = mock.Mock(r.Response)
        post_resp.content = self.test_summary_xml
        post_resp.status_code = 200
        post_mock.return_value = post_resp

        response = self.app_client.get('/well-location/{}/{}/'.format(self.test_agency_cd, self.test_location_id))
        post_mock.assert_called_once()
        self.assertEqual(response.status_code, 200)

    @mock.patch('ngwmn.views.r.post')
    @mock.patch('ngwmn.views.get_well_lithography')
    def test_failed_service_with_non_server_error(self, well_lith_mock, post_mock):
        well_lith_mock.return_value = fromstring(self.test_well_xml)
        post_resp = mock.Mock(r.Response)
        post_resp.content = self.test_summary_xml
        post_resp.status_code = 403
        post_resp.reason = 'Forbidden'
        post_mock.return_value = post_resp

        response = self.app_client.get('/well-location/{}/{}/'.format(self.test_agency_cd, self.test_location_id))
        post_mock.assert_called_once()
        self.assertEqual(response.status_code, 200)

    @mock.patch('ngwmn.views.r.post')
    @mock.patch('ngwmn.views.get_well_lithography')
    def test_failed_service_with_server_error(self, well_lith_mock, post_mock):
        well_lith_mock.return_value = fromstring(self.test_well_xml)
        post_resp = mock.Mock(r.Response)
        post_resp.content = self.test_summary_xml
        post_resp.status_code = 500
        post_mock.return_value = post_resp

        response = self.app_client.get('/well-location/{}/{}/'.format(self.test_agency_cd, self.test_location_id))
        post_mock.assert_called_once()
        self.assertEqual(response.status_code, 503)

    @mock.patch('ngwmn.views.get_well_lithography')
    def test_no_xml(self, well_lith_mock):
        well_lith_mock.return_value = None
        response = self.app_client.get('/well-location/{}/{}/'.format(self.test_agency_cd, self.test_location_id))
        self.assertEqual(response.status_code, 404)
