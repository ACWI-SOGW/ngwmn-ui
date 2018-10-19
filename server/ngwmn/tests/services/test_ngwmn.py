"""
Unit tests for data fetch utility functions
"""

from unittest import TestCase, mock

import requests as r
import requests_mock
import copy

from ngwmn.services import ServiceException
from ngwmn.services.ngwmn import (
    generate_bounding_box_values, get_iddata, get_water_quality, get_well_log, get_statistic, get_statistics)
from .mock_data import MOCK_WELL_LOG_RESPONSE, MOCK_WQ_RESPONSE


class TestGetStatistics(TestCase):

    def setUp(self):
        self.test_service_root = 'http://test.gov'
        self.test_agency_cd = 'TEST'
        self.test_site_no = 'TS-42'

        self.overall_not_ranked = {
            "CALC_DATE": "2018-10-18",
            "SAMPLE_COUNT": "2330",
            "MAX_DATE": "2018-10-02T00:00:00-07:00",
            "MEDIATION": "BelowLand",
            "RECORD_YEARS": "11.5",
            "MEDIAN_VALUE": "26.963750",
            "LATEST_PCTILE": "1",
            "MAX_VALUE": "23.960000",
            "MIN_VALUE": "30.469583",
            "LATEST_VALUE": "24.370000",
            "MIN_DATE": "2007-04-26T00:00:00-07:00",
            "IS_RANKED": "N"
        }
        self.overall_ranked = copy.copy(self.overall_not_ranked)
        self.overall_ranked['IS_RANKED'] = 'Y'

        self.monthly = {
            "1": {
                "P75": "25.150000",
                "SAMPLE_COUNT": "217",
                "MONTH": "1",
                "P50_MIN": "27.204583",
                "P10": "27.095166",
                "P25": "26.565417",
                "P90": "24.582500",
                "P50_MAX": "24.518125",
                "RECORD_YEARS": "11",
                "P50": "25.650000"
            },
            "2": {
                "P75": "25.256979",
                "SAMPLE_COUNT": "200",
                "MONTH": "2",
                "P50_MIN": "27.233333",
                "P10": "27.216812",
                "P25": "26.992969",
                "P90": "25.187354",
                "P50_MAX": "25.183958",
                "RECORD_YEARS": "10",
                "P50": "25.840000"
            },
            "3": {
                "P75": "25.820729",
                "SAMPLE_COUNT": "221",
                "MONTH": "3",
                "P50_MIN": "27.565833",
                "P10": "27.532083",
                "P25": "27.148333",
                "P90": "25.518792",
                "P50_MAX": "25.505000",
                "RECORD_YEARS": "10",
                "P50": "26.440000"
            },
            "4": {
                "P75": "26.160000",
                "SAMPLE_COUNT": "187",
                "MONTH": "4",
                "P50_MIN": "27.838750",
                "P10": "27.790375",
                "P25": "27.266042",
                "P90": "25.016125",
                "P50_MAX": "24.732083",
                "RECORD_YEARS": "11",
                "P50": "26.480000"
            },
            "5": {
                "P75": "26.360000",
                "SAMPLE_COUNT": "192",
                "MONTH": "5",
                "P50_MIN": "28.068333",
                "P10": "28.040666",
                "P25": "27.644583",
                "P90": "24.422000",
                "P50_MAX": "23.960000",
                "RECORD_YEARS": "11",
                "P50": "26.740000"
            },
            "6": {
                "P75": "26.507500",
                "SAMPLE_COUNT": "185",
                "MONTH": "6",
                "P50_MIN": "29.867708",
                "P10": "29.784146",
                "P25": "28.916459",
                "P90": "26.374000",
                "P50_MAX": "26.370000",
                "RECORD_YEARS": "10",
                "P50": "27.656563"
            },
            "7": {
                "P75": "27.610000",
                "SAMPLE_COUNT": "191",
                "MONTH": "7",
                "P50_MIN": "29.775833",
                "P10": "29.745583",
                "P25": "29.295000",
                "P90": "26.956000",
                "P50_MAX": "26.940000",
                "RECORD_YEARS": "11",
                "P50": "28.260000"
            },
            "8": {
                "P75": "27.792500",
                "SAMPLE_COUNT": "191",
                "MONTH": "8",
                "P50_MIN": "29.451250",
                "P10": "29.349125",
                "P25": "28.229687",
                "P90": "27.662000",
                "P50_MAX": "27.650000",
                "RECORD_YEARS": "10",
                "P50": "28.040833"
            },
            "9": {
                "P75": "25.260009",
                "SAMPLE_COUNT": "199",
                "MONTH": "9",
                "P50_MIN": "27.040009",
                "P10": "27.026009",
                "P25": "26.693759",
                "P90": "24.480009",
                "P50_MAX": "24.370009",
                "RECORD_YEARS": "19",
                "P50": "25.915419"
            },
            "10": {
                "P75": "25.260000",
                "SAMPLE_COUNT": "191",
                "MONTH": "10",
                "P50_MIN": "27.040000",
                "P10": "27.026000",
                "P25": "26.693750",
                "P90": "24.480000",
                "P50_MAX": "24.370000",
                "RECORD_YEARS": "11",
                "P50": "25.915416"
            },
        }

        self.test_stats = { self.test_agency_cd : {
            '-'.join([self.test_site_no, 'NOT_RANKED']) : {
                'wl-overall' : self.overall_not_ranked,
                'site-info': {'altDatumCd':'NGW1701A'},
                'wl-monthly' : {
                    'N/A': 'not called'
                }
            },
            self.test_site_no: {
                'wl-overall': self.overall_ranked,
                'site-info': {'altDatumCd': 'NGW1701B'},
                'wl-monthly': {
                    '1': self.monthly['1']
                }
            }
        }}

    @mock.patch('ngwmn.services.ngwmn.r.get')
    def test_get_statistic__success(self, r_mock):
        m_resp = mock.Mock(r.Response)
        m_resp.text = '{"value":"SUCCESS"}'
        m_resp.status_code = 200
        m_resp.url = self.test_service_root
        r_mock.return_value = m_resp
        result = get_statistic(self.test_agency_cd, self.test_site_no, 'site-info', self.test_service_root)
        self.assertEqual(result['value'], 'SUCCESS')
        self.assertEqual(result['IS_FETCHED'], 'Y')
        url = '/'.join([self.test_service_root, 'ngwmn_cache/direct/json/site-info', self.test_agency_cd, self.test_site_no])
        r_mock.assert_called_with(url)

    @mock.patch('ngwmn.services.ngwmn.r.get')
    def test_get_statistics__status_500(self, r_mock):
        m_resp = mock.Mock(r.Response)
        m_resp.status_code = 500
        m_resp.url = 'http://url'
        m_resp.reason = 'reason 500'
        r_mock.return_value = m_resp
        with self.assertRaises(ServiceException):
            result = get_statistic(self.test_agency_cd, self.test_site_no, 'site-info', self.test_service_root)

    @mock.patch('ngwmn.services.ngwmn.r.get')
    def test_get_statistics__status_404(self, r_mock):
        m_resp = mock.Mock(r.Response)
        m_resp.status_code = 404
        m_resp.url = self.test_service_root
        m_resp.reason = 'reason 404'
        r_mock.return_value = m_resp
        result = get_statistic(self.test_agency_cd, self.test_site_no, 'site-info', self.test_service_root)
        self.assertEqual(result['IS_FETCHED'], 'N')
        self.assertEqual(result['IS_RANKED'], 'N')

    def mock_stat(self, agency_cd, site_no, stat_type, service):
        return self.test_stats[agency_cd][site_no][stat_type]

    @mock.patch('ngwmn.services.ngwmn')
    def test_get_statistics__status_404(self, ngwmn_mock):
        ngwmn_mock.get_statistic = self.mock_stat
        result = ngwmn_mock.get_statistic(self.test_agency_cd, self.test_site_no, 'site-info', self.test_service_root)


