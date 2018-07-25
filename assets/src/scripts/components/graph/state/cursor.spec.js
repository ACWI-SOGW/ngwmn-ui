import { combineReducers, createStore } from 'redux';

import services from 'ngwmn/services/state/index';
import cursor from './cursor';
import { getCursor, setCursor } from './cursor';
import layout from './layout';
import options from './options';


describe('graph component cursor state', () => {
    let store;

    beforeEach(() => {
        store = createStore(combineReducers({
            ...cursor,
            ...layout,
            ...options,
            ...services
        }), {});
    });

    it('setLayout works', () => {
        const cursor = new Date('2015-10-10');
        store.dispatch(setCursor(cursor));
        expect(getCursor(store.getState())).toBe(cursor);
    });
});
