"""
Unit tests for NGWMN views

"""
# pylint: disable=C0103
import datetime
import json
from unittest import TestCase, mock
from urllib.parse import urljoin

import requests_mock

from .. import app
from .services.mock_data import MOCK_SIFTA_RESPONSE, MOCK_WELL_LOG_RESPONSE, MOCK_WQ_RESPONSE, \
    MOCK_OVERALL_STATS, MOCK_MONTHLY_STATS, MOCK_SITE_INFO

SERVICE_ROOT = app.config.get('SERVICE_ROOT')
COOP_SERVICE_PATTERN = app.config['COOPERATOR_SERVICE_PATTERN']

class TestWellPageView(TestCase):
    # pylint: disable=too-many-instance-attributes

    def setUp(self):
        self.app_client = app.test_client()
        _agency_cd = 'DOOP'
        _location_id_1 = '430406089232901'
        _location_id_2 = '430406089232902'
        _year = '2019'
        _date = '2/20/20'

        _iddata_url = 'ngwmn/iddata?request={}&agency_cd={}&siteNo={}'
        self.well_log_url = urljoin(SERVICE_ROOT, _iddata_url.format('well_log', _agency_cd, _location_id_1))
        self.wq_url = urljoin(SERVICE_ROOT, _iddata_url.format('water_quality', _agency_cd, _location_id_1))
        self.sifta_url = COOP_SERVICE_PATTERN.format(site_no=_location_id_1, year=_year, current_date=_date)
        self.site_loc_url_1 = '/provider/{0}/site/{1}/'.format(_agency_cd, _location_id_1)

        self.well_log_url_2 = urljoin(SERVICE_ROOT, _iddata_url.format('well_log', _agency_cd, _location_id_2))
        self.wq_url_2 = urljoin(SERVICE_ROOT, _iddata_url.format('water_quality', _agency_cd, _location_id_2))
        self.sifta_url_2 = COOP_SERVICE_PATTERN.format(site_no=_location_id_1, year=_year, current_date=_date)
        self.site_loc_url_2 = '/provider/{0}/site/{1}/'.format(_agency_cd, _location_id_2)

        _stats_url = '/'.join(['ngwmn_cache', 'direct', 'json'])
        self.site_info_url = '/'.join([SERVICE_ROOT, _stats_url, 'site-info', _agency_cd, _location_id_1])
        self.stats_overall_url = '/'.join([SERVICE_ROOT, _stats_url, 'wl-overall', _agency_cd, _location_id_1])
        self.stats_monthly_url = '/'.join([SERVICE_ROOT, _stats_url, 'wl-monthly', _agency_cd, _location_id_1])
        self.site_info_url_2 = '/'.join([SERVICE_ROOT, _stats_url, 'site-info', _agency_cd, _location_id_2])
        self.stats_overall_url_2 = '/'.join([SERVICE_ROOT, _stats_url, 'wl-overall', _agency_cd, _location_id_2])
        self.stats_monthly_url_2 = '/'.join([SERVICE_ROOT, _stats_url, 'wl-monthly', _agency_cd, _location_id_2])

        self.mock_site_info_json = json.dumps(MOCK_SITE_INFO)
        self.mock_overall_json = json.dumps(MOCK_OVERALL_STATS)
        self.mock_monthly_json = json.dumps(MOCK_MONTHLY_STATS)


    @requests_mock.Mocker()
    @mock.patch('ngwmn.services.sifta.get_current_date')
    def test_best_case(self, mocker, m_get_current_date):
        m_get_current_date.return_value = datetime.date(2020, 2, 20)
        id1 = b'430406089232901'
        id2 = b'430406089232902'

        mocker.post(requests_mock.ANY, text=TEST_SUMMARY_JSON, status_code=200)
        mocker.get(self.well_log_url, content=MOCK_WELL_LOG_RESPONSE, status_code=200)
        mocker.get(self.wq_url, content=MOCK_WQ_RESPONSE, status_code=200)
        mocker.get(self.sifta_url, text=MOCK_SIFTA_RESPONSE, status_code=200)
        mocker.get(self.site_info_url, text=self.mock_site_info_json, status_code=200)
        mocker.get(self.stats_overall_url, text=self.mock_overall_json, status_code=200)
        mocker.get(self.stats_monthly_url, text=self.mock_monthly_json, status_code=200)

        response = self.app_client.get(self.site_loc_url_1)
        self.assertEqual(response.status_code, 200)
        # check that the expected 'site no' is in the response, and the other 'site no' is not
        self.assertIn(id1, response.data)
        self.assertNotIn(id2, response.data)

    # Tests if a nested site (a monitoring location with the same geographic coordinates as another monitoring location)
    # can be selected by site id from a (mock) geoserver response
    # @mock.patch('ngwmn.services.sifta.get_current_date')
    @requests_mock.Mocker()
    @mock.patch('ngwmn.services.sifta.get_current_date')
    def test_nested_monitoring_location(self, mocker, m_get_current_date):
        m_get_current_date.return_value = datetime.date(2020, 2, 20)
        id1 = b'430406089232902'
        id2 = b'430406089232901'

        mocker.post(requests_mock.ANY, text=TEST_SUMMARY_JSON, status_code=200)
        mocker.get(self.well_log_url_2, content=MOCK_WELL_LOG_RESPONSE, status_code=200)
        mocker.get(self.wq_url_2, content=MOCK_WQ_RESPONSE, status_code=200)
        mocker.get(self.sifta_url_2, text=MOCK_SIFTA_RESPONSE, status_code=200)
        mocker.get(self.site_info_url_2, text=self.mock_site_info_json, status_code=200)
        mocker.get(self.stats_overall_url_2, text=self.mock_overall_json, status_code=200)

        response = self.app_client.get(self.site_loc_url_2)
        self.assertEqual(response.status_code, 200)
        # check that the expected 'site no' is in the response, and the other 'site no' is not
        self.assertIn(id1, response.data)
        self.assertNotIn(id2, response.data)

    @requests_mock.Mocker()
    def test_failed_service_with_non_server_error(self, mocker):
        mocker.post(requests_mock.ANY, status_code=403)
        mocker.get(self.well_log_url, content=MOCK_WELL_LOG_RESPONSE, status_code=200)
        mocker.get(self.wq_url, content=MOCK_WQ_RESPONSE, status_code=200)
        mocker.get(self.sifta_url, text=MOCK_SIFTA_RESPONSE, status_code=200)
        mocker.get(self.site_info_url, text=self.mock_site_info_json, status_code=200)
        mocker.get(self.stats_overall_url, text=self.mock_overall_json, status_code=200)
        mocker.get(self.stats_monthly_url, text=self.mock_monthly_json, status_code=200)

        response = self.app_client.get(self.site_loc_url_1)
        self.assertEqual(response.status_code, 503)

    @requests_mock.Mocker()
    def test_failed_service_with_server_error(self, mocker):
        mocker.post(requests_mock.ANY, status_code=500)
        mocker.get(self.well_log_url, content=MOCK_WELL_LOG_RESPONSE, status_code=200)
        mocker.get(self.wq_url, content=MOCK_WQ_RESPONSE, status_code=200)
        mocker.get(self.sifta_url, text=MOCK_SIFTA_RESPONSE, status_code=200)
        mocker.get(self.site_info_url, text=self.mock_site_info_json, status_code=200)
        mocker.get(self.stats_overall_url, text=self.mock_monthly_json, status_code=200)
        mocker.get(self.stats_monthly_url, text=self.mock_monthly_json, status_code=200)

        response = self.app_client.get(self.site_loc_url_1)
        self.assertEqual(response.status_code, 503)

    @requests_mock.Mocker()
    def test_no_xml(self, mocker):
        mocker.get(requests_mock.ANY, status_code=404)
        response = self.app_client.get(self.site_loc_url_1)
        self.assertEqual(response.status_code, 404)


