import { combineReducers, createStore } from 'redux';
import configureStore from 'redux-mock-store';
import { default as thunk } from 'redux-thunk';

import {
    default as medianWaterLevels, getSiteMedianWaterLevels, getMedianWaterLevels,
    getMedianWaterLevelStatus, retrieveMedianWaterLevels, setMedianWaterLevels,
    setMedianWaterLevelStatus, MEDIAN_WATER_LEVELS_SET, MEDIAN_WATER_LEVELS_CALL_STATUS, MOUNT_POINT
} from './median-water-levels';
import { MOCK_WATER_LEVEL_DATA } from '../cache.spec';
import { MOCK_MEDIAN_WATER_LEVEL_RESPONSE, MOCK_MEDIAN_WATER_LEVEL_DATA } from '../statistics.spec';
import { MOUNT_POINT as WATER_LEVELS_MOUNT_POINT} from './water-levels';


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
            expect(getSiteMedianWaterLevels('USSS', '12345678')(mockStoreData)).toEqual({});
        });

        it('Returns the expected data if agency:site is in the water levels data', () => {
            const levels = getSiteMedianWaterLevels('USGS', '12345678')(mockStoreData);
            expect(levels).toEqual(mockStoreData[MOUNT_POINT]['data']['USGS:12345678']);
        });
    });

    describe('setMedianWaterLevels works', () => {
        let store;

        beforeEach(() => {
            store = createStore(combineReducers({
                ...medianWaterLevels
            }), {});
            store.dispatch(setMedianWaterLevelStatus('USGS','430406089232901','DONE'));
            store.dispatch(setMedianWaterLevels('USGS', '430406089232901', MOCK_MEDIAN_WATER_LEVEL_DATA));
        });

        // store.dispatch(setMedianWaterLevels('USGS','423532088254601',
        //     {'medians':[
        //             {'year':'2017', 'month':'2', 'median':'22.22'}
        //     ]}
        // ));

        it('and getMedianWaterLevels returns correct data', () => {
            expect(getMedianWaterLevels(store.getState())).toEqual({
                'USGS:430406089232901': MOCK_MEDIAN_WATER_LEVEL_DATA
            });
        });
    });

    describe('retrieveMedianWaterLevels', () => {
        let store;

        // Mock a service call response
        beforeEach(() => {
            const MockStore = configureStore([thunk]);
            let init = {};
            init[WATER_LEVELS_MOUNT_POINT] = {'data':{'USGS:430406089232901':MOCK_WATER_LEVEL_DATA}};
            store = MockStore(init);
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('dispatches MEDIAN_WATER_LEVELS_SET with correct data', (done) => {
            const promise = store.dispatch(retrieveMedianWaterLevels('USGS', '430406089232901'));
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                responseText: MOCK_MEDIAN_WATER_LEVEL_RESPONSE,
                contentType: 'application/json'
            });
            promise.then(() => {
                const actions = store.getActions();
                expect(actions.length).toBe(3);
                expect(actions[0]).toEqual({
                    type: MEDIAN_WATER_LEVELS_CALL_STATUS,
                    payload: {
                        agencyCode: 'USGS',
                        siteId: '430406089232901',
                        status: 'STARTED'
                    }
                });
                expect(actions[1]).toEqual({
                    type: MEDIAN_WATER_LEVELS_SET,
                    payload: {
                        agencyCode: 'USGS',
                        siteId: '430406089232901',
                        waterLevels:{medians: MOCK_MEDIAN_WATER_LEVEL_DATA}
                    }
                });
                expect(actions[2]).toEqual({
                    type: MEDIAN_WATER_LEVELS_CALL_STATUS,
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
                ...medianWaterLevels
            }), {});
        });

        it('works', () => {
            expect(getMedianWaterLevelStatus('USGS', '430406089232901')(store.getState())).toEqual(undefined);
            store.dispatch(setMedianWaterLevelStatus('USGS', '430406089232901', 'DONE'));
            expect(getMedianWaterLevelStatus('USGS', '430406089232901')(store.getState())).toEqual('DONE');
        });
    });
});
