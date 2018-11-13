import { select } from 'd3-selection';

import { callIf, getNearestTime, initCropper } from './utils';


describe('Utils module', () => {
    describe('callIf', () => {
        let spy;

        beforeEach(() => {
            spy = jasmine.createSpy('callIf');
        });

        it('calls on true', () => {
            callIf(true, spy)();
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith();
        });

        it('calls on true with arguments', () => {
            callIf(true, spy)(1, 2, 3);
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(1, 2, 3);
        });

        it('no-ops on false', () => {
            callIf(false, spy)();
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('initCropper', () => {
        let svg;

        beforeEach(() => {
            svg = select('body')
                .append('svg')
                .attr('viewBox', '0 0 0 0');
        });

        afterEach(() => {
            svg.remove();
        });

        it('cropper initializes without unexpected errors', () => {
            initCropper(svg);
        });
    });

    describe('getNearestTime', () => {
        const DATA = [12, 13, 14, 15, 16].map(hour => {
            return {
                dateTime: new Date(`2018-01-03T${hour}:00:00.000Z`).getTime(),
                value: hour
            };
        });

        it('Return null if the DATA array is empty', function () {
            expect(getNearestTime([], DATA[0].dateTime)).toBeNull();
        });

        it('return correct DATA points via getNearestTime' , () => {
            // Check each date with the given offset against the hourly-spaced
            // test DATA.
            function expectOffset(offset, side) {
                for (let index = 0; index < DATA.length; index++) {
                    const datum = DATA[index];
                    let expected;
                    if (side === 'left' || index === DATA.length - 1) {
                        expected = {datum, index};
                    } else {
                        expected = {datum: DATA[index + 1], index: index + 1};
                    }
                    let time = new Date(datum.dateTime + offset);
                    let returned = getNearestTime(DATA, time);

                    expect(returned.datum.dateTime).toBe(expected.datum.dateTime);
                    expect(returned.datum.index).toBe(expected.datum.index);
                }
            }

            let hour = 3600000;  // 1 hour in milliseconds

            // Check each date against an offset from itself.
            expectOffset(0, 'left');
            expectOffset(23, 'left');
            expectOffset(hour / 2 - 1, 'left');
            expectOffset(hour / 2, 'left');
            expectOffset(hour / 2 + 1, 'right');
            expectOffset(hour - 1, 'right');
        });
    });
});
