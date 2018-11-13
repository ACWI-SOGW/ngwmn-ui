import { combineReducers, createStore } from 'redux';

import getMockStore from 'ngwmn/store.mock';

import reducer from './layout';
import { getAxisYBBox, getChartPosition, getContainerSize, getViewBox,
         getViewport, resetViewport, setAxisYBBox, setContainerSize,
         setViewport } from './layout';


describe('graph component layout state', () => {
    const mockOpts = {
        agencyCode: 'USGS',
        id: 23,
        siteId: '423532088254601',
        siteKey: 'USGS:423532088254601'
    };
    let store;

    beforeEach(() => {
        store = createStore(combineReducers(reducer), {});
    });

    it('setContainerSize works', () => {
        store.dispatch(setContainerSize(mockOpts.id, {width: 10, height: 20}));
        expect(getContainerSize(mockOpts)(store.getState())).toEqual({width: 10, height: 20});
    });

    it('setViewport and resetViewport works with mock store', () => {
        store = getMockStore();
        const domain = [
            new Date('2010-10-10'),
            new Date('2012-10-10')
        ];
        store.dispatch(setViewport(mockOpts.id, domain));
        expect(getViewport(mockOpts)(store.getState())).toEqual(domain);
        store.dispatch(resetViewport(mockOpts.id));
        expect(getViewport(mockOpts)(store.getState())).not.toEqual(null);
    });

    it('getChartPosition works', () => {
        // Works on container size
        expect(getChartPosition(mockOpts, 'main')(store.getState())).not.toBe(null);
        expect(getChartPosition(mockOpts, 'brush')(store.getState())).not.toBe(null);
        expect(getChartPosition(mockOpts, 'lithology')(store.getState())).not.toBe(null);
        expect(getChartPosition(mockOpts, 'construction')(store.getState())).not.toBe(null);

        // Works with specific container size
        store.dispatch(setContainerSize(mockOpts.id, {width: 10, height: 20}));
        expect(getContainerSize(mockOpts)(store.getState())).toEqual({width: 10, height: 20});
        expect(getChartPosition(mockOpts, 'main')(store.getState())).not.toBe(null);
        expect(getChartPosition(mockOpts, 'brush')(store.getState())).not.toBe(null);
        expect(getChartPosition(mockOpts, 'lithology')(store.getState())).not.toBe(null);
        expect(getChartPosition(mockOpts, 'construction')(store.getState())).not.toBe(null);
    });

    it('setAxisYBBox and getAxisYBBox works', () => {
        const bBox = {x: -10, y: -5, width: 10, height: 20};
        store.dispatch(setAxisYBBox(mockOpts.id, bBox));
        expect(getAxisYBBox(mockOpts)(store.getState())).toEqual(bBox);
    });

    it('getViewBox works', () => {
        store = getMockStore();
        expect(getViewBox(store.getState())).not.toBe(null);
    });
});
