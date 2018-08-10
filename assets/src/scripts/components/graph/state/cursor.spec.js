import { combineReducers, createStore } from 'redux';

import services from 'ngwmn/services/state/index';
import cursor from './cursor';
import { getCursor, getCursorDatum, setCursor } from './cursor';
import layout from './layout';
import options from './options';


describe('graph component cursor state', () => {
    let store;

    beforeEach(() => {
        store = createStore(combineReducers({
            ...cursor,
            ...layout,
            ...options,
            ...services
        }), {});
    });

    it('setCursor and getCursor works', () => {
        const cursorDate = new Date('2015-10-10');
        store.dispatch(setCursor(cursorDate));
        expect(getCursor(store.getState())).toBe(cursorDate);
    });

    it('getCursor returns viewport end date on null cursor', () => {
        const viewport = {endDate: new Date('2010-10-10')};
        const cursorDate = getCursor.resultFunc(null, viewport);
        expect(cursorDate).toEqual(viewport.endDate);
    });

    it('getCursor returns right extent on null cursor and viewport', () => {
        const domainX = [new Date('2010-10-10'), new Date('2010-12-10')];
        const cursorDate = getCursor.resultFunc(null, null, domainX);
        expect(cursorDate).toEqual(domainX[1]);
    });

    it('getCursorDatum returns a date', () => {
        // We have test coverage of the logic of getNearestTime in utils,
        // so just confirm we get an expected date back.
        const cursorDate = new Date('2010-12-01');
        const twoPoints = [new Date('2010-10-10'), new Date('2010-12-10')];
        const result = getCursorDatum.resultFunc(cursorDate, twoPoints);
        expect(result instanceof Date).toBe(true);
    });

    it('getCursorDatum returns null on null cursor', () => {
        const date = getCursorDatum.resultFunc(null, []);
        expect(date).toBe(null);
    });
});
