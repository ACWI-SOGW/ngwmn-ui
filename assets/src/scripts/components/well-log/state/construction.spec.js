import { combineReducers, createStore } from 'redux';

import getMockStore from 'ngwmn/store.mock';
import reducer from './construction';
import {
    getSelectedConstructionId, getVisibleConstructionIds,
    setSelectedConstructionId, setVisibleConstructionIds
} from './construction';


describe('well-log construction state', () => {
    const siteKey = 'USGS:423532088254601';
    let store;

    beforeEach(() => {
        store = createStore(combineReducers({
            ...reducer
        }), {});
    });

    describe('selectedConstructionId', () => {
        it('works', () => {
            expect(getSelectedConstructionId(siteKey)(store.getState())).toBe(undefined);
            store.dispatch(setSelectedConstructionId(siteKey, 'screen-4'));
            expect(getSelectedConstructionId(siteKey)(store.getState())).toEqual('screen-4');
        });

        it('works with mock state', () => {
            const store = getMockStore();
            expect(getSelectedConstructionId(siteKey)(store.getState())).toEqual(undefined);
            store.dispatch(setSelectedConstructionId(siteKey, 'screen-5'));
            expect(getSelectedConstructionId(siteKey)(store.getState())).toEqual('screen-5');
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
            expect(getVisibleConstructionIds(siteKey)(store.getState())).toBe(undefined);
            store.dispatch(setVisibleConstructionIds(siteKey, ids));
            expect(getVisibleConstructionIds(siteKey)(store.getState())).toEqual(ids);
        });

        it('works with mock state', () => {
            const store = getMockStore();
            const ids = [
                'casing-0',
                'casing-1',
                'casing-2'
            ];
            expect(getVisibleConstructionIds(siteKey)(store.getState())).not.toBe(null);
            store.dispatch(setVisibleConstructionIds(siteKey, ids));
            expect(getVisibleConstructionIds(siteKey)(store.getState())).toEqual(ids);
        });
    });
});
