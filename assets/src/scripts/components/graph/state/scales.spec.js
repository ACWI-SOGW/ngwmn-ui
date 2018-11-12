import getMockStore from 'ngwmn/store.mock';

import { getScaleX, getScaleY } from './scales';


describe('graph component scales state', () => {
    const mockOpts = {
        agencyCode: 'USGS',
        id: 23,
        siteId: '423532088254601',
        siteKey: 'USGS:423532088254601'
    };

    describe('getScaleX', () => {
        let scale = getScaleX(mockOpts, 'main').resultFunc([0, 100], {x: 0, width: 50});

        it('scale created', () => {
            expect(scale).toEqual(jasmine.any(Function));
        });

        it('returns specified domain', () => {
            expect(scale.domain()).toEqual([0, 100]);
        });

        it('returns range equal to width', () => {
            expect(scale.range()).toEqual([0, 50]);
        });

        it('works with mock state', () => {
            const store = getMockStore();
            expect(getScaleX(mockOpts, 'main')(store.getState())).not.toBe(null);
        });
    });

    describe('getScaleY', () => {
        let scale = getScaleY(mockOpts, 'main').resultFunc([0, 100], {y: 0, height: 50});

        it('scale created', () => {
            expect(scale).toEqual(jasmine.any(Function));
        });

        it('returns specified domain', () => {
            expect(scale.domain()).toEqual([0, 100]);
        });

        it('returns range equal to height', () => {
            expect(scale.range()).toEqual([0, 50]);
        });

        it('works with mock state', () => {
            const store = getMockStore();
            expect(getScaleY(mockOpts, 'main')(store.getState())).not.toBe(null);
        });
    });
});
