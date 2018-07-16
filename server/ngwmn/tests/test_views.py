"""
Unit tests for NGWMN views

"""
import json
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
        self.test_summary_json = '{"type":"FeatureCollection","totalFeatures":1,"features":[{"type":"Feature","id":"VW_GWDP_GEOSERVER.fid--77a549f6_164a44aea49_2db5","geometry":{"type":"Point","coordinates":[-89.3928,43.068372221281]},"geometry_name":"GEOM","properties":{"MY_SITEID":"USGS:430406089232901","FID":"USGS.430406089232901","AGENCY_CD":"USGS","AGENCY_NM":"U.S. Geological Survey","AGENCY_MED":"U.S. Geological Survey","SITE_NO":"430406089232901","SITE_NAME":"DN-07/09E/23-1297","DISPLAY_FLAG":"1","DEC_LAT_VA":43.0683722222222,"DEC_LONG_VA":-89.3928,"HORZ_DATUM":"NAD83","HORZ_METHOD":"GNSS4 - Level 1 Quality Survey Grade Global Navigation Satellite System","HORZ_ACY":"Accurate to +/- .01 second (differentially corrected GPS)","ALT_VA":859,"ALT_UNITS":1,"ALT_UNITS_NM":"Feet","ALT_DATUM_CD":"NAVD88","ALT_METHOD":null,"ALT_ACY":"+/- 0.1 ft","WELL_DEPTH":68,"WELL_DEPTH_UNITS":1,"WELL_DEPTH_UNITS_NM":"Feet","NAT_AQUIFER_CD":"S300CAMORD","NAT_AQFR_DESC":"Cambrian-Ordovician aquifer system","COUNTRY_CD":"US","COUNTRY_NM":"United States of America","STATE_CD":"55","STATE_NM":"Wisconsin","COUNTY_CD":"025","COUNTY_NM":"Dane County","LOCAL_AQUIFER_CD":"300SNDSA","LOCAL_AQUIFER_NAME":"Sandstone Aquifer","SITE_TYPE":"WELL","AQFR_CHAR":null,"QW_SYS_NAME":null,"QW_SN_FLAG":"0","QW_SN_DESC":"No","QW_BASELINE_FLAG":null,"QW_BASELINE_DESC":null,"QW_WELL_CHARS":null,"QW_WELL_CHARS_DESC":null,"QW_WELL_TYPE":null,"QW_WELL_TYPE_DESC":null,"QW_WELL_PURPOSE":null,"QW_WELL_PURPOSE_DESC":null,"QW_WELL_PURPOSE_NOTES":null,"WL_SYS_NAME":"WI Active WL network","WL_SN_FLAG":"1","WL_SN_DESC":"Yes","WL_BASELINE_FLAG":"1","WL_BASELINE_DESC":"Yes","WL_WELL_CHARS":"2","WL_WELL_CHARS_DESC":"Suspected / Anticipated Changes","WL_WELL_TYPE":"2","WL_WELL_TYPE_DESC":"Trend","WL_WELL_PURPOSE":"1","WL_WELL_PURPOSE_DESC":"Dedicated Monitoring/Observation","WL_WELL_PURPOSE_NOTES":null,"INSERT_DATE":"2015-09-11Z","UPDATE_DATE":"2018-07-15Z","DATA_PROVIDER":"nwiswi_er_usgs_gov","WL_DATA_PROVIDER":null,"QW_DATA_PROVIDER":null,"LITH_DATA_PROVIDER":"USGS","CONST_DATA_PROVIDER":"USGS","WL_DATA_FLAG":1,"QW_DATA_FLAG":0,"LOG_DATA_FLAG":0,"LINK":"http://waterdata.usgs.gov/nwis/inventory?search_site_no=430406089232901&search_site_no_match_type=exact&sort_key=site_no&group_key=NONE&sitefile_output_format=html_table&column_name=agency_cd&column_name=site_no&column_name=station_nm&format=station_manuscript&list_of_search_criteria=search_site_no","bbox":[-89.3928,43.068372221281,-89.3928,43.068372221281]}}],"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG::4326"}},"bbox":[-89.3928,43.068372221281,-89.3928,43.068372221281]}'

    @mock.patch('ngwmn.services.ngwmn.r.post')
    @mock.patch('ngwmn.views.get_well_lithography')
    def test_best_case(self, well_lith_mock, post_mock):
        well_lith_mock.return_value = fromstring(self.test_well_xml)
        post_resp = mock.Mock(r.Response)
        post_resp.content = self.test_summary_json
        post_resp.json.return_value = json.loads(self.test_summary_json)
        post_resp.status_code = 200
        post_mock.return_value = post_resp

        response = self.app_client.get('/site-location/{}/{}/'.format(self.test_agency_cd, self.test_location_id))
        post_mock.assert_called_once()
        self.assertEqual(response.status_code, 200)

    @mock.patch('ngwmn.services.ngwmn.r.post')
    @mock.patch('ngwmn.views.get_well_lithography')
    def test_failed_service_with_non_server_error(self, well_lith_mock, post_mock):
        well_lith_mock.return_value = fromstring(self.test_well_xml)
        post_resp = mock.Mock(r.Response)
        post_resp.content = self.test_summary_json
        post_resp.status_code = 403
        post_resp.reason = 'Forbidden'
        post_mock.return_value = post_resp

        response = self.app_client.get('/site-location/{}/{}/'.format(self.test_agency_cd, self.test_location_id))
        post_mock.assert_called_once()
        self.assertEqual(response.status_code, 503)

    @mock.patch('ngwmn.services.ngwmn.r.post')
    @mock.patch('ngwmn.views.get_well_lithography')
    def test_failed_service_with_server_error(self, well_lith_mock, post_mock):
        well_lith_mock.return_value = fromstring(self.test_well_xml)
        post_resp = mock.Mock(r.Response)
        post_resp.content = self.test_summary_json
        post_resp.status_code = 500
        post_resp.reason = 'server error'
        post_mock.return_value = post_resp

        response = self.app_client.get('/site-location/{}/{}/'.format(self.test_agency_cd, self.test_location_id))
        post_mock.assert_called_once()
        self.assertEqual(response.status_code, 503)

    @mock.patch('ngwmn.views.get_well_lithography')
    def test_no_xml(self, well_lith_mock):
        well_lith_mock.return_value = None
        response = self.app_client.get('/site-location/{}/{}/'.format(self.test_agency_cd, self.test_location_id))
        self.assertEqual(response.status_code, 404)