class TestGetWellLithography(TestCase):

    def setUp(self):
        self.test_service_root = 'http://fake.gov'
        self.test_agency_cd = 'DOOP'
        self.test_location_id = 'BP-1729'
        self.test_xml = '<site><agency>DOOP</agency><id>BP-1729</id></site>'

    @mock.patch('ngwmn.services.ngwmn.r.get')
    def test_get_iddata__success(self, r_mock):
        m_resp = mock.Mock(r.Response)
        m_resp.content = self.test_xml
        m_resp.status_code = 200
        m_resp.url = self.test_service_root
        r_mock.return_value = m_resp
        result = get_iddata('well_log', self.test_agency_cd, self.test_location_id, self.test_service_root)
        self.assertEqual(result.tag, 'site')
        r_mock.assert_called_with(
            'http://fake.gov/ngwmn/iddata',
            params={'request': 'well_log', 'agency_cd': 'DOOP', 'siteNo': 'BP-1729'}
        )

    @mock.patch('ngwmn.services.ngwmn.r.get')
    def test_get_iddata__service_failure(self, r_mock):
        m_resp = mock.Mock(r.Response)
        m_resp.status_code = 500
        m_resp.url = 'http://url'
        m_resp.reason = 'reason'
        r_mock.return_value = m_resp
        with self.assertRaises(ServiceException):
            result = get_iddata('well_log', self.test_agency_cd, self.test_location_id, self.test_service_root)
            # TODO this assertion is not executed
            self.assertIsNone(result)

    @mock.patch('ngwmn.services.ngwmn.r.get')
    def test_get_iddata__syntax_error(self, r_mock):
        m_resp = mock.Mock(r.Response)
        m_resp.content = 'Stuff'
        m_resp.status_code = 200
        m_resp.url = self.test_service_root
        r_mock.return_value = m_resp
        result = get_iddata('well_log', self.test_agency_cd, self.test_location_id, self.test_service_root)
        self.assertIsNone(result)


