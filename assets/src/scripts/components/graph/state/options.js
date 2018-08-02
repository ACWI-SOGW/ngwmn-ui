import { createSelector } from 'reselect';

import { getWaterLevelID } from 'ngwmn/services/state/index';

const MOUNT_POINT = 'components/graph/options';
const GRAPH_OPTIONS_SET = `${MOUNT_POINT}/GRAPH_OPTIONS_SET`;


/**
 * Action creator to set current options for the graph.
 * @param {Object} options Graph options object
 */
export const setGraphOptions = function ({agencycode, siteid}) {
    return {
        type: GRAPH_OPTIONS_SET,
        payload: {
            options: {agencycode, siteid}
        }
    };
};

/**
 * Selector to return current graph options.
 * @param  {Object} state Redux state
 * @return {Object}       Graph options object
 */
export const getGraphOptions = state => state[MOUNT_POINT];

export const getCurrentWaterLevelID = createSelector(
    getGraphOptions,
    (options) => {
        return getWaterLevelID(options.agencycode, options.siteid);
    }
);

/**
 * Graph options reducer
 * @param  {Object} state  Redux state
 * @param  {Object} action Action object
 * @return {Object}        New state
 */
const reducer = function (state = {}, action) {
    switch (action.type) {
        case GRAPH_OPTIONS_SET:
            return {
                ...state,
                ...action.payload.options
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
