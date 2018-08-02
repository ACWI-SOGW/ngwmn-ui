import { combineReducers, createStore } from 'redux';

import reducer from './options';
import { getGraphOptions, setGraphOptions } from './options';


describe('graph component options state', () => {
    let store;

    beforeEach(() => {
        store = createStore(combineReducers(reducer), {});
    });

    it('setGraphOptions works', () => {
        const options = {agencycode: 'agency', siteid: 'siteid', ignored: 'ignore'};
        store.dispatch(setGraphOptions(options));
        expect(getGraphOptions(store.getState())).toEqual({agencycode: 'agency', siteid: 'siteid'});
    });
});
