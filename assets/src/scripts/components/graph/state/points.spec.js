import getMockStore from 'ngwmn/store.mock';

import { getActiveClasses, getChartPoints, getCurrentWaterLevels,
         getCurrentWaterLevelUnit, getDomainX, getDomainY, getExtentX,
         getLineSegments, MAX_LINE_POINT_GAP } from './points';


describe('graph component points', () => {
    const mockOpts = {
        agencyCode: 'USGS',
        id: 23,
        siteId: '423532088254601',
        siteKey: 'USGS:423532088254601'
    };

    describe('getCurrentWaterLevels', () => {
        const mockLevels = {'USGS:423532088254601': 'level1 obj'};

        it('returns correct object', () => {
            const retVal = getCurrentWaterLevels(mockOpts).resultFunc(mockLevels, 'level1');
            expect(retVal).toBe('level1 obj');
        });

        it('returns empty object when key does not exist', () => {
            const retVal = getCurrentWaterLevels({}).resultFunc(mockLevels, 'level2');
            expect(retVal).toEqual({});
        });

        it('works with mock state', () => {
            const store = getMockStore();
            expect(getCurrentWaterLevels(23)(store.getState())).not.toBe(null);
        });
    });

    describe('getCurrentWaterLevelUnit', () => {
        it('first unit in water level data', () => {
            expect(getCurrentWaterLevelUnit({}).resultFunc({
                samples: [{
                    unit: 'feet'
                }, {
                    unit: 'meters'
                }]
            })).toEqual('feet');
        });

        it('returns null on empty dataset', () => {
            expect(getCurrentWaterLevelUnit({}).resultFunc({
                samples: []
            })).toBe(null);
        });

        it('returns null on non-existent dataset', () => {
            expect(getCurrentWaterLevelUnit({}).resultFunc({})).toBe(null);
        });

        it('works with mock state', () => {
            const store = getMockStore();
            expect(getCurrentWaterLevels(mockOpts)(store.getState())).not.toBe(null);
        });
    });

    describe('getChartPoints', () => {
        it('transforms service data into chartable points', () => {
            expect(getChartPoints({}).resultFunc({
                samples: [{
                    time: new Date('2010-10-10'),
                    fromLandsurfaceValue: '12.2',
                    comment: 'A'
                }, {
                    time: new Date('2010-10-10'),
                    fromLandsurfaceValue: '-1',
                    comment: 'P'
                }]
            })).toEqual([{
                dateTime: new Date('2010-10-10'),
                value: 12.2,
                class: 'approved'
            }, {
                dateTime: new Date('2010-10-10'),
                value: -1,
                class: 'provisional'
            }]);
        });

        it('works with mock state', () => {
            const store = getMockStore();
            expect(getChartPoints(23)(store.getState())).not.toBe(null);
        });
    });

    describe('getExtentX', () => {
        it('returns correct date range', () => {
            expect(getExtentX({}).resultFunc([{
                dateTime: new Date('2010-10-10')
            }, {
                dateTime: new Date('2010-10-11')
            }, {
                dateTime: new Date('2010-10-12')
            }])).toEqual([
                new Date('2010-10-10'),
                new Date('2010-10-12')
            ]);
        });

        it('returns [undefined, undefined] on empty range', () => {
            expect(getExtentX({}).resultFunc([])).toEqual([undefined, undefined]);
        });

        it('works with mock state', () => {
            const store = getMockStore();
            expect(getExtentX(mockOpts)(store.getState())).not.toBe(null);
        });
    });

    describe('getDomainX', () => {
        it('works with mock state', () => {
            const store = getMockStore();
            expect(getDomainX(23, 'main')(store.getState())).not.toBe(null);
            expect(getDomainX(23, 'brush')(store.getState())).not.toBe(null);
        });
    });

    describe('getDomainY', () => {
        it('returns proper range with 20% padding', () => {
            expect(getDomainY(23, 'main').resultFunc([{
                value: 10
            }, {
                value: 15
            }, {
                value: 20
            }])).toEqual([8, 22]);
        });

        it('has zero-lower bound on positive domains', () => {
            expect(getDomainY(23, 'main').resultFunc([{
                value: 1
            }, {
                value: 101
            }])[0]).toBe(0);
        });

        it('works with mock state', () => {
            const store = getMockStore();
            expect(getDomainY(23, 'main')(store.getState())).not.toBe(null);
        });
    });


    describe('getLineSegments', () => {
        it('should separate on approved', () => {
            const dateTime = new Date();
            const value = 1;
            expect(getLineSegments({}).resultFunc([
                {value, dateTime, class: 'approved'},
                {value, dateTime, class: 'approved'},
                {value, dateTime, class: 'provisional'}
            ])).toEqual([{
                class: 'approved',
                points: [
                    {value, dateTime, class: 'approved'},
                    {value, dateTime, class: 'approved'}
                ]
            }, {
                class: 'provisional',
                points: [
                    {value, dateTime, class: 'provisional'}
                ]
            }]);
        });

        it('should separate on gaps greater than MAX_LINE_POINT_GAP', () => {
            const value = 1;
            const dates = [new Date()];
            dates.push(new Date(dates[0].getTime() + MAX_LINE_POINT_GAP));
            dates.push(new Date(dates[1].getTime() + MAX_LINE_POINT_GAP + 1));
            expect(getLineSegments({}).resultFunc([
                {value, dateTime: dates[0], class: 'approved'},
                {value, dateTime: dates[1], class: 'approved'},
                {value, dateTime: dates[2], class: 'approved'}
            ])).toEqual([{
                class: 'approved',
                points: [
                    {value, dateTime: dates[0], class: 'approved'},
                    {value, dateTime: dates[1], class: 'approved'}
                ]
            }, {
                class: 'approved',
                points: [
                    {value, dateTime: dates[2], class: 'approved'}
                ]
            }]);
        });

        it('works with mock state', () => {
            const store = getMockStore();
            expect(getLineSegments(23)(store.getState())).not.toBe(null);
        });
    });

    describe('getActiveClasses', () => {
        it('returns approved when any point is approved', () => {
            expect(getActiveClasses({}).resultFunc([
                {class: 'approved'},
                {class: 'provisional'},
                {class: 'provisional'},
                {class: 'provisional'}
            ]).approved).toBe(true);
            expect(getActiveClasses({}).resultFunc([
                {class: 'provisional'},
                {class: 'provisional'},
                {class: 'provisional'},
                {class: 'provisional'}
            ]).approved).toBe(false);
        });

        it('returns provisional when any point is not approved', () => {
            expect(getActiveClasses({}).resultFunc([
                {class: 'approved'},
                {class: 'approved'},
                {class: 'provisional'},
                {class: 'approved'}
            ]).provisional).toBe(true);
            expect(getActiveClasses({}).resultFunc([
                {class: 'approved'},
                {class: 'approved'},
                {class: 'approved'},
                {class: 'approved'}
            ]).provisional).toBe(false);
        });

        it('works with mock state', () => {
            const store = getMockStore();
            expect(getActiveClasses(23)(store.getState())).not.toBe(null);
        });
    });
});
