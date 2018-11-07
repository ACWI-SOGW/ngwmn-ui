import { combineReducers, createStore } from 'redux';

import getMockStore from 'ngwmn/store.mock';
import wellLogReducer from './state';
import {
    getVisibleConstructionIds, getSelectedConstructionId,
    setSelectedConstructionId, setVisibleConstructionIds
} from './state';


describe('well-log state', () => {
    let store;

    beforeEach(() => {
        store = createStore(combineReducers({
            ...wellLogReducer
        }), {});
    });

    describe('selectedConstructionId', () => {
        it('works', () => {
            expect(getSelectedConstructionId(store.getState())).toBe(undefined);
            store.dispatch(setSelectedConstructionId(1));
            expect(getSelectedConstructionId(store.getState())).toBe(1);
        });

        it('works with mock state', () => {
            const store = getMockStore();
            expect(getSelectedConstructionId(store.getState())).toBe(null);
            store.dispatch(setSelectedConstructionId(1));
            expect(getSelectedConstructionId(store.getState())).toBe(1);
        });
    });

    describe('visibleConstructionIds', () => {
        it('works', () => {
            expect(getVisibleConstructionIds(store.getState())).toBe(undefined);
            store.dispatch(setVisibleConstructionIds([1, 2, 3]));
            expect(getVisibleConstructionIds(store.getState())).toEqual([1, 2, 3]);
        });

        it('works with mock state', () => {
            const store = getMockStore();
            expect(getVisibleConstructionIds(store.getState())).not.toBe(null);
            store.dispatch(setVisibleConstructionIds([1, 2, 3]));
            expect(getVisibleConstructionIds(store.getState())).toEqual([1, 2, 3]);
        });
    });
});
