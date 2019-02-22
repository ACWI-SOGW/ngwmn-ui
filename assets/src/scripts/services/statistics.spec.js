import { retrieveMedianWaterLevels } from './statistics';


export const MOCK_MEDIAN_WATER_LEVEL_RESPONSE = '{ \
    "monthly":"not used in the test", \
    "overall":"not used in the test", \
    "medians":" 2016-06-10T04:15:00-05:00,43.00,\\n2006-06-10T04:15:00-05:00,22.00,\\n2010-06-10T04:15:00-05:00,20.00, ", \
    "errors":[], \
    "ok":true \
}';

export const MOCK_MEDIAN_WATER_LEVEL_DATA = [
    { 
        'year':'2016',
        'month':'06',
        'median':'43.00'
    },{
        'year':'2006',
        'month':'06',
        'median':'22.00'
    },{
        'year':'2010',
        'month':'06',
        'median':'20.00'
    }
];

describe('statistics service module', () => {
    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe('retrieveMedianWaterLevels', () => {
        let request;
        let promise;

        beforeEach(() => {
            promise = retrieveMedianWaterLevels('USGS', 1);
            request = jasmine.Ajax.requests.mostRecent();
        });

        it('returns error and empty response on failure', () => {
            request.respondWith({
                status: 500,
                statusText: 'oops my bad'
            });
            promise.then(resp => {
                expect(resp).toEqual({
                    error: true,
                    message: 'Failed with status 500: oops my bad',
                    elevationReference: {},
                    samples: []
                });
            });
        });

        it('returns correctly parsed JSON', () => {
            request.respondWith({
                status: 200,
                responseText: MOCK_MEDIAN_WATER_LEVEL_RESPONSE,
                contentType: 'text/xml'
            });
            promise.then(waterLevels => {
                expect(waterLevels).toEqual(MOCK_MEDIAN_WATER_LEVEL_DATA);
            });
        });

        it('sets a status message on null response', () => {
            request.respondWith({
                status: 200
            });
            promise.then(waterLevels => {
                expect(waterLevels).toEqual({
                    message: 'No water level data available',
                    elevationReference: {},
                    samples: []
                });
            });
        });
    });
});