class TestGenerateBoundingBox(TestCase):

    def setUp(self):
        self.latitude = 45.48
        self.longitude = -16.71
        self.delta = 0.01

    def test_decimal_vals(self):
        result = generate_bounding_box_values(self.latitude, self.longitude, self.delta)
        self.assertAlmostEqual(result[0], -16.72)
        self.assertAlmostEqual(result[1], 45.47)
        self.assertAlmostEqual(result[2], -16.70)
        self.assertAlmostEqual(result[3], 45.49)

    def test_string_vals(self):
        result = generate_bounding_box_values(str(self.latitude), str(self.longitude), self.delta)
        self.assertAlmostEqual(result[0], -16.72)
        self.assertAlmostEqual(result[1], 45.47)
        self.assertAlmostEqual(result[2], -16.70)
        self.assertAlmostEqual(result[3], 45.49)


class TestWaterQualityResults(TestCase):
    def test_wq_parsing(self):
        with requests_mock.mock() as req:
            req.get(requests_mock.ANY, content=MOCK_WQ_RESPONSE)
            results = get_water_quality('USGS', 1)
            self.assertEqual(results['organization'], {
                'id': 'USGS-MI',
                'name': 'USGS Michigan Water Science Center'
            })
            self.assertEqual(results['activities'], [{
                'description': {
                    'comment_text': 'Test comment',
                    'identifier': 'nwismi.01.98000888',
                    'media_name': 'Water',
                    'monitoring_location_identifier': 'USGS-462421087242701',
                    'project_identifier': 'Unknown',
                    'start_date': '1980-07-24',
                    'start_time': {
                        'time': '14:15:00',
                        'time_zone_code': 'EDT'
                    },
                    'type_code': 'Sample-Routine'
                },
                'results': [
                    {
                        'analytical_method': {
                            'identifier': 'Unknown',
                            'identifier_context': 'Unknown',
                            'name': 'Unknown'
                        },
                        'description': {
                            'characteristic_name': 'Carbon dioxide',
                            'comment_text': None,
                            'detection_condition_text': None,
                            'measure': {
                                'unit_code': 'mg/l',
                                'value': '0.1'
                            },
                            'sample_fraction_text': 'Total',
                            'temperature_basis_text': None,
                            'value_type_name': 'Actual'
                        },
                        'lab_information': {
                            'analysis_start_date': 'Unknown',
                            'analysis_start_time': {
                                'time': '00:00:00',
                                'time_zone_code': 'EDT'
                            },
                            'detection_quantitation_limit': {
                                'measure': {
                                    'unit_code': None,
                                    'value': None
                                },
                                'type_name': None
                            }
                        },
                        'pcode': '00405',
                        'provider_name': 'USGS-MI'
                    },
                    {
                        'analytical_method': {
                            'identifier': 'Unknown',
                            'identifier_context': 'Unknown',
                            'name': 'Unknown'
                        },
                        'description': {
                            'characteristic_name': 'pH',
                            'comment_text': None,
                            'detection_condition_text': None,
                            'measure': {
                                'unit_code': 'std units',
                                'value': '9.0'
                            },
                            'sample_fraction_text': 'Total',
                            'temperature_basis_text': None,
                            'value_type_name': 'Actual'
                        },
                        'lab_information': {
                            'analysis_start_date': 'Unknown',
                            'analysis_start_time': {
                                'time': '00:00:00',
                                'time_zone_code': 'EDT'
                            },
                            'detection_quantitation_limit': {
                                'measure': {
                                    'unit_code': None,
                                    'value': None
                                },
                                'type_name': None
                            }
                        },
                        'pcode': '00400',
                        'provider_name': 'USGS-MI'
                    },
                    {
                        'analytical_method': {
                            'identifier': 'Unknown',
                            'identifier_context': 'Unknown',
                            'name': 'Unknown'
                        },
                        'description': {
                            'characteristic_name': 'Specific conductance',
                            'comment_text': None,
                            'detection_condition_text': None,
                            'measure': {
                                'unit_code': 'uS/cm @25C',
                                'value': '73'
                            },
                            'sample_fraction_text': 'Total',
                            'temperature_basis_text': None,
                            'value_type_name': 'Actual'
                        },
                        'lab_information': {
                            'analysis_start_date': 'Unknown',
                            'analysis_start_time': {
                                'time': '00:00:00',
                                'time_zone_code': 'EDT'
                            },
                            'detection_quantitation_limit': {
                                'measure': {
                                    'unit_code': None,
                                    'value': None
                                },
                                'type_name': None
                            }
                        },
                        'pcode': '00095',
                        'provider_name': 'USGS-MI'
                    }
                ],
                'sample_description': {
                    'collection_equipment_name': 'Unknown',
                    'collection_method': {
                        'identifier': 'USGS',
                        'identifier_context': 'USGS',
                        'name': 'USGS'
                    }
                }
            }])


