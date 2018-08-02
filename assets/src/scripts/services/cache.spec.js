import { retrieveWaterLevels } from './cache';


export const MOCK_WATER_LEVEL_RESPONSE = `<?xml version="1.0" encoding="UTF-8"?>
<water-level-data>
    <elevation-reference>
        <site-elevation>859.0</site-elevation>
        <site-elevation-datum>NAVD88</site-elevation-datum>
    </elevation-reference>
    <samples>
        <sample>
            <agency>USGS</agency>
            <source-code>USGS</source-code>
            <site>430406089232901</site>
            <time>2011-09-30T00:00:00</time>
            <pcode>72019</pcode>
            <direction>down</direction>
            <unit>ft</unit>
            <original-value>16.52</original-value>
            <from-landsurface-value>16.52</from-landsurface-value>
            <from-datum-value>842.5</from-datum-value>
            <comment>A</comment>
            <accuracy-value>Unknown</accuracy-value>
            <accuracy-unit>Unknown</accuracy-unit>
        </sample>
        <sample>
            <agency>USGS</agency>
            <source-code>USGS</source-code>
            <site>430406089232901</site>
            <time>2011-10-01T00:00:00</time>
            <pcode>72019</pcode>
            <direction>down</direction>
            <unit>ft</unit>
            <original-value>16.60</original-value>
            <from-landsurface-value>16.60</from-landsurface-value>
            <from-datum-value>842.4</from-datum-value>
            <comment>A</comment>
            <accuracy-value>Unknown</accuracy-value>
            <accuracy-unit>Unknown</accuracy-unit>
        </sample>
    </samples>
</water-level-data>`;

export const MOCK_WATER_LEVEL_DATA = {
    'elevationReference': {
        'siteElevation': '859.0',
        'siteElevationDatum': 'NAVD88'
    },
    'samples': [
        {
            'agency': 'USGS',
            'sourceCode': 'USGS',
            'site': '430406089232901',
            'time': new Date('2011-09-30T00:00:00'),
            'pcode': '72019',
            'direction': 'down',
            'unit': 'ft',
            'originalValue': '16.52',
            'fromLandsurfaceValue': '16.52',
            'fromDatumValue': '842.5',
            'comment': 'A',
            'accuracyValue': 'Unknown',
            'accuracyUnit': 'Unknown'
        },
        {
            'agency': 'USGS',
            'sourceCode': 'USGS',
            'site': '430406089232901',
            'time': new Date('2011-10-01T00:00:00'),
            'pcode': '72019',
            'direction': 'down',
            'unit': 'ft',
            'originalValue': '16.60',
            'fromLandsurfaceValue': '16.60',
            'fromDatumValue': '842.4',
            'comment': 'A',
            'accuracyValue': 'Unknown',
            'accuracyUnit': 'Unknown'
        }
    ]
};

describe('cache service module', () => {
    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe('retrieveWaterLevels', () => {
        let request;
        let promise;

        beforeEach(() => {
            promise = retrieveWaterLevels('USGS', 1);
            request = jasmine.Ajax.requests.mostRecent();
        });

        it('returns error and empty response on failure', () => {
            request.respondWith({
                status: 500,
                statusText: 'oops my bad'
            });
            promise.then(resp => {
                expect(resp).toEqual({
                    error: 'Failed with status 500: oops my bad',
                    elevationReference: {},
                    samples: []
                });
            });
        });

        it('returns correctly parsed xml', () => {
            request.respondWith({
                status: 200,
                responseText: MOCK_WATER_LEVEL_RESPONSE,
                contentType: 'text/xml'
            });
            promise.then(waterLevels => {
                expect(waterLevels).toEqual(MOCK_WATER_LEVEL_DATA);
            });
        });
    });
});
