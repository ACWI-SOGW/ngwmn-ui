import { combineReducers, createStore } from 'redux';

import { default as cache, getWellLogs, setWellLog, getSiteWellDepth } from './well-log';


describe('well log service state', () => {
    describe('setWellLog works', () => {
        let store;
        const MOCK_WELL_LOG_DATA = 'MOCK_WELL_LOG_DATA';

        beforeEach(() => {
            store = createStore(combineReducers({
                ...cache
            }), {});
        });

        it('and getWellLogs returns correct data', () => {
            store.dispatch(setWellLog('USGS', '430406089232901', MOCK_WELL_LOG_DATA));
            expect(getWellLogs(store.getState())).toEqual({
                'USGS:430406089232901': MOCK_WELL_LOG_DATA
            });
        });
    });

    describe('getSiteWellDepth works', () => {
        const MOUNT_POINT = 'services/well-log';
        const mockStoreData = {};

        mockStoreData[MOUNT_POINT] = {
            'USGS:12345678': {
                well_depth: {
                    value: 123.45
                }
            }
        };

        it('and getWellLogs returns correct well depth', () => {
            expect(getSiteWellDepth('USGS', '12345678')(mockStoreData)).toEqual(123.45);
        });

        it('or getWellLogs returns -1 well depth when not found', () => {
            expect(getSiteWellDepth('USGS', 'NOT_FOUND')(mockStoreData)).toEqual(-1);
        });
    });
});
