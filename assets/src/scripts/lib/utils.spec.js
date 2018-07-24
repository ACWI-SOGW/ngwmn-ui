import { select } from 'd3-selection';

import { callIf, initCropper } from './utils';


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
        let observer;

        beforeEach(() => {
            svg = select('body')
                .append('svg')
                .attr('viewBox', '0 0 0 0');
            observer = initCropper(svg);
        });

        afterEach(() => {
            svg.remove();
            observer.disconnect();
        });

        it('observes append and set attribute', () => {
            svg.append('text')
                .attr('x', 0)
                .attr('y', 0)
                .text('Hello');
            expect(observer.takeRecords().length).toBe(2);
        });

        it('consumes mutations', (done) => {
            svg.append('text')
                .attr('x', 0)
                .attr('y', 0)
                .text('Hello');
            window.setTimeout(() => {
                expect(observer.takeRecords().length).toBe(0);
                done();
            });
        });

        it('sets viewBox', (done) => {
            svg.append('text')
                .attr('x', 0)
                .attr('y', 0)
                .text('Hello');
            window.setTimeout(() => {
                expect(svg.attr('viewBox')).not.toEqual('0 0 0 0');
                done();
            });
        });
    });
});
