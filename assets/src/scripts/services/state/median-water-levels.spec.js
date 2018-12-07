import { combineReducers, createStore } from 'redux';
import configureStore from 'redux-mock-store';
import { default as thunk } from 'redux-thunk';

import {
    default as medianWaterLevels, getSiteWaterLevels, getMedianWaterLevels,
    getMedianWaterLevelStatus, retrieveMedianWaterLevels, setMedianWaterLevels,
    setMedianWaterLevelStatus, WATER_LEVELS_SET, WATER_LEVELS_CALL_STATUS, MOUNT_POINT
} from './median-water-levels';
import { MOCK_WATER_LEVEL_RESPONSE, MOCK_WATER_LEVEL_DATA } from '../cache.spec';


describe('median water levels service state', () => {

    describe('getSiteWaterLevels works', () => {
        let mockStoreData = {};
        mockStoreData[MOUNT_POINT] = {
            data: {
                'USGS:12345678': {
                    elevationReference: {
                        siteElevation: '111.3'
                    },
                    samples: [
                        {'value': 1},
                        {'value': 2}
                    ]
                }
            }
        };

        it('Returns empty object if agency:site is not in the water levels data', () => {
            expect(getSiteWaterLevels('USSS', '12345678')(mockStoreData)).toEqual({});
        });

        it('Returns the expected data if agency:site is in the water levels data', () => {
            const levels = getSiteWaterLevels('USGS', '12345678')(mockStoreData);
            expect(levels).toEqual(mockStoreData[MOUNT_POINT]['data']['USGS:12345678']);
        });
    });

    describe('setMedianWaterLevels works', () => {
        let store;

        beforeEach(() => {
            store = createStore(combineReducers({
                ...waterLevels
            }), {});
            store.dispatch(setMedianWaterLevels('USGS', '430406089232901', MOCK_WATER_LEVEL_DATA));
        });

        it('and getMedianWaterLevels returns correct data', () => {
            expect(getMedianWaterLevels(store.getState())).toEqual({
                'USGS:430406089232901': MOCK_WATER_LEVEL_DATA
            });
        });
    });

    describe('retrieveMedianWaterLevels', () => {
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

        it('dispatches MEDIAN_WATER_LEVELS_SET with correct data', (done) => {
            const promise = store.dispatch(retrieveMedianWaterLevels('USGS', '430406089232901'));
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                responseText: MOCK_WATER_LEVEL_RESPONSE,
                contentType: 'text/xml'
            });
            promise.then(() => {
                const actions = store.getActions();
                expect(actions.length).toBe(3);
                expect(actions[0]).toEqual({
                    type: WATER_LEVELS_CALL_STATUS,
                    payload: {
                        agencyCode: 'USGS',
                        siteId: '430406089232901',
                        status: 'STARTED'
                    }
                });
                expect(actions[1]).toEqual({
                    type: WATER_LEVELS_SET,
                    payload: {
                        agencyCode: 'USGS',
                        siteId: '430406089232901',
                        waterLevels: MOCK_WATER_LEVEL_DATA
                    }
                });
                expect(actions[2]).toEqual({
                    type: WATER_LEVELS_CALL_STATUS,
                    payload: {
                        agencyCode: 'USGS',
                        siteId: '430406089232901',
                        status: 'DONE'
                    }
                });
                done();
            });
        });
    });

    describe('medianWaterLevelStatus', () => {
        let store;

        beforeEach(() => {
            store = createStore(combineReducers({
                ...waterLevels
            }), {});
        });

        it('works', () => {
            expect(getMedianWaterLevelStatus('USGS', '430406089232901')(store.getState())).toEqual(undefined);
            store.dispatch(setMedianWaterLevelStatus('USGS', '430406089232901', 'DONE'));
            expect(getMedianWaterLevelStatus('USGS', '430406089232901')(store.getState())).toEqual('DONE');
        });
    });
});
