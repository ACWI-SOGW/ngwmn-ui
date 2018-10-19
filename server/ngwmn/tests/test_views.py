"""
Unit tests for NGWMN views

"""
# pylint: disable=C0103

from unittest import TestCase
from urllib.parse import urljoin

import requests_mock

from .. import app
from .services.mock_data import MOCK_SIFTA_RESPONSE, MOCK_WELL_LOG_RESPONSE, MOCK_WQ_RESPONSE

SERVICE_ROOT = app.config.get('SERVICE_ROOT')
COOP_SERVICE_PATTERN = app.config['COOPERATOR_SERVICE_PATTERN']


class TestWellPageView(TestCase):

    def setUp(self):
        self.app_client = app.test_client()
        _agency_cd = 'DOOP'
        _location_id = 'BP-1729'
        _iddata_url = 'ngwmn/iddata?request={}&agency_cd={}&siteNo={}'
        self.well_log_url = urljoin(SERVICE_ROOT, _iddata_url.format('well_log', _agency_cd, _location_id))
        self.wq_url = urljoin(SERVICE_ROOT, _iddata_url.format('water_quality', _agency_cd, _location_id))
        self.sifta_url = COOP_SERVICE_PATTERN.format(site_no=_location_id)
        self.site_loc_url = '/site-location/{}/{}/'.format(_agency_cd, _location_id)

    @requests_mock.Mocker()
    def test_best_case(self, mocker):
        mocker.post(requests_mock.ANY, text=TEST_SUMMARY_JSON, status_code=200)
        mocker.get(self.well_log_url, content=MOCK_WELL_LOG_RESPONSE, status_code=200)
        mocker.get(self.wq_url, content=MOCK_WQ_RESPONSE, status_code=200)
        mocker.get(self.sifta_url, text=MOCK_SIFTA_RESPONSE, status_code=200)
        response = self.app_client.get()
        self.assertEqual(response.status_code, 200)

    @requests_mock.Mocker()
    def test_failed_service_with_non_server_error(self, mocker):
        mocker.post(requests_mock.ANY, status_code=403)
        mocker.get(self.well_log_url, content=MOCK_WELL_LOG_RESPONSE, status_code=200)
        mocker.get(self.wq_url, content=MOCK_WQ_RESPONSE, status_code=200)
        mocker.get(self.sifta_url, text=MOCK_SIFTA_RESPONSE, status_code=200)

        response = self.app_client.get(self.site_loc_url)
        self.assertEqual(response.status_code, 503)

    @requests_mock.Mocker()
    def test_failed_service_with_server_error(self, mocker):
        mocker.post(requests_mock.ANY, status_code=500)
        mocker.get(self.well_log_url, content=MOCK_WELL_LOG_RESPONSE, status_code=200)
        mocker.get(self.wq_url, content=MOCK_WQ_RESPONSE, status_code=200)
        mocker.get(self.sifta_url, text=MOCK_SIFTA_RESPONSE, status_code=200)

        response = self.app_client.get(self.site_loc_url)
        self.assertEqual(response.status_code, 503)

    @requests_mock.Mocker()
    def test_no_xml(self, mocker):
        mocker.get(requests_mock.ANY, status_code=404)
        response = self.app_client.get(self.site_loc_url)
        self.assertEqual(response.status_code, 404)


TEST_SUMMARY_JSON = """{
    "bbox": [
        -89.3928,
        43.068372221281,
        -89.3928,
        43.068372221281
    ],
    "crs": {
        "properties": {
            "name": "urn:ogc:def:crs:EPSG::4326"
        },
        "type": "name"
    },
    "features": [
        {
            "geometry": {
                "coordinates": [
                    -89.3928,
                    43.068372221281
                ],
                "type": "Point"
            },
            "geometry_name": "GEOM",
            "id": "VW_GWDP_GEOSERVER.fid--77a549f6_164a44aea49_2db5",
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
            },
            "type": "Feature"
        }
    ],
    "totalFeatures": 1,
    "type": "FeatureCollection"
}"""
