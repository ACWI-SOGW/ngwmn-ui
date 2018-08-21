import { combineReducers, createStore } from 'redux';

import getMockStore from 'ngwmn/store.mock';

import reducer from './options';
import { getCurrentWaterLevelID, getGraphOptions, setGraphOptions } from './options';


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

    it('getCurrentWaterLevelID returns expected ID', () => {
        store.dispatch(setGraphOptions({agencycode: 'agency', siteid: 'siteid'}));
        const id = getCurrentWaterLevelID(store.getState());
        expect(id).toBe('agency:siteid');
    });

    it('getCurrentWaterLevelID works with mock state', () => {
        store = getMockStore();
        expect(getCurrentWaterLevelID(store.getState())).not.toBe(null);
    });
});
