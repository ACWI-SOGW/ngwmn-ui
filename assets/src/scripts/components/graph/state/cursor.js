import { createSelector } from 'reselect';

import { getNearestTime } from 'ngwmn/lib/utils';
import { getChartPoints, getDomainX } from './points';


const MOUNT_POINT = 'components/graph/cursor';
const CURSOR_SET = `${MOUNT_POINT}/CURSOR_SET`;


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
export const getCursor = createSelector(
    state => state[MOUNT_POINT].date,
    getDomainX,
    (cursor, xDomain) => {
        return cursor || xDomain[1];
    }
);

/*
 * Returns the closest point to the current cursor location.
 * @param {Object} state - Redux store
 * @return {Object}
 */
export const getCursorPoint = createSelector(
    getCursor,
    getChartPoints,
    (cursor, points) => {
        if (!cursor) {
            return null;
        }
        return getNearestTime(points, cursor).datum;
    }
);

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

export default {
    [MOUNT_POINT]: reducer
};
