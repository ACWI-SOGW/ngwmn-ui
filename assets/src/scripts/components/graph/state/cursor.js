import memoize from 'fast-memoize';
import { createSelector } from 'reselect';

import { getNearestTime } from 'ngwmn/lib/utils';
import { getViewport } from './layout';
import { getChartPoints, getDomainX } from './points';

const MOUNT_POINT = 'components/graph/cursor';
const CURSOR_SET = `${MOUNT_POINT}/CURSOR_SET`;


/**
 * Action creator to set the current cursor date (x-axis) of a given graph.
 * Dates are keyed on the site level.
 * @param {Date} date   Date of cursor
 */
export const setCursor = (siteKey, date) => {
    return {
        type: CURSOR_SET,
        payload: {
            siteKey,
            date
        }
    };
};

/**
 * Returns the current cursor location, or the last point in the time series if
 * none is selected.
 * @type {Object}
 */
export const getCursor = memoize(opts => createSelector(
    state => state[MOUNT_POINT] || {},
    getViewport(opts),
    getDomainX(opts, 'main'),
    (cursors, viewport, domain) => {
        return cursors[opts.siteKey] || (viewport ? viewport[1] : domain[1]);
    }
));

/*
 * Returns the closest point to the current cursor location.
 * @param {Object} state - Redux store
 * @return {Object}
 */
export const getCursorDatum = memoize(opts => createSelector(
    getCursor(opts),
    getChartPoints(opts),
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
                [action.payload.siteKey]: action.payload.date
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
