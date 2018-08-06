import { combineReducers, createStore } from 'redux';

import reducer from './layout';
import { clearSelectionRect, getGraphSize, getSelectionRect, setGraphSize,
         setSelectionRect } from './layout';


describe('graph component layout state', () => {
    let store;

    beforeEach(() => {
        store = createStore(combineReducers(reducer), {});
    });

    it('setGraphSize works', () => {
        store.dispatch(setGraphSize({graph: 'test', width: 10, height: 20}));
        expect(getGraphSize('test')(store.getState())).toEqual({width: 10, height: 20});
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
});
