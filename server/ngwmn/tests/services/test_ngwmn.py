"""
Unit tests for data fetch utility functions
"""

from unittest import TestCase, mock

import requests as r
import requests_mock

from ngwmn.services import ServiceException
from ngwmn.services.ngwmn import (
    generate_bounding_box_values, get_iddata, get_water_quality_activities)


class TestGetWellLithography(TestCase):

    def setUp(self):
        self.test_service_root = 'http://fake.gov'
        self.test_agency_cd = 'DOOP'
        self.test_location_id = 'BP-1729'
        self.test_xml = '<site><agency>DOOP</agency><id>BP-1729</id></site>'

    @mock.patch('ngwmn.services.ngwmn.r.get')
    def test_success(self, r_mock):
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
    def test_service_failure(self, r_mock):
        m_resp = mock.Mock(r.Response)
        m_resp.status_code = 500
        m_resp.url = 'http://url'
        m_resp.reason = 'reason'
        r_mock.return_value = m_resp
        with self.assertRaises(ServiceException):
            result = get_iddata('well_log', self.test_agency_cd, self.test_location_id, self.test_service_root)
            self.assertIsNone(result)

    @mock.patch('ngwmn.services.ngwmn.r.get')
    def test_syntax_error(self, r_mock):
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
            results = get_water_quality_activities('USGS', 1)
            self.assertEqual(results, [{
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


MOCK_WQ_RESPONSE = b"""<?xml version="1.0" encoding="UTF-8"?>
<WQX xmlns="http://www.exchangenetwork.net/schema/wqx/2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:fn="http://www.w3.org/2005/xpath-functions">
  <Organization>
    <OrganizationDescription>
      <OrganizationIdentifier>USGS-MI</OrganizationIdentifier>
      <OrganizationFormalName>USGS Michigan Water Science Center</OrganizationFormalName>
    </OrganizationDescription>
    <Activity>
      <ActivityDescription>
        <ActivityIdentifier>nwismi.01.98000888</ActivityIdentifier>
        <ActivityTypeCode>Sample-Routine</ActivityTypeCode>
        <ActivityMediaName>Water</ActivityMediaName>
        <ActivityStartDate>1980-07-24</ActivityStartDate>
        <ActivityStartTime>
          <Time>14:15:00</Time>
          <TimeZoneCode>EDT</TimeZoneCode>
        </ActivityStartTime>
        <ProjectIdentifier>Unknown</ProjectIdentifier>
        <MonitoringLocationIdentifier>USGS-462421087242701</MonitoringLocationIdentifier>
        <ActivityCommentText>Test comment</ActivityCommentText>
      </ActivityDescription>
      <SampleDescription>
        <SampleCollectionMethod>
          <MethodIdentifier>USGS</MethodIdentifier>
          <MethodIdentifierContext>USGS</MethodIdentifierContext>
          <MethodName>USGS</MethodName>
        </SampleCollectionMethod>
        <SampleCollectionEquipmentName>Unknown</SampleCollectionEquipmentName>
      </SampleDescription>
      <Result>
        <USGSPcode>00405</USGSPcode>
        <ProviderName>USGS-MI</ProviderName>
        <ResultDescription>
          <ResultDetectionConditionText/>
          <CharacteristicName>Carbon dioxide</CharacteristicName>
          <ResultSampleFractionText>Total</ResultSampleFractionText>
          <ResultMeasure>
            <ResultMeasureValue>0.1</ResultMeasureValue>
            <MeasureUnitCode>mg/l</MeasureUnitCode>
          </ResultMeasure>
          <ResultValueTypeName>Actual</ResultValueTypeName>
          <ResultTemperatureBasisText/>
          <ResultCommentText/>
        </ResultDescription>
        <ResultAnalyticalMethod>
          <MethodIdentifier>Unknown</MethodIdentifier>
          <MethodIdentifierContext>Unknown</MethodIdentifierContext>
          <MethodName>Unknown</MethodName>
        </ResultAnalyticalMethod>
        <ResultLabInformation>
          <AnalysisStartDate>Unknown</AnalysisStartDate>
          <AnalysisStartTime>
            <Time>00:00:00</Time>
            <TimeZoneCode>EDT</TimeZoneCode>
          </AnalysisStartTime>
          <ResultDetectionQuantitationLimit>
            <DetectionQuantitationLimitTypeName/>
            <DetectionQuantitationLimitMeasure>
              <MeasureValue/>
              <MeasureUnitCode/>
            </DetectionQuantitationLimitMeasure>
          </ResultDetectionQuantitationLimit>
        </ResultLabInformation>
      </Result>
      <Result>
        <USGSPcode>00400</USGSPcode>
        <ProviderName>USGS-MI</ProviderName>
        <ResultDescription>
          <ResultDetectionConditionText/>
          <CharacteristicName>pH</CharacteristicName>
          <ResultSampleFractionText>Total</ResultSampleFractionText>
          <ResultMeasure>
            <ResultMeasureValue>9.0</ResultMeasureValue>
            <MeasureUnitCode>std units</MeasureUnitCode>
          </ResultMeasure>
          <ResultValueTypeName>Actual</ResultValueTypeName>
          <ResultTemperatureBasisText/>
          <ResultCommentText/>
        </ResultDescription>
        <ResultAnalyticalMethod>
          <MethodIdentifier>Unknown</MethodIdentifier>
          <MethodIdentifierContext>Unknown</MethodIdentifierContext>
          <MethodName>Unknown</MethodName>
        </ResultAnalyticalMethod>
        <ResultLabInformation>
          <AnalysisStartDate>Unknown</AnalysisStartDate>
          <AnalysisStartTime>
            <Time>00:00:00</Time>
            <TimeZoneCode>EDT</TimeZoneCode>
          </AnalysisStartTime>
          <ResultDetectionQuantitationLimit>
            <DetectionQuantitationLimitTypeName/>
            <DetectionQuantitationLimitMeasure>
              <MeasureValue/>
              <MeasureUnitCode/>
            </DetectionQuantitationLimitMeasure>
          </ResultDetectionQuantitationLimit>
        </ResultLabInformation>
      </Result>
      <Result>
        <USGSPcode>00095</USGSPcode>
        <ProviderName>USGS-MI</ProviderName>
        <ResultDescription>
          <ResultDetectionConditionText/>
          <CharacteristicName>Specific conductance</CharacteristicName>
          <ResultSampleFractionText>Total</ResultSampleFractionText>
          <ResultMeasure>
            <ResultMeasureValue>73</ResultMeasureValue>
            <MeasureUnitCode>uS/cm @25C</MeasureUnitCode>
          </ResultMeasure>
          <ResultValueTypeName>Actual</ResultValueTypeName>
          <ResultTemperatureBasisText/>
          <ResultCommentText/>
        </ResultDescription>
        <ResultAnalyticalMethod>
          <MethodIdentifier>Unknown</MethodIdentifier>
          <MethodIdentifierContext>Unknown</MethodIdentifierContext>
          <MethodName>Unknown</MethodName>
        </ResultAnalyticalMethod>
        <ResultLabInformation>
          <AnalysisStartDate>Unknown</AnalysisStartDate>
          <AnalysisStartTime>
            <Time>00:00:00</Time>
            <TimeZoneCode>EDT</TimeZoneCode>
          </AnalysisStartTime>
          <ResultDetectionQuantitationLimit>
            <DetectionQuantitationLimitTypeName/>
            <DetectionQuantitationLimitMeasure>
              <MeasureValue/>
              <MeasureUnitCode/>
            </DetectionQuantitationLimitMeasure>
          </ResultDetectionQuantitationLimit>
        </ResultLabInformation>
      </Result>
    </Activity>
  </Organization>
</WQX>"""
