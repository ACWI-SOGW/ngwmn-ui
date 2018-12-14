import { combineReducers, createStore } from 'redux';

import reducer from './state';

import { renderTable, isTableRendered } from './state';

describe('median-water-level-table component state', () => {
    let store;

    beforeEach(() => {
        store = createStore(combineReducers(reducer), {});
    });

    it('isTableRendered is false before the renderTable action is dispatched', () => {
        expect(isTableRendered(store.getState())).toBe(false);
    });

    it('isTableRendered is true after the renderTable action is dispatched', () => {
        store.dispatch(renderTable());

        expect(isTableRendered(store.getState())).toBe(true);
    });
});