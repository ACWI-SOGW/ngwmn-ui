import { combineReducers, createStore } from 'redux';

import reducer from './state';

import { setTableWasExpanded, isTableRendered } from './state';

describe('median-water-level-table component state', () => {
    let store;

    beforeEach(() => {
        store = createStore(combineReducers(reducer), {});
    });

    it('isTableRendered is false before the setTableWasExpanded action is dispatched', () => {
        expect(isTableRendered(store.getState())).toBe(false);
    });

    it('isTableRendered is true after the setTableWasExpanded action is dispatched', () => {
        store.dispatch(setTableWasExpanded());

        expect(isTableRendered(store.getState())).toBe(true);
    });
});