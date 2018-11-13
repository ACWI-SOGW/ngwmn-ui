import { combineReducers, createStore } from 'redux';

import services from 'ngwmn/services/state/index';
import getMockStore from 'ngwmn/store.mock';

import cursor from './cursor';
import { getCursor, getCursorDatum, setCursor } from './cursor';
import layout from './layout';


describe('graph component cursor state', () => {
    const opts = {
        agencyCode: 'USGS',
        id: 23,
        siteId: '423532088254601',
        siteKey: 'USGS:423532088254601'
    };
    let store;

    beforeEach(() => {
        store = createStore(combineReducers({
            ...cursor,
            ...layout,
            ...services
        }), {});
    });

    it('setCursor and getCursor works', () => {
        const cursorDate = new Date('2015-10-10');
        store.dispatch(setCursor(opts.siteKey, cursorDate));
        expect(getCursor(opts)(store.getState())).toBe(cursorDate);
    });

    it('getCursor returns viewport end date on null cursor', () => {
        const viewport = [new Date('2010-10-09'), new Date('2010-10-10')];
        const cursorDate = getCursor(opts).resultFunc({}, viewport);
        expect(cursorDate).toEqual(viewport[1]);
    });

    it('getCursor returns right extent on null cursor and viewport', () => {
        const domainX = [new Date('2010-10-10'), new Date('2010-12-10')];
        const cursorDate = getCursor(opts).resultFunc({}, null, domainX);
        expect(cursorDate).toEqual(domainX[1]);
    });

    it('getCursorDatum returns a date', () => {
        // We have test coverage of the logic of getNearestTime in utils,
        // so just confirm we get an expected date back.
        const cursorDate = new Date('2010-12-01');
        const twoPoints = [new Date('2010-10-10'), new Date('2010-12-10')];
        const result = getCursorDatum(opts).resultFunc(cursorDate, twoPoints);
        expect(result instanceof Date).toBe(true);
    });

    it('getCursorDatum returns null on null cursor', () => {
        const date = getCursorDatum(opts).resultFunc(null, []);
        expect(date).toBe(null);
    });

    it('works with mock state', () => {
        const store = getMockStore();
        expect(getCursor(opts)(store.getState())).not.toBe(null);
        const cursorDate = new Date('2015-10-10');
        store.dispatch(setCursor(opts.siteKey, cursorDate));
        expect(getCursor(opts)(store.getState())).toEqual(cursorDate);
    });
});
