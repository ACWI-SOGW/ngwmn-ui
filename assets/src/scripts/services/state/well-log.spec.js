import { combineReducers, createStore } from 'redux';

import cache from './well-log';
import { getWellLog, setWellLog, WATER_LEVELS_SET } from './water-levels';


describe('well log service state', () => {
    describe('setWellLog works', () => {
        let store;

        beforeEach(() => {
            store = createStore(combineReducers({
                ...cache
            }), {});
            store.dispatch(getWellLog('USGS', '430406089232901', MOCK_WELL_LOG_DATA));
        });

        it('and getWellLog returns correct data', () => {
            expect(false).toBe(true);
        });
    });
});

const MOCK_WELL_LOG_DATA = null;
