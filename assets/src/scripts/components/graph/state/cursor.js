import memoize from 'fast-memoize';
import { createSelector } from 'reselect';

import { getNearestTime } from 'ngwmn/lib/utils';
import { getViewport } from './layout';
import { getChartPoints, getDomainX } from './points';


const MOUNT_POINT = 'components/graph/cursor';
const CURSOR_SET = `${MOUNT_POINT}/CURSOR_SET`;


/**
 * Action creator to set the current cursor date (x-axis)
 * @param {Date} date   Date of cursor
 */
export const setCursor = function (date) {
    return {
        type: CURSOR_SET,
        payload: {
            date
        }
    };
};

/**
 * Returns the current cursor location, or the last point in the time series if
 * none is selected.
 * @type {Object}
 */
export const getCursor = memoize(id => createSelector(
    state => state[MOUNT_POINT].date,
    getViewport(id),
    getDomainX(id, 'main'),
    (cursor, viewport, domain) => {
        return cursor || (viewport ? viewport[1] : domain[1]);
    }
));

/*
 * Returns the closest point to the current cursor location.
 * @param {Object} state - Redux store
 * @return {Object}
 */
export const getCursorDatum = memoize(id => createSelector(
    getCursor(id),
    getChartPoints(id),
    (cursor, points) => {
        if (!cursor) {
            return null;
        }
        return getNearestTime(points, cursor).datum;
    }
));

/**
 * Cursor reducer
 * @param  {Object} state  Redux state
 * @param  {Object} action Action object
 * @return {Object}        New state
 */
export const reducer = function (state = {}, action) {
    switch (action.type) {
        case CURSOR_SET:
            return {
                ...state,
                date: action.payload.date
            };
        default:
            return state;
    }
};

/**
 * Export the reducer keyed on the mount point, for easy usage with
 * combineReducers.
 */
export default {
    [MOUNT_POINT]: reducer
};
