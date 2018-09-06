import { combineReducers, createStore } from 'redux';

import { default as cache, getWellLogs, setWellLog } from './well-log';


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
});
