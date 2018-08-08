import { combineReducers, createStore } from 'redux';

import reducer from './layout';
import { clearSelectionRect, getChartPosition, getContainerSize,
         getSelectionRect, getViewport, resetViewport, setContainerSize,
         setSelectionRect, setViewport } from './layout';


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

    it('setSelectionRect works', () => {
        const selectionRect = {top: 50, left: 60, bottom: 10, right: 20};
        store.dispatch(setSelectionRect(selectionRect));
        expect(getSelectionRect(store.getState())).toEqual(selectionRect);
    });

    it('clearSelectionRect works', () => {
        const selectionRect = {top: 50, left: 60, bottom: 10, right: 20};
        store.dispatch(setSelectionRect(selectionRect));
        store.dispatch(clearSelectionRect());
        expect(getSelectionRect(store.getState())).toEqual(null);
    });

    it ('getChartPosition works', () => {
        const size = {width: 10, height: 10};
        expect(getChartPosition('main').resultFunc(size)).not.toBe(null);
        expect(getChartPosition('panner').resultFunc(size)).not.toBe(null);
        expect(getChartPosition('lithography').resultFunc(size)).not.toBe(null);
    });
});