@mock.patch('ngwmn.views.get_providers')
class TestProvidersView(TestCase):

    def setUp(self):
        self.app_client = app.test_client()

    def test_view(self, m):
        m.return_value = [{'agency_cd': 'A', 'agency_nm': 'Agency A'}, {'agency_cd': 'B', 'agency_nm': 'Agency B'}]
        response = self.app_client.get('/provider/')
        self.assertIn(b'Agency A', response.data)
        self.assertIn(b'Agency B', response.data)


@mock.patch('ngwmn.views.get_providers')
@mock.patch('ngwmn.views.pull_feed')
class TestProviderView(TestCase):

    def setUp(self):
        self.app_client = app.test_client()

    def test_bad_agency_cd(self, m_pull_feed, m_get_providers):
        m_pull_feed.return_value = '<div>My Content</div>'
        m_get_providers.return_value = [{'agency_cd': 'A', 'agency_nm': 'Agency A'},
                                        {'agency_cd': 'B', 'agency_nm': 'Agency B'}]
        response = self.app_client.get('/provider/C/')

        self.assertEqual(response.status_code, 404)

    def test_good_agency_cd(self, m_pull_feed, m_get_providers):
        m_pull_feed.return_value = '<div>My Content</div>'
        m_get_providers.return_value = [{'agency_cd': 'A', 'agency_nm': 'Agency A'},
                                        {'agency_cd': 'B', 'agency_nm': 'Agency B'}]
        response = self.app_client.get('/provider/A/')
        self.assertIn(b'Agency A', response.data)
        self.assertIn(b'<div>My Content</div>', response.data)


