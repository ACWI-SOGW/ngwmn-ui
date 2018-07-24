import { combineReducers, createStore } from 'redux';

import reducer from './cursor';
import { getCursor, setCursor } from './cursor';


describe('graph component cursor state', () => {
    let store;

    beforeEach(() => {
        store = createStore(combineReducers(reducer), {});
    });

    it('setLayout works', () => {
        const cursor = new Date('2015-10-10');
        store.dispatch(setCursor(cursor));
        expect(getCursor(store.getState())).toBe(cursor);
    });
});
