import { combineReducers, createStore } from 'redux';

import getMockStore from 'ngwmn/store.mock';

import reducer from './layout';
import { getAxisYBBox, getChartPosition, getContainerSize, getViewBox,
         getViewport, resetViewport, setAxisYBBox, setContainerSize,
         setViewport } from './layout';


describe('graph component layout state', () => {
    let store;

    beforeEach(() => {
        store = createStore(combineReducers(reducer), {});
    });

    it('setContainerSize works', () => {
        store.dispatch(setContainerSize({width: 10, height: 20}));
        expect(getContainerSize(store.getState())).toEqual({width: 10, height: 20});
    });

    it('setViewport and resetViewport works', () => {
        const domain = [
            new Date('2010-10-10'),
            new Date('2012-10-10')
        ];
        expect(getViewport.resultFunc(null, domain)).toEqual(domain);
        expect(getViewport.resultFunc(domain, null)).toEqual(domain);
    });

    it('setViewport and resetViewport works with mock store', () => {
        store = getMockStore();
        store.dispatch(setViewport([
            new Date('2010-10-10'),
            new Date('2012-10-10')
        ]));
        store.dispatch(resetViewport());
    });

    it('getChartPosition works', () => {
        // Works on container size
        expect(getChartPosition('main')(store.getState())).not.toBe(null);
        expect(getChartPosition('brush')(store.getState())).not.toBe(null);

        // Works with specific container size
        store.dispatch(setContainerSize({width: 10, height: 20}));
        expect(getContainerSize(store.getState())).toEqual({width: 10, height: 20});
        expect(getChartPosition('main')(store.getState())).not.toBe(null);
        expect(getChartPosition('brush')(store.getState())).not.toBe(null);
    });

    it('setAxisYBBox and getAxisYBBox works', () => {
        const bBox = {x: -10, y: -5, width: 10, height: 20};
        store.dispatch(setAxisYBBox(bBox));
        expect(getAxisYBBox(store.getState())).toEqual(bBox);
    });

    it('getViewBox works', () => {
        store = getMockStore();
        expect(getViewBox(store.getState())).not.toBe(null);
    });
});
