import { createSelector } from 'reselect';

import { getNearestTime } from 'ngwmn/lib/utils';
import { getChartPoints } from './points';


const MOUNT_POINT = 'components/graph/viewport';
const VIEWPORT_SET = `${MOUNT_POINT}/VIEWPORT_SET`;


/**
 * Action creator to set the current viewport date (x-axis)
 * @param {Date} date   Date of viewport
 */
export const setViewport = function ({startDate, endDate}) {
    return {
        type: VIEWPORT_SET,
        payload: {
            startDate,
            endDate
        }
    };
};

/**
 * Returns the current viewport, or the complete range if none is selection.
 * @type {Object}
 */
export const getViewport = state => state[MOUNT_POINT];

/*
 * Returns the closest point to the current viewport location.
 * @param {Object} state - Redux store
 * @return {Object}
 */
export const getViewportPoint = createSelector(
    getViewport,
    getChartPoints,
    (viewport, points) => {
        if (!viewport) {
            return null;
        }
        return getNearestTime(points, viewport).datum;
    }
);

/**
 * Viewport reducer
 * @param  {Object} state  Redux state
 * @param  {Object} action Action object
 * @return {Object}        New state
 */
export const reducer = function (state = {}, action) {
    switch (action.type) {
        case VIEWPORT_SET:
            return {
                ...state,
                startDate: action.payload.startDate,
                endDate: action.payload.endDate
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
