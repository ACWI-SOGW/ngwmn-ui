import memoize from 'fast-memoize';
import { createSelector } from 'reselect';

import { getSiteID } from 'ngwmn/services/state/index';

const MOUNT_POINT = 'components/graph/options';
const GRAPH_OPTIONS_SET = `${MOUNT_POINT}/GRAPH_OPTIONS_SET`;


/**
 * Action creator to set current options for the graph.
 * @param {Object} options Graph options object
 */
export const setGraphOptions = function (id, {agencycode, siteid}) {
    return {
        type: GRAPH_OPTIONS_SET,
        payload: {
            id,
            options: {agencycode, siteid}
        }
    };
};

/**
 * Selector to return current graph options.
 * @param  {Object} state Redux state
 * @return {Object}       Graph options object
 */
export const getGraphOptions = memoize(id => state => state[MOUNT_POINT][id] || {});

/**
 * Returns the store's site ID for this graph.
 * @param  {Object} state Redux state
 * @return {String} Site ID
 */
export const getCurrentSiteID = memoize(id => createSelector(
    getGraphOptions(id),
    (options) => {
        return getSiteID(options.agencycode, options.siteid);
    }
));

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
                [action.payload.id]: {
                    ...action.payload.options
                }
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
