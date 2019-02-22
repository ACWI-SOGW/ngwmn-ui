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

export const MOCK_WATER_LEVEL_SAMPLES = {
    'samples': [
        {
            'time': '2016-06-10T04:15:00-05:00',
            'originalValue': '43.00',
            'fromLandsurfaceValue': '16.52',
            'fromDatumValue': '842.5',
            'comment': 'A'
        },
        {
            'time':'2006-06-10T04:15:00-05:00',
            'originalValue': '22.00',
            'fromLandsurfaceValue': '16.60',
            'fromDatumValue': '842.4',
            'comment': 'A'
        },
        {
            'time':'2010-06-10T04:15:00-05:00',
            'originalValue': '20.00',
            'fromLandsurfaceValue': '16.60',
            'fromDatumValue': '842.4',
            'comment': 'A'
        }
    ]
};


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
            promise = retrieveMedianWaterLevels(MOCK_WATER_LEVEL_SAMPLES);
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
                    medians: []
                });
            });
        });

        it('returns correctly parsed JSON', () => {
            request.respondWith({
                status: 200,
                response: MOCK_MEDIAN_WATER_LEVEL_RESPONSE,
                contentType: 'text/xml'
            });
            promise.then(waterLevels => {
                expect(waterLevels.medians).toEqual(MOCK_MEDIAN_WATER_LEVEL_DATA);
            });
        });

        it('sets a status message on null response', () => {
            request.respondWith({
                status: 200
            });
            promise.then(waterLevels => {
                expect(waterLevels).toEqual({
                    error: true,
                    message: 'No water level data available',
                    medians: []
                });
            });
        });
    });
});
