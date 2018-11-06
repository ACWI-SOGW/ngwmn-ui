import { combineReducers, createStore } from 'redux';

import reducer from './state';


describe('well-log state', () => {
    let store;

    beforeEach(() => {
        store = createStore(combineReducers({
            ...reducer
        }), {});
    });

    describe('todo', () => {
        expect(store).not.toBe(null);
    });
});
