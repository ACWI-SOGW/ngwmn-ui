import { combineReducers, createStore } from 'redux';

import reducer from './layout';
import { getChartPosition, getContainerSize, getViewport, resetViewport,
         setContainerSize, setViewport } from './layout';


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
        const viewport = {
            startDate: new Date('2010-10-10'),
            endDate: new Date('2012-10-10')
        };
        store.dispatch(setViewport(viewport));
        expect(getViewport(store.getState())).toEqual(viewport);
        store.dispatch(resetViewport());
        expect(getViewport(store.getState())).toEqual(null);
    });

    it ('getChartPosition works', () => {
        // Works on container size
        expect(getChartPosition('main')(store.getState())).not.toBe(null);
        expect(getChartPosition('panner')(store.getState())).not.toBe(null);

        // Works with specific container size
        store.dispatch(setContainerSize({width: 10, height: 20}));
        expect(getContainerSize(store.getState())).toEqual({width: 10, height: 20});
        expect(getChartPosition('main')(store.getState())).not.toBe(null);
        expect(getChartPosition('panner')(store.getState())).not.toBe(null);
    });
});
