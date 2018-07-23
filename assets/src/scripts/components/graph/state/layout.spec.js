import { combineReducers, createStore } from 'redux';

import reducer from './layout';
import { getLayout, setLayout } from './layout';


describe('graph component layout state', () => {
    let store;

    beforeEach(() => {
        store = createStore(combineReducers(reducer), {});
    });

    it('setLayout works', () => {
        const layout = {width: 10, height: 20};
        store.dispatch(setLayout(layout));
        expect(getLayout(store.getState())).toEqual(layout);
    });
});
