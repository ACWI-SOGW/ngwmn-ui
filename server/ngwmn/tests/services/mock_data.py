MOCK_SIFTA_RESPONSE = """
{"Site": "06864000", "Date": "6/19/2018", "Customers":[{"Name":"Kansas Water Office","URL":"http://www.kwo.org/","IconURL":"http://water.usgs.gov/customer/icons/6737.gif"},{"Name":"USGS - Cooperative Matching Funds","URL":"http://water.usgs.gov/coop/","IconURL":"http://water.usgs.gov/customer/icons/usgsIcon.gif"}]}
"""

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