class TestWellLogResults(TestCase):
    def test_well_log_parsing(self):
        self.maxDiff = None
        with requests_mock.mock() as req:
            req.get(requests_mock.ANY, content=MOCK_WELL_LOG_RESPONSE)
            well_log = get_well_log('USGS', 1)
            self.assertEqual(well_log, {
                'name': 'KSGS.381107098532401',
                'location': {
                    'latitude': '38.18533',
                    'longitude': '-98.88991'
                },
                'elevation': {
                    'unit': 'ft',
                    'value': 1950.0,
                    'scheme': 'NAVD88',
                },
                'well_depth': {
                    'unit': 'ft',
                    'value': 214.0
                },
                'water_use': 'urn:OGC:unknown',
                'link': {
                    'title': 'Kansas Geological Survey',
                    'url': 'http://ws.ncwater.org/ngwmn.php?site_no=381107098532401'
                },
                'log_entries': [{
                    'method': 'borehole',
                    'unit': {
                        'description': 'Sandstone',
                        'ui': {
                            'colors': [],
                            'materials': [608, 609, 611, 612, 613]
                        },
                        'purpose': 'instance',
                        'composition':  {
                            'role': 'contains',
                            'lithology': {
                                'scheme': 'urn:x-ngwd:classifierScheme:USGS:Lithology:2011',
                                'value': 'SANDSTONE'
                            },
                            'material': {
                                'name': 'Sandstone',
                                'purpose': 'instance'
                            },
                            'proportion': {
                                'scheme': 'urn:ietf:rfc:2141',
                                'value': 'urn:ogc:def:nil:OGC:unknown'
                            }
                        }
                    },
                    'shape': {
                        'coordinates': {
                            'start': 0.0,
                            'end': 25.0
                        },
                        'dimension': '1',
                        'unit': 'ft'
                    }
                }, {
                    'method': 'borehole',
                    'unit': {
                        'description': 'Siltstone',
                        'ui': {
                            'colors': [],
                            'materials': [616, 617, 618, 669, 637]
                        },
                        'purpose': 'instance',
                        'composition': {
                            'role': 'contains',
                            'lithology': {
                                'scheme': 'urn:x-ngwd:classifierScheme:USGS:Lithology:2011',
                                'value': 'SILTSTONE'
                            },
                            'material': {
                                'name': 'Siltstone',
                                'purpose': 'instance'
                            },
                            'proportion': {
                                'scheme': 'urn:ietf:rfc:2141',
                                'value': 'urn:ogc:def:nil:OGC:unknown'
                            }
                        }
                    },
                    'shape': {
                        'coordinates': {
                            'start': 25.0,
                            'end': 56.0
                        },
                        'dimension': '1',
                        'unit': 'ft'
                    }
                }, {
                    'method': 'borehole',
                    'unit': {
                        'description': 'Sandstone',
                        'ui': {
                            'colors': [],
                            'materials': [608, 609, 611, 612, 613]
                        },
                        'purpose': 'instance',
                        'composition': {
                            'role': 'contains',
                            'lithology': {
                                'scheme': 'urn:x-ngwd:classifierScheme:USGS:Lithology:2011',
                                'value': 'SANDSTONE'
                            },
                            'material': {
                                'name': 'Sandstone',
                                'purpose': 'instance'
                            },
                            'proportion': {
                                'scheme': 'urn:ietf:rfc:2141',
                                'value': 'urn:ogc:def:nil:OGC:unknown'
                            }
                        }
                    },
                    'shape': {
                        'coordinates': {
                            'start': 56.0,
                            'end': 155.0
                        },
                        'dimension': '1',
                        'unit': 'ft'
                    }
                }],
                'construction': [{
                    'type': 'casing',
                    'position': {
                        'coordinates': {
                            'start': 0.0,
                            'end': 80.9
                        },
                        'unit': 'ft'
                    },
                    'material': 'PVC',
                    'diameter': {
                        'value': 16.0,
                        'unit': 'in'
                    }
                }, {
                    'type': 'screen',
                    'diameter': {
                        'value': None,
                        'unit': 'in',
                    },
                    'material': 'PVC',
                    'position': {
                        'coordinates': {
                            'start': 80.8,
                            'end': 90.8
                        },
                        'unit': 'ft'
                    }
                }, {
                    'type': 'screen',
                    'diameter': {
                        'value': None,
                        'unit': 'in'
                    },
                    'material': 'PVC',
                    'position': {
                        'coordinates': {
                            'end': 212.8,
                            'start': 152.8
                        },
                        'unit': 'ft'
                    }
                }]
            })
