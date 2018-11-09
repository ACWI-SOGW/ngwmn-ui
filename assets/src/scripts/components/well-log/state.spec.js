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
            store.dispatch(setSelectedConstructionId('screen-4'));
            expect(getSelectedConstructionId(store.getState())).toEqual('screen-4');
        });

        it('works with mock state', () => {
            const store = getMockStore();
            expect(getSelectedConstructionId(store.getState())).toBe('screen-4');
            store.dispatch(setSelectedConstructionId('screen-5'));
            expect(getSelectedConstructionId(store.getState())).toEqual('screen-5');
        });
    });

    describe('visibleConstructionIds', () => {
        it('works', () => {
            const ids = [
                'casing-0',
                'casing-1',
                'casing-2',
                'screen-0',
                'screen-1'
            ];
            expect(getVisibleConstructionIds(store.getState())).toBe(undefined);
            store.dispatch(setVisibleConstructionIds(ids));
            expect(getVisibleConstructionIds(store.getState())).toEqual(ids);
        });

        it('works with mock state', () => {
            const store = getMockStore();
            const ids = [
                'casing-0',
                'casing-1',
                'casing-2'
            ];
            expect(getVisibleConstructionIds(store.getState())).not.toBe(null);
            store.dispatch(setVisibleConstructionIds(ids));
            expect(getVisibleConstructionIds(store.getState())).toEqual(ids);
        });
    });
});
