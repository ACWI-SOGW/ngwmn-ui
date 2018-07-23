import { combineReducers, createStore } from 'redux';

import reducer from './options';
import { getOptions, setOptions } from './options';


describe('graph component options state', () => {
    let store;

    beforeEach(() => {
        store = createStore(combineReducers(reducer), {});
    });

    afterEach(() => {

    });

    it('setOptions works', () => {
        const options = {option1: 'option1', option2: 'option2'};
        store.dispatch(setOptions(options));
        expect(getOptions(store.getState())).toEqual(options);
    });
});
