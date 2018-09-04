"""
Unit tests for data fetch utility functions
"""

from unittest import TestCase, mock

import requests as r
import requests_mock

from ngwmn.services import ServiceException
from ngwmn.services.ngwmn import (
    generate_bounding_box_values, get_iddata, get_water_quality_activities,
    get_well_log)


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
                    'value': '1950'
                },
                'well_depth': {
                    'unit': 'ft',
                    'value': '214'
                },
                'altitude_datum': 'NAVD88',
                'water_use': 'urn:OGC:unknown',
                'link': {
                    'title': 'Kansas Geological Survey',
                    'url': 'http://ws.ncwater.org/ngwmn.php?site_no=381107098532401'
                },
                'log_entries': [{
                    'method': 'borehole',
                    'hydrostatic_graphing_unit': {
                        'description': 'Sandstone',
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
                            'start': '0.00',
                            'end': '25.00'
                        },
                        'dimension': '1',
                        'unit': 'Unknown'
                    }
                }, {
                    'method': 'borehole',
                    'hydrostatic_graphing_unit': {
                        'description': 'Siltstone',
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
                            'start': '25.00',
                            'end': '56.00'
                        },
                        'dimension': '1',
                        'unit': 'Unknown'
                    }
                }, {
                    'method': 'borehole',
                    'hydrostatic_graphing_unit': {
                        'description': 'Sandstone',
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
                            'start': '56.00',
                            'end': '155.00'
                        },
                        'dimension': '1',
                        'unit': 'Unknown'
                    }
                }],
                'casings': [{
                    'position': {
                        'coordinates': {
                            'start': '0',
                            'end': '80.9'
                        },
                        'unit': 'ft'
                    },
                    'material': 'PVC',
                    'diameter': {
                        'value': '16',
                        'unit': 'in'
                    }
                }],
                'screens': [{
                    'diameter': {
                        'value': None,
                        'unit': 'in',
                    },
                    'material': 'PVC',
                    'position': {
                        'coordinates': {
                            'start': '80.8',
                            'end': '90.8'
                        },
                        'unit': 'ft'
                    }
                }, {
                    'diameter': {
                        'value': None,
                        'unit': 'in'
                    },
                    'material': 'PVC',
                    'position': {
                        'coordinates': {
                            'end': '212.8',
                            'start': '152.8'
                        },
                        'unit': 'ft'
                    }
                }],
            })


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

