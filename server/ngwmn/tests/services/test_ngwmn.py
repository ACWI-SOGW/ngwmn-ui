"""
Unit tests for data fetch utility functions
"""

from unittest import TestCase, mock

import requests as r
import requests_mock
import copy
import ngwmn.services.ngwmn as ngwmn

from ngwmn.services import ServiceException
from ngwmn.services.ngwmn import (
    generate_bounding_box_values, get_iddata, get_water_quality, get_well_log, get_statistic, get_statistics)
from .mock_data import MOCK_WELL_LOG_RESPONSE, MOCK_WQ_RESPONSE, MOCK_OVERALL_STATS, MOCK_MONTHLY_STATS


class TestGetStatistics(TestCase):

    def tearDown(self):
        """
            This Tear Down replaces ngwmn.get_statistics with the original.
            Note, that his could be replaced with a with-clause mock.
        """
        ngwmn.get_statistic = self.save_ngwmn_get_statistic

    def setUp(self):
        # save the method for replacement in tearDown
        self.save_ngwmn_get_statistic = ngwmn.get_statistic

        self.test_service_root = 'http://test.gov'
        self.test_agency_cd = 'TEST'
        self.test_site_no = 'TS-42'
        self.test_site_no_not_ranked = '-'.join([self.test_site_no, 'NOT_RANKED'])
        self.test_site_no_below = '-'.join([self.test_site_no, 'BELOW'])
        self.test_site_no_above = '-'.join([self.test_site_no, 'ABOVE'])

        self.overall_not_ranked = copy.copy(MOCK_OVERALL_STATS)
        self.overall_not_ranked['IS_RANKED'] = 'N'
        self.overall_ranked_below = copy.copy(MOCK_OVERALL_STATS)
        self.overall_ranked_below['IS_RANKED'] = 'Y'
        self.overall_ranked_above = copy.copy(MOCK_OVERALL_STATS)
        self.overall_ranked_above['IS_RANKED'] = 'Y'
        self.overall_ranked_above['MEDIATION'] = 'AboveDatum'

        self.test_stats = {self.test_agency_cd: {
            self.test_site_no_not_ranked: {
                'wl-overall': self.overall_not_ranked,
                'site-info': {
                    'IS_FETCHED': 'Y',
                    'altDatumCd': 'NGW1701A'
                },
                'wl-monthly': {
                    'N/A': 'not called'
                }
            },
            self.test_site_no_below: {
                'wl-overall': self.overall_ranked_below,
                'site-info': {
                    'IS_FETCHED': 'Y',
                    'altDatumCd': 'NGW1701B'
                },
                'wl-monthly': {
                    'IS_FETCHED': 'Y',
                    '1': MOCK_MONTHLY_STATS['1']
                }
            },
            self.test_site_no_above: {
                'wl-overall': self.overall_ranked_above,
                'site-info': {
                    'IS_FETCHED': 'Y',
                    'altDatumCd': 'NGW1701C'
                },
                'wl-monthly': {
                    'IS_FETCHED': 'Y',
                    '1': MOCK_MONTHLY_STATS['1']
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
        self.assertEqual('SUCCESS', result['value'])
        self.assertEqual('Y', result['IS_FETCHED'])
        url = '/'.join([self.test_service_root, 'ngwmn_cache/direct/json/site-info', self.test_agency_cd, self.test_site_no])
        r_mock.assert_called_with(url)

    @mock.patch('ngwmn.services.ngwmn.r.get')
    def test_get_statistic__status_500(self, r_mock):
        m_resp = mock.Mock(r.Response)
        m_resp.status_code = 500
        m_resp.url = 'http://url'
        m_resp.reason = 'reason 500'
        r_mock.return_value = m_resp
        with self.assertRaises(ServiceException):
            result = get_statistic(self.test_agency_cd, self.test_site_no, 'site-info', self.test_service_root)

    @mock.patch('ngwmn.services.ngwmn.r.get')
    def test_get_statistic__status_404(self, r_mock):
        m_resp = mock.Mock(r.Response)
        m_resp.status_code = 404
        m_resp.url = self.test_service_root
        m_resp.reason = 'reason 404'
        r_mock.return_value = m_resp
        result = get_statistic(self.test_agency_cd, self.test_site_no, 'site-info', self.test_service_root)
        self.assertEqual('N', result['IS_FETCHED'])
        self.assertEqual('N', result['IS_RANKED'])

    def mock_stat(self, agency_cd, site_no, stat_type, service='http://test.gov'):
        """
            This is used to replace the ngwmn.get_statistic method.
            It returns data as if it called the ngwmn_cache statistics service
        """
        # the nonranked sites should not call monthly.
        if "NOT_RANKED" in site_no and "month" in stat_type:
            raise ServiceException()
        return self.test_stats[agency_cd][site_no][stat_type]

    def test_get_statistics__below(self):
        ngwmn.get_statistic = self.mock_stat
        stats = ngwmn.get_statistics(self.test_agency_cd, self.test_site_no_below)
        self.assertEqual('Depth to water, feet below land surface', stats['alt_datum'],
                         'When MEDIATION is BelowLand then alt_datum is not displayed.')
        self.assertEqual(1, len(stats['monthly']),
                         'With one month returned there should only be one entry.')
        self.assertEqual('Jan', stats['monthly'][0][0],
                         'Month numbers should be replaced with month abbrev.')

        jan = self.test_stats[self.test_agency_cd][self.test_site_no_below]['wl-monthly']['1']
        self.assertEqual(jan['P50_MIN'], stats['monthly'][0][1], 'Expect the P50 minimum value.')
        self.assertEqual(jan['P10'], stats['monthly'][0][2], 'Expect the P10 value.')
        self.assertEqual(jan['P25'], stats['monthly'][0][3], 'Expect the P25 value.')
        self.assertEqual(jan['P50'], stats['monthly'][0][4], 'Expect the P50 value.')
        self.assertEqual(jan['P75'], stats['monthly'][0][5], 'Expect the P75 value.')
        self.assertEqual(jan['P90'], stats['monthly'][0][6], 'Expect the P90 value.')
        self.assertEqual(jan['P50_MAX'], stats['monthly'][0][7], 'Expect the P50 maximum value.')
        self.assertEqual(jan['SAMPLE_COUNT'], stats['monthly'][0][8], 'Expect the sample count value.')
        self.assertEqual(jan['RECORD_YEARS'], stats['monthly'][0][9], 'Expect the record years value.')

    def test_get_statistics__above(self):
        ngwmn.get_statistic = self.mock_stat
        stats = ngwmn.get_statistics(self.test_agency_cd, self.test_site_no_above)
        self.assertEqual('Water level in feet relative to NGW1701C', stats['alt_datum'],
                         'When MEDIATION is AboveDatum then alt_datum is displayed.')

    def test_get_statistics__not_ranked(self):
        ngwmn.get_statistic = self.mock_stat
        stats = ngwmn.get_statistics(self.test_agency_cd, self.test_site_no_not_ranked)
        self.assertEqual('Depth to water, feet below land surface', stats['alt_datum'],
                         'When MEDIATION is BelowLand then alt_datum is not displayed.')
        self.assertEqual(0, len(stats['monthly']),
                         'With the site is not ranked there should be no monthly data and no mock exception thrown.')

        overall = self.test_stats[self.test_agency_cd][self.test_site_no_below]['wl-overall']
        self.assertEqual(overall['CALC_DATE'], stats['calc_date'], 'Expect the calculated date.')

        self.assertEqual(overall['MIN_VALUE'], stats['overall'][0], 'Expect the minimum value.')
        self.assertEqual(overall['MEDIAN_VALUE'], stats['overall'][1], 'Expect the median value.')
        self.assertEqual(overall['MAX_VALUE'], stats['overall'][2], 'Expect the maximum value.')
        self.assertEqual(overall['MIN_DATE'], stats['overall'][3], 'Expect the minimum date value.')
        self.assertEqual(overall['MAX_DATE'], stats['overall'][4], 'Expect the maximum date value.')
        self.assertEqual(overall['SAMPLE_COUNT'], stats['overall'][5], 'Expect the sample count value.')
        self.assertEqual(overall['RECORD_YEARS'], stats['overall'][6], 'Expect the record years value.')
        self.assertEqual(overall['LATEST_VALUE'], stats['overall'][7], 'Expect the latest value.')
        self.assertEqual(overall['LATEST_PCTILE'], stats['overall'][8], 'Expect the latest percentile.')


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
            results = get_water_quality('USGS', '1')
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
            well_log = get_well_log('USGS', '1')
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
