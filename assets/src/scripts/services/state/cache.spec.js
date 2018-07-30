import { combineReducers, createStore } from 'redux';
import configureStore from 'redux-mock-store';
import { default as thunk } from 'redux-thunk';

import cache from './cache';
import { getWaterLevels, retrieveWaterLevels, setWaterLevels, WATER_LEVELS_SET } from './cache';
import { MOCK_WATER_LEVEL_RESPONSE, MOCK_WATER_LEVEL_DATA } from '../cache.spec';


describe('cache service state', () => {
    describe('setWaterLevels works', () => {
        let store;

        beforeEach(() => {
            store = createStore(combineReducers({
                ...cache
            }), {});
            store.dispatch(setWaterLevels('USGS', '430406089232901', MOCK_WATER_LEVEL_DATA));
        });

        it('and getWaterLevels returns correct data', () => {
            expect(getWaterLevels(store.getState())).toEqual({
                'USGS:430406089232901': MOCK_WATER_LEVEL_DATA
            });
        });
    });

    describe('retrieveWaterLevels', () => {
        const MockStore = configureStore([thunk]);
        let store;

        // Mock a service call response
        beforeEach(() => {
            store = MockStore({});
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('dispatches WATER_LEVELS_SET with correct data', (done) => {
            const promise = store.dispatch(retrieveWaterLevels('USGS', '430406089232901'));
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                responseText: MOCK_WATER_LEVEL_RESPONSE,
                contentType: 'text/xml'
            });
            promise.then(() => {
                const actions = store.getActions();
                expect(actions.length).toBe(1);
                expect(actions[0]).toEqual({
                    type: WATER_LEVELS_SET,
                    payload: {
                        agencyCode: 'USGS',
                        siteID: '430406089232901',
                        waterLevels: MOCK_WATER_LEVEL_DATA
                    }
                });
                done();
            });
        });
    });
});
