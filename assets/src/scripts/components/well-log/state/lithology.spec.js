import { combineReducers, createStore } from 'redux';

import getMockStore from 'ngwmn/store.mock';
import reducer from './lithology';
import {getSelectedLithologyId, setSelectedLithologyId} from './lithology';


describe('well-log lithology state', () => {
    const siteKey = 'USGS:423532088254601';
    let store;

    beforeEach(() => {
        store = createStore(combineReducers({
            ...reducer
        }), {});
    });

    describe('selectedLithologyId', () => {
        it('works', () => {
            expect(getSelectedLithologyId(siteKey)(store.getState())).toBe(undefined);
            store.dispatch(setSelectedLithologyId(siteKey, 'screen-4'));
            expect(getSelectedLithologyId(siteKey)(store.getState())).toEqual('screen-4');
        });

        it('works with mock state', () => {
            const store = getMockStore();
            expect(getSelectedLithologyId(siteKey)(store.getState())).toEqual(undefined);
            store.dispatch(setSelectedLithologyId(siteKey, 'screen-5'));
            expect(getSelectedLithologyId(siteKey)(store.getState())).toEqual('screen-5');
        });
    });
});