MOCK_WELL_LOG_RESPONSE = b"""<?xml version="1.0" encoding="UTF-8"?>
<wfs:FeatureCollection xmlns:decDat="decodeDatum" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sql="http://apache.org/cocoon/SQL/2.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:om="http://www.opengis.net/om/1.0" xmlns:gml="http://www.opengis.net/gml" xmlns:sa="http://www.opengis.net/sampling/1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gsml="urn:cgi:xmlns:CGI:GeoSciML:2.0" xmlns:gwml="http://www.nrcan.gc.ca/xml/gwml/1" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:h="http://apache.org/cocoon/request/2.0">
  <gml:featureMember>
    <gwml:WaterWell gml:id="KSGS.381107098532401">
      <gml:name codeSpace="http://www.kgs.ku.edu/">KSGS.381107098532401</gml:name>
      <gml:boundedBy>
        <gml:envelope srsName="EPSG:4269">
          <gml:pos srsDimension="2">38.18533 -98.88991</gml:pos>
        </gml:envelope>
      </gml:boundedBy>
      <sa:position>
        <gml:Point srsName="EPSG:4269">
          <gml:pos>38.18533 -98.88991</gml:pos>
        </gml:Point>
      </sa:position>
      <gwml:referenceElevation uom="ft">1950</gwml:referenceElevation>
      <gwml:wellDepth>
        <gsml:CGI_NumericValue>
          <gsml:principalValue uom="ft">214</gsml:principalValue>
        </gsml:CGI_NumericValue>
      </gwml:wellDepth>
      <gwml:wellStatus>
        <gsml:CGI_TermValue>
          <gsml:value codeSpace="urn:gov.usgs.nwis.alt_datum_cd">NAVD88</gsml:value>
        </gsml:CGI_TermValue>
      </gwml:wellStatus>
      <gwml:wellType>
        <gsml:CGI_TermValue>
          <gsml:value codeSpace="urn:gov.usgs.nwis.nat_water_use_cd">urn:OGC:unknown</gsml:value>
        </gsml:CGI_TermValue>
      </gwml:wellType>
      <gwml:onlineResource xlink:href="http://ws.ncwater.org/ngwmn.php?site_no=381107098532401" xlink:title="Kansas Geological Survey"/>
      <gwml:logElement>
        <gsml:MappedInterval>
          <gsml:observationMethod>
            <gsml:CGI_TermValue>
              <gsml:value codeSpace="urn:x-ngwd:classifier:GIN:ObservationMethod">borehole</gsml:value>
            </gsml:CGI_TermValue>
          </gsml:observationMethod>
          <gsml:specification>
            <gwml:HydrostratigraphicUnit gml:id="USGS.430427089284901.300.">
              <gml:description>Sandstone</gml:description>
              <gsml:purpose>instance</gsml:purpose>
              <gsml:composition>
                <gsml:CompositionPart>
                  <gsml:role codeSpace="urn:x-ngwd:classifier:GIN:Role">contains</gsml:role>
                  <gsml:lithology>
                    <gsml:ControlledConcept>
                      <gml:name xmlns:mnobwell="http://mapserver.gis.umn.edu/mapserver" xmlns:lookup="http://lookup" codeSpace="urn:x-ngwd:classifierScheme:USGS:Lithology:2011">SANDSTONE</gml:name>
                    </gsml:ControlledConcept>
                  </gsml:lithology>
                  <gsml:material>
                    <gsml:UnconsolidatedMaterial>
                      <gml:name>Sandstone</gml:name>
                      <gsml:purpose>instance</gsml:purpose>
                    </gsml:UnconsolidatedMaterial>
                  </gsml:material>
                  <gsml:proportion>
                    <gsml:CGI_TermValue>
                      <gsml:value codeSpace="urn:ietf:rfc:2141">urn:ogc:def:nil:OGC:unknown</gsml:value>
                    </gsml:CGI_TermValue>
                  </gsml:proportion>
                </gsml:CompositionPart>
              </gsml:composition>
            </gwml:HydrostratigraphicUnit>
          </gsml:specification>
          <gsml:shape>
            <gml:LineString srsDimension="1" uom="Unknown">
              <gml:coordinates>0.00 25.00</gml:coordinates>
            </gml:LineString>
          </gsml:shape>
        </gsml:MappedInterval>
      </gwml:logElement>
      <gwml:logElement>
        <gsml:MappedInterval>
          <gsml:observationMethod>
            <gsml:CGI_TermValue>
              <gsml:value codeSpace="urn:x-ngwd:classifier:GIN:ObservationMethod">borehole</gsml:value>
            </gsml:CGI_TermValue>
          </gsml:observationMethod>
          <gsml:specification>
            <gwml:HydrostratigraphicUnit gml:id="USGS.430427089284901.2.">
              <gml:description>Siltstone</gml:description>
              <gsml:purpose>instance</gsml:purpose>
              <gsml:composition>
                <gsml:CompositionPart>
                  <gsml:role codeSpace="urn:x-ngwd:classifier:GIN:Role">contains</gsml:role>
                  <gsml:lithology>
                    <gsml:ControlledConcept>
                      <gml:name xmlns:mnobwell="http://mapserver.gis.umn.edu/mapserver" xmlns:lookup="http://lookup" codeSpace="urn:x-ngwd:classifierScheme:USGS:Lithology:2011">SILTSTONE</gml:name>
                    </gsml:ControlledConcept>
                  </gsml:lithology>
                  <gsml:material>
                    <gsml:UnconsolidatedMaterial>
                      <gml:name>Siltstone</gml:name>
                      <gsml:purpose>instance</gsml:purpose>
                    </gsml:UnconsolidatedMaterial>
                  </gsml:material>
                  <gsml:proportion>
                    <gsml:CGI_TermValue>
                      <gsml:value codeSpace="urn:ietf:rfc:2141">urn:ogc:def:nil:OGC:unknown</gsml:value>
                    </gsml:CGI_TermValue>
                  </gsml:proportion>
                </gsml:CompositionPart>
              </gsml:composition>
            </gwml:HydrostratigraphicUnit>
          </gsml:specification>
          <gsml:shape>
            <gml:LineString srsDimension="1" uom="Unknown">
              <gml:coordinates>25.00 56.00</gml:coordinates>
            </gml:LineString>
          </gsml:shape>
        </gsml:MappedInterval>
      </gwml:logElement>
      <gwml:logElement>
        <gsml:MappedInterval>
          <gsml:observationMethod>
            <gsml:CGI_TermValue>
              <gsml:value codeSpace="urn:x-ngwd:classifier:GIN:ObservationMethod">borehole</gsml:value>
            </gsml:CGI_TermValue>
          </gsml:observationMethod>
          <gsml:specification>
            <gwml:HydrostratigraphicUnit gml:id="USGS.430427089284901.3.">
              <gml:description>Sandstone</gml:description>
              <gsml:purpose>instance</gsml:purpose>
              <gsml:composition>
                <gsml:CompositionPart>
                  <gsml:role codeSpace="urn:x-ngwd:classifier:GIN:Role">contains</gsml:role>
                  <gsml:lithology>
                    <gsml:ControlledConcept>
                      <gml:name xmlns:mnobwell="http://mapserver.gis.umn.edu/mapserver" xmlns:lookup="http://lookup" codeSpace="urn:x-ngwd:classifierScheme:USGS:Lithology:2011">SANDSTONE</gml:name>
                    </gsml:ControlledConcept>
                  </gsml:lithology>
                  <gsml:material>
                    <gsml:UnconsolidatedMaterial>
                      <gml:name>Sandstone</gml:name>
                      <gsml:purpose>instance</gsml:purpose>
                    </gsml:UnconsolidatedMaterial>
                  </gsml:material>
                  <gsml:proportion>
                    <gsml:CGI_TermValue>
                      <gsml:value codeSpace="urn:ietf:rfc:2141">urn:ogc:def:nil:OGC:unknown</gsml:value>
                    </gsml:CGI_TermValue>
                  </gsml:proportion>
                </gsml:CompositionPart>
              </gsml:composition>
            </gwml:HydrostratigraphicUnit>
          </gsml:specification>
          <gsml:shape>
            <gml:LineString srsDimension="1" uom="Unknown">
              <gml:coordinates>56.00 155.00</gml:coordinates>
            </gml:LineString>
          </gsml:shape>
        </gsml:MappedInterval>
      </gwml:logElement>
      <gwml:construction>
        <gwml:WellCasing>
          <gwml:wellCasingElement>
            <gwml:WellCasingComponent gml:id="KSGS.381107098532401.CASING.1">
              <gwml:position>
                <gml:LineString srsName="EPSG:4269">
                  <gml:coordinates>0 80.9</gml:coordinates>
                  <gml:uom>ft</gml:uom>
                </gml:LineString>
              </gwml:position>
              <gwml:material>
                <gsml:CGI_TermValue>
                  <gsml:value>PVC</gsml:value>
                </gsml:CGI_TermValue>
              </gwml:material>
              <gwml:nominalPipeDimension>
                <gsml:CGI_NumericValue>
                  <gsml:principalValue uom="in">16</gsml:principalValue>
                </gsml:CGI_NumericValue>
              </gwml:nominalPipeDimension>
            </gwml:WellCasingComponent>
          </gwml:wellCasingElement>
        </gwml:WellCasing>
      </gwml:construction>
      <gwml:construction>
        <gwml:Screen>
          <gwml:screenElement>
            <gwml:ScreenComponent gml:id="KSGS.381107098532401.SCREEN.1">
              <gwml:position>
                <gml:LineString srsName="EPSG:4269">
                  <gml:coordinates>80.8 90.8</gml:coordinates>
                  <gml:uom>ft</gml:uom>
                </gml:LineString>
              </gwml:position>
              <gwml:material>
                <gsml:CGI_TermValue>
                  <gsml:value codeSpace="urn:x-ngwd:classifierScheme:USGS:Screen:2010">PVC</gsml:value>
                </gsml:CGI_TermValue>
              </gwml:material>
              <gwml:nomicalScreenDiameter>
                <gsml:CGI_NumericValue>
                  <gsml:principalValue uom="in"/>
                </gsml:CGI_NumericValue>
              </gwml:nomicalScreenDiameter>
            </gwml:ScreenComponent>
          </gwml:screenElement>
        </gwml:Screen>
      </gwml:construction>
      <gwml:construction>
        <gwml:Screen>
          <gwml:screenElement>
            <gwml:ScreenComponent gml:id="KSGS.381107098532401.SCREEN.2">
              <gwml:position>
                <gml:LineString srsName="EPSG:4269">
                  <gml:coordinates>152.8 212.8</gml:coordinates>
                  <gml:uom>ft</gml:uom>
                </gml:LineString>
              </gwml:position>
              <gwml:material>
                <gsml:CGI_TermValue>
                  <gsml:value codeSpace="urn:x-ngwd:classifierScheme:USGS:Screen:2010">PVC</gsml:value>
                </gsml:CGI_TermValue>
              </gwml:material>
              <gwml:nomicalScreenDiameter>
                <gsml:CGI_NumericValue>
                  <gsml:principalValue uom="in"/>
                </gsml:CGI_NumericValue>
              </gwml:nomicalScreenDiameter>
            </gwml:ScreenComponent>
          </gwml:screenElement>
        </gwml:Screen>
      </gwml:construction>
    </gwml:WaterWell>
  </gml:featureMember>
</wfs:FeatureCollection>"""
