import { combineReducers, createStore } from 'redux';

import reducer from './options';
import { getGraphOptions, setGraphOptions } from './options';


describe('graph component options state', () => {
    let store;

    beforeEach(() => {
        store = createStore(combineReducers(reducer), {});
    });

    it('setGraphOptions works', () => {
        const options = {option1: 'option1', option2: 'option2'};
        store.dispatch(setGraphOptions(options));
        expect(getGraphOptions(store.getState())).toEqual(options);
    });
});
