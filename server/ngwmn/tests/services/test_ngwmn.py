"""
Unit tests for data fetch utility functions
"""

from unittest import TestCase, mock

import requests as r
import requests_mock

from ngwmn.services import ServiceException
from ngwmn.services.ngwmn import (
    generate_bounding_box_values, get_iddata, get_water_quality, get_well_log, get_statistic, get_statistics)
from .mock_data import MOCK_WELL_LOG_RESPONSE, MOCK_WQ_RESPONSE


class TestGetStatistics(TestCase):

    def setUp(self):
        self.test_service_root = 'http://test.gov'
        self.test_agency_cd = 'TEST'
        self.test_site_no = 'TS-42'

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
