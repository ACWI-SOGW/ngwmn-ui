"""
Mock data for unit testing. It is a convenient place for potentially shared test data.
"""

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
              <gml:description/>
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

MOCK_SITE_INFO = {
    'altDatumCd': 'NGW1701B'
}

MOCK_OVERALL_STATS = {
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
    "IS_RANKED": "N",
    "IS_FETCHED": "Y"
}

MOCK_MONTHLY_STATS = {
    "IS_FETCHED": "Y",
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

MOCK_PROVIDERS_RESPONSE = '[{"AGENCY_CD":"AKDNR","AGENCY_NM":"Alaska Department of Natural Resources","AGENCY_LINK":"http://dnr.alaska.gov/","COUNT":15},{"AGENCY_CD":"ADWR","AGENCY_NM":"Arizona Department of Water Resources","AGENCY_LINK":"http://www.azwater.gov/azdwr/","COUNT":5}]'

MOCK_SITES_RESPONSE = '''
{
   "type": "FeatureCollection",
   "totalFeatures": 2,
   "features": [
      {
         "type": "Feature",
         "id": "VW_GWDP_GEOSERVER.fid-356a3035_166ef30d32a_41bc",
         "geometry": {
            "type": "Point",
            "coordinates": [
               -102.182846,
               37.665543
            ]
         },
         "geometry_name": "GEOM",
         "properties": {
            "MY_SITEID": "CODWR:1127",
            "FID": "CODWR.1127",
            "AGENCY_CD": "CODWR",
            "AGENCY_NM": "Colorado Division of Water Resources",
            "AGENCY_MED": "Colorado Division of Water Resources",
            "SITE_NO": "1127",
            "SITE_NAME": "SHP-03",
            "DISPLAY_FLAG": "1",
            "DEC_LAT_VA": 37.665543,
            "DEC_LONG_VA": -102.182846,
            "HORZ_DATUM": "NAD83",
            "HORZ_METHOD": "GPS",
            "HORZ_ACY": "10 m",
            "ALT_VA": 3827.08,
            "ALT_UNITS": 1,
            "ALT_UNITS_NM": "Feet",
            "ALT_DATUM_CD": "NAVD88",
            "ALT_METHOD": "USGS NED 10-meter DEM",
            "ALT_ACY": "1 m",
            "WELL_DEPTH": 208,
            "WELL_DEPTH_UNITS": 1,
            "WELL_DEPTH_UNITS_NM": "Feet",
            "NAT_AQUIFER_CD": "N100HGHPLN",
            "NAT_AQFR_DESC": "High Plains aquifer",
            "COUNTRY_CD": "US",
            "COUNTRY_NM": "United States of America",
            "STATE_CD": "08",
            "STATE_NM": "Colorado",
            "COUNTY_CD": "099",
            "COUNTY_NM": "Prowers County",
            "LOCAL_AQUIFER_CD": "TO",
            "LOCAL_AQUIFER_NAME": "Ogallala aquifer",
            "SITE_TYPE": "WELL",
            "AQFR_CHAR": "UNCONFINED",
            "QW_SYS_NAME": null,
            "QW_SN_FLAG": "0",
            "QW_SN_DESC": "No",
            "QW_BASELINE_FLAG": null,
            "QW_BASELINE_DESC": null,
            "QW_WELL_CHARS": null,
            "QW_WELL_CHARS_DESC": null,
            "QW_WELL_TYPE": null,
            "QW_WELL_TYPE_DESC": null,
            "QW_WELL_PURPOSE": null,
            "QW_WELL_PURPOSE_DESC": null,
            "QW_WELL_PURPOSE_NOTES": null,
            "WL_SYS_NAME": "CO DWR HydroBase",
            "WL_SN_FLAG": "1",
            "WL_SN_DESC": "Yes",
            "WL_BASELINE_FLAG": "1",
            "WL_BASELINE_DESC": "Yes",
            "WL_WELL_CHARS": "3",
            "WL_WELL_CHARS_DESC": "Known Changes",
            "WL_WELL_TYPE": "1",
            "WL_WELL_TYPE_DESC": "Surveillance",
            "WL_WELL_PURPOSE": "2",
            "WL_WELL_PURPOSE_DESC": "Other",
            "WL_WELL_PURPOSE_NOTES": "Currently in use",
            "INSERT_DATE": "2018-07-02Z",
            "UPDATE_DATE": null,
            "DATA_PROVIDER": null,
            "WL_DATA_PROVIDER": null,
            "QW_DATA_PROVIDER": null,
            "LITH_DATA_PROVIDER": "CODWR",
            "CONST_DATA_PROVIDER": "CODWR",
            "WL_DATA_FLAG": 1,
            "QW_DATA_FLAG": 0,
            "LOG_DATA_FLAG": 1,
            "LINK": "https://dnrweb.state.co.us/cdss/GroundWater/WaterLevels/Details/1127",
            "bbox": [
               -102.182846,
               37.665543,
               -102.182846,
               37.665543
            ]
         }
      },
      {
         "type": "Feature",
         "id": "VW_GWDP_GEOSERVER.fid-356a3035_166ef30d32a_41bd",
         "geometry": {
            "type": "Point",
            "coordinates": [
               -102.25595,
               37.638363
            ]
         },
         "geometry_name": "GEOM",
         "properties": {
            "MY_SITEID": "CODWR:1128",
            "FID": "CODWR.1128",
            "AGENCY_CD": "CODWR",
            "AGENCY_NM": "Colorado Division of Water Resources",
            "AGENCY_MED": "Colorado Division of Water Resources",
            "SITE_NO": "1128",
            "SITE_NAME": "SHP-04",
            "DISPLAY_FLAG": "1",
            "DEC_LAT_VA": 37.638363,
            "DEC_LONG_VA": -102.25595,
            "HORZ_DATUM": "NAD83",
            "HORZ_METHOD": "GPS",
            "HORZ_ACY": "10 m",
            "ALT_VA": 3919.65,
            "ALT_UNITS": 1,
            "ALT_UNITS_NM": "Feet",
            "ALT_DATUM_CD": "NAVD88",
            "ALT_METHOD": "USGS NED 10-meter DEM",
            "ALT_ACY": "1 m",
            "WELL_DEPTH": 610,
            "WELL_DEPTH_UNITS": 1,
            "WELL_DEPTH_UNITS_NM": "Feet",
            "NAT_AQUIFER_CD": "N100HGHPLN",
            "NAT_AQFR_DESC": "High Plains aquifer",
            "COUNTRY_CD": "US",
            "COUNTRY_NM": "United States of America",
            "STATE_CD": "08",
            "STATE_NM": "Colorado",
            "COUNTY_CD": "009",
            "COUNTY_NM": "Baca County",
            "LOCAL_AQUIFER_CD": "TO",
            "LOCAL_AQUIFER_NAME": "Ogallala aquifer",
            "SITE_TYPE": "WELL",
            "AQFR_CHAR": "UNCONFINED",
            "QW_SYS_NAME": null,
            "QW_SN_FLAG": "0",
            "QW_SN_DESC": "No",
            "QW_BASELINE_FLAG": null,
            "QW_BASELINE_DESC": null,
            "QW_WELL_CHARS": null,
            "QW_WELL_CHARS_DESC": null,
            "QW_WELL_TYPE": null,
            "QW_WELL_TYPE_DESC": null,
            "QW_WELL_PURPOSE": null,
            "QW_WELL_PURPOSE_DESC": null,
            "QW_WELL_PURPOSE_NOTES": null,
            "WL_SYS_NAME": "CO DWR HydroBase",
            "WL_SN_FLAG": "1",
            "WL_SN_DESC": "Yes",
            "WL_BASELINE_FLAG": "0",
            "WL_BASELINE_DESC": "No",
            "WL_WELL_CHARS": "3",
            "WL_WELL_CHARS_DESC": "Known Changes",
            "WL_WELL_TYPE": "1",
            "WL_WELL_TYPE_DESC": "Surveillance",
            "WL_WELL_PURPOSE": "2",
            "WL_WELL_PURPOSE_DESC": "Other",
            "WL_WELL_PURPOSE_NOTES": "Currently in use",
            "INSERT_DATE": "2018-07-02Z",
            "UPDATE_DATE": "2018-08-29Z",
            "DATA_PROVIDER": null,
            "WL_DATA_PROVIDER": null,
            "QW_DATA_PROVIDER": null,
            "LITH_DATA_PROVIDER": "CODWR",
            "CONST_DATA_PROVIDER": "CODWR",
            "WL_DATA_FLAG": 1,
            "QW_DATA_FLAG": 0,
            "LOG_DATA_FLAG": 1,
            "LINK": "https://dnrweb.state.co.us/cdss/GroundWater/WaterLevels/Details/1128",
            "bbox": [
               -102.25595,
               37.638363,
               -102.25595,
               37.638363
            ]
         }
      }
    ]
}
'''
