import { combineReducers, createStore } from 'redux';

import reducer from './options';
import { getLithologyVisibility, setLithologyVisibility } from './options';




describe('graph component options state', () => {
    let store;

    beforeEach(() => {
        store = createStore(combineReducers(reducer), {});
    });

    afterEach(() => {
        window.localStorage.clear();
    });

    it('getLithologyVisibility has proper defaults', () => {
        // Default is true for all chart types
        expect(getLithologyVisibility({
            graphType: 'water-levels',
            id: 'ignored'
        })(store.getState())).toBe(false);
        expect(getLithologyVisibility({
            graphType: 'construction',
            id: 'ignored'
        })(store.getState())).toBe(true);
    });

    it('setLithologyVisibility works for water level charts', () => {
        store.dispatch(setLithologyVisibility(1, true));
        expect(getLithologyVisibility({
            graphType: 'water-levels',
            id: 1
        })(store.getState())).toBe(true);
        store.dispatch(setLithologyVisibility(1, false));
        expect(getLithologyVisibility({
            graphType: 'water-levels',
            id: 1
        })(store.getState())).toBe(false);
    });

    it('setLithologyVisibility value is ignored for construction charts', () => {
        store.dispatch(setLithologyVisibility(1, false));
        expect(getLithologyVisibility({
            graphType: 'construction',
            id: 1
        })(store.getState())).toBe(true);
    });
});
