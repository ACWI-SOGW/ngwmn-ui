import { getChartPoints, getCurrentWaterLevels, getCurrentWaterLevelUnit,
         getDomainX, getDomainY, getLineSegments, MAX_LINE_POINT_GAP } from './points';


describe('graph component points', () => {
    describe('getCurrentWaterLevels', () => {
        const mockLevels = {'level1': 'level1 obj'};

        it('returns correct object', () => {
            const retVal = getCurrentWaterLevels.resultFunc(mockLevels, 'level1');
            expect(retVal).toBe('level1 obj');
        });

        it('returns empty object when key does not exist', () => {
            const retVal = getCurrentWaterLevels.resultFunc(mockLevels, 'level2');
            expect(retVal).toEqual({});
        });
    });

    describe('getCurrentWaterLevelUnit', () => {
        it('first unit in water level data', () => {
            expect(getCurrentWaterLevelUnit.resultFunc({
                samples: [{
                    unit: 'feet'
                }, {
                    unit: 'meters'
                }]
            })).toEqual('feet');
        });

        it('returns null on empty dataset', () => {
            expect(getCurrentWaterLevelUnit.resultFunc({
                samples: []
            })).toBe(null);
        });

        it('returns null on non-existent dataset', () => {
            expect(getCurrentWaterLevelUnit.resultFunc({})).toBe(null);
        });
    });

    describe('getChartPoints', () => {
        it('transforms service data into chartable points', () => {
            expect(getChartPoints.resultFunc({
                samples: [{
                    time: new Date('2010-10-10'),
                    fromDatumValue: '12.2',
                    comment: 'A'
                }, {
                    time: new Date('2010-10-10'),
                    fromDatumValue: '-1',
                    comment: 'p'
                }]
            })).toEqual([{
                dateTime: new Date('2010-10-10'),
                value: 12.2,
                approved: true
            }, {
                dateTime: new Date('2010-10-10'),
                value: -1,
                approved: false
            }]);
        });
    });

    describe('getDomainX', () => {
        it('returns correct date range', () => {
            expect(getDomainX.resultFunc([{
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
            expect(getDomainX.resultFunc([])).toEqual([undefined, undefined]);
        });
    });

    describe('getDomainY', () => {
        it('returns proper range with 20% padding', () => {
            expect(getDomainY.resultFunc([{
                value: 10
            }, {
                value: 15
            }, {
                value: 20
            }])).toEqual([8, 22]);
        });

        it('has zero-lower bound on positive domains', () => {
            expect(getDomainY.resultFunc([{
                value: 1
            }, {
                value: 101
            }])[0]).toBe(0);
        });
    });


    describe('getLineSegments', () => {
        it('should separate on approved', () => {
            const dateTime = new Date();
            const value = 1;
            expect(getLineSegments.resultFunc([
                {value, dateTime, approved: true},
                {value, dateTime, approved: true},
                {value, dateTime, approved: false}
            ])).toEqual([{
                classes: {approved: true, provisional: false},
                points: [
                    {value, dateTime, approved: true},
                    {value, dateTime, approved: true}
                ]
            }, {
                classes: {approved: false, provisional: true},
                points: [
                    {value, dateTime, approved: false}
                ]
            }]);
        });

        it('should separate on gaps greater than MAX_LINE_POINT_GAP', () => {
            const value = 1;
            const dates = [new Date()];
            dates.push(new Date(dates[0].getTime() + MAX_LINE_POINT_GAP));
            dates.push(new Date(dates[1].getTime() + MAX_LINE_POINT_GAP + 1));
            expect(getLineSegments.resultFunc([
                {value, dateTime: dates[0], approved: true},
                {value, dateTime: dates[1], approved: true},
                {value, dateTime: dates[2], approved: true}
            ])).toEqual([{
                classes: {approved: true, provisional: false},
                points: [
                    {value, dateTime: dates[0], approved: true},
                    {value, dateTime: dates[1], approved: true}
                ]
            }, {
                classes: {approved: true, provisional: false},
                points: [
                    {value, dateTime: dates[2], approved: true}
                ]
            }]);
        });
    });
});