@mock.patch('ngwmn.views.get_sites')
class TestSitesView(TestCase):

    def setUp(self):
        self.app_client = app.test_client()

    def test_bad_agency_cd(self, m_get_sites):
        m_get_sites.return_value = []
        response = self.app_client.get('/provider/CODWR/site/')

        self.assertEqual(404, response.status_code)

    def test_good_agency_cd(self, m_get_sites):
        m_get_sites.return_value = [
            {'agency_cd': 'CODWR', 'agency_nm': 'CO Water Resources', 'site_no': 'AAAA', 'site_name': 'Site A'},
            {'agency_cd': 'CODWR', 'agency_nm': 'CO Water Resources', 'site_no': 'BBBB', 'site_name': 'Site B'}
        ]
        response = self.app_client.get('/provider/CODWR/site/')

        self.assertEqual(m_get_sites.call_args[0][0], 'CODWR')
        self.assertIn(b'CODWR', response.data)
        self.assertIn(b'CO Water Resources', response.data)
        self.assertIn(b'Site A', response.data)
        self.assertIn(b'Site B', response.data)
        self.assertIn(b'AAAA', response.data)
        self.assertIn(b'BBBB', response.data)


TEST_SUMMARY_JSON = """{
    "type": "FeatureCollection",
    "totalFeatures": 2,
    "features": [{
        "type": "Feature",
        "id": "VW_GWDP_GEOSERVER.fid--77a549f6_164a44aea49_2db5",
        "geometry": {
            "coordinates": [
                -89.3928,
                43.068372221281
            ],
            "type": "Point"
        },
        "geometry_name": "GEOM",
        "properties": {
        "AGENCY_CD": "USGS",
        "AGENCY_MED": "U.S. Geological Survey",
        "AGENCY_NM": "U.S. Geological Survey",
        "ALT_ACY": "+/- 0.1 ft",
        "ALT_DATUM_CD": "NAVD88",
        "ALT_METHOD": null,
        "ALT_UNITS": 1,
        "ALT_UNITS_NM": "Feet",
        "ALT_VA": 859,
        "AQFR_CHAR": null,
        "CONST_DATA_PROVIDER": "USGS",
        "COUNTRY_CD": "US",
        "COUNTRY_NM": "United States of America",
        "COUNTY_CD": "025",
        "COUNTY_NM": "Dane County",
        "DATA_PROVIDER": "nwiswi_er_usgs_gov",
        "DEC_LAT_VA": 43.0683722222222,
        "DEC_LONG_VA": -89.3928,
        "DISPLAY_FLAG": "1",
        "FID": "USGS.430406089232901",
        "HORZ_ACY": "Accurate to +/- .01 second (differentially corrected GPS)",
        "HORZ_DATUM": "NAD83",
        "HORZ_METHOD": "GNSS4 - Level 1 Quality Survey Grade Global Navigation Satellite System",
        "INSERT_DATE": "2015-09-11Z",
        "LINK": "http://waterdata.usgs.gov/nwis/inventory?search_site_no=430406089232901&search_site_no_match_type=exact&sort_key=site_no&group_key=NONE&sitefile_output_format=html_table&column_name=agency_cd&column_name=site_no&column_name=station_nm&format=station_manuscript&list_of_search_criteria=search_site_no",
        "LITH_DATA_PROVIDER": "USGS",
        "LOCAL_AQUIFER_CD": "300SNDSA",
        "LOCAL_AQUIFER_NAME": "Sandstone Aquifer",
        "LOG_DATA_FLAG": 0,
        "MY_SITEID": "USGS:430406089232901",
        "NAT_AQFR_DESC": "Cambrian-Ordovician aquifer system",
        "NAT_AQUIFER_CD": "S300CAMORD",
        "QW_BASELINE_DESC": null,
        "QW_BASELINE_FLAG": null,
        "QW_DATA_FLAG": 0,
        "QW_DATA_PROVIDER": null,
        "QW_SN_DESC": "No",
        "QW_SN_FLAG": "0",
        "QW_SYS_NAME": null,
        "QW_WELL_CHARS": null,
        "QW_WELL_CHARS_DESC": null,
        "QW_WELL_PURPOSE": null,
        "QW_WELL_PURPOSE_DESC": null,
        "QW_WELL_PURPOSE_NOTES": null,
        "QW_WELL_TYPE": null,
        "QW_WELL_TYPE_DESC": null,
        "SITE_NAME": "DN-07/09E/23-1297",
        "SITE_NO": "430406089232901",
        "SITE_TYPE": "WELL",
        "STATE_CD": "55",
        "STATE_NM": "Wisconsin",
        "UPDATE_DATE": "2018-07-15Z",
        "WELL_DEPTH": 68,
        "WELL_DEPTH_UNITS": 1,
        "WELL_DEPTH_UNITS_NM": "Feet",
        "WL_BASELINE_DESC": "Yes",
        "WL_BASELINE_FLAG": "1",
        "WL_DATA_FLAG": 1,
        "WL_DATA_PROVIDER": null,
        "WL_SN_DESC": "Yes",
        "WL_SN_FLAG": "1",
        "WL_SYS_NAME": "WI Active WL network",
        "WL_WELL_CHARS": "2",
        "WL_WELL_CHARS_DESC": "Suspected / Anticipated Changes",
        "WL_WELL_PURPOSE": "1",
        "WL_WELL_PURPOSE_DESC": "Dedicated Monitoring/Observation",
        "WL_WELL_PURPOSE_NOTES": null,
        "WL_WELL_TYPE": "2",
        "WL_WELL_TYPE_DESC": "Trend",
        "bbox": [
            -89.3928,
              43.068372221281,
            -89.3928,
            43.068372221281
        ]
        }
    },
    {   
        "type": "Feature",
        "id": "VW_GWDP_GEOSERVER.fid--77a549f6_164a44aea49_2db5",
        "geometry": {
            "coordinates": [
                -89.3928,
                43.068372221281
            ],
            "type": "Point"
        },
        "geometry_name": "GEOM",
        "properties": {
            "AGENCY_CD": "USGS",
            "AGENCY_MED": "U.S. Geological Survey",
            "AGENCY_NM": "U.S. Geological Survey",
            "ALT_ACY": "+/- 0.1 ft",
            "ALT_DATUM_CD": "NAVD88",
            "ALT_METHOD": null,
            "ALT_UNITS": 1,
            "ALT_UNITS_NM": "Feet",
            "ALT_VA": 859,
            "AQFR_CHAR": null,
            "CONST_DATA_PROVIDER": "USGS",
            "COUNTRY_CD": "US",
            "COUNTRY_NM": "United States of America",
            "COUNTY_CD": "025",
            "COUNTY_NM": "Dane County",
            "DATA_PROVIDER": "nwiswi_er_usgs_gov",
            "DEC_LAT_VA": 43.0683722222222,
            "DEC_LONG_VA": -89.3928,
            "DISPLAY_FLAG": "1",
            "FID": "USGS.430406089232902",
            "HORZ_ACY": "Accurate to +/- .01 second (differentially corrected GPS)",
            "HORZ_DATUM": "NAD83",
            "HORZ_METHOD": "GNSS4 - Level 1 Quality Survey Grade Global Navigation Satellite System",
            "INSERT_DATE": "2015-09-11Z",
            "LINK": "http://waterdata.usgs.gov/nwis/inventory?search_site_no=430406089232902&search_site_no_match_type=exact&sort_key=site_no&group_key=NONE&sitefile_output_format=html_table&column_name=agency_cd&column_name=site_no&column_name=station_nm&format=station_manuscript&list_of_search_criteria=search_site_no",
            "LITH_DATA_PROVIDER": "USGS",
            "LOCAL_AQUIFER_CD": "300SNDSA",
            "LOCAL_AQUIFER_NAME": "Sandstone Aquifer",
            "LOG_DATA_FLAG": 0,
            "MY_SITEID": "USGS:430406089232902",
            "NAT_AQFR_DESC": "Cambrian-Ordovician aquifer system",
            "NAT_AQUIFER_CD": "S300CAMORD",
            "QW_BASELINE_DESC": null,
            "QW_BASELINE_FLAG": null,
            "QW_DATA_FLAG": 0,
            "QW_DATA_PROVIDER": null,
            "QW_SN_DESC": "No",
            "QW_SN_FLAG": "0",
            "QW_SYS_NAME": null,
            "QW_WELL_CHARS": null,
            "QW_WELL_CHARS_DESC": null,
            "QW_WELL_PURPOSE": null,
            "QW_WELL_PURPOSE_DESC": null,
            "QW_WELL_PURPOSE_NOTES": null,
            "QW_WELL_TYPE": null,
            "QW_WELL_TYPE_DESC": null,
            "SITE_NAME": "DN-07/09E/23-1297",
            "SITE_NO": "430406089232902",
            "SITE_TYPE": "WELL",
            "STATE_CD": "55",
            "STATE_NM": "Wisconsin",
            "UPDATE_DATE": "2018-07-15Z",
            "WELL_DEPTH": 68,
            "WELL_DEPTH_UNITS": 1,
            "WELL_DEPTH_UNITS_NM": "Feet",
            "WL_BASELINE_DESC": "Yes",
            "WL_BASELINE_FLAG": "1",
            "WL_DATA_FLAG": 1,
            "WL_DATA_PROVIDER": null,
            "WL_SN_DESC": "Yes",
            "WL_SN_FLAG": "1",
            "WL_SYS_NAME": "WI Active WL network",
            "WL_WELL_CHARS": "2",
            "WL_WELL_CHARS_DESC": "Suspected / Anticipated Changes",
            "WL_WELL_PURPOSE": "1",
            "WL_WELL_PURPOSE_DESC": "Dedicated Monitoring/Observation",
            "WL_WELL_PURPOSE_NOTES": null,
            "WL_WELL_TYPE": "2",
            "WL_WELL_TYPE_DESC": "Trend",
            "bbox": [
                -89.3928,
                43.068372221281,
                -89.3928,
                43.068372221281
            ]
        }
    }
    ]
}"""
