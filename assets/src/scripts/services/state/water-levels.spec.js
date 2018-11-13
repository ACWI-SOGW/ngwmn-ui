import { combineReducers, createStore } from 'redux';
import configureStore from 'redux-mock-store';
import { default as thunk } from 'redux-thunk';

import {
    default as waterLevels, getWaterLevels, getSiteWaterLevels, retrieveWaterLevels, setWaterLevels,
    WATER_LEVELS_SET, MOUNT_POINT
} from './water-levels';
import { MOCK_WATER_LEVEL_RESPONSE, MOCK_WATER_LEVEL_DATA } from '../cache.spec';


describe('water levels service state', () => {

    describe('getSiteWaterLevels works', () => {
        let mockStoreData = {};
        mockStoreData[MOUNT_POINT] = {
            'USGS:12345678': {
                elevationReference: {
                    siteElevation: '111.3'
                },
                samples: [
                    {'value': 1},
                    {'value': 2}
                ]
            }
        };

        it('Returns  empty object if agency:site is not in the water levels data', () => {
            expect(getSiteWaterLevels('USSS', '12345678')(mockStoreData)).toEqual({});
        });

        it('Returns the expected data if agency:site is in the water levels data', () => {
            expect(getSiteWaterLevels('USGS', '12345678')(mockStoreData)).toEqual(mockStoreData[MOUNT_POINT]['USGS:12345678']);
        });
    });

    describe('setWaterLevels works', () => {
        let store;

        beforeEach(() => {
            store = createStore(combineReducers({
                ...waterLevels
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
                        siteId: '430406089232901',
                        waterLevels: MOCK_WATER_LEVEL_DATA
                    }
                });
                done();
            });
        });
    });
});
