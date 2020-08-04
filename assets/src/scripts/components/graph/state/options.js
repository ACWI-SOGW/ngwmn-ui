import memoize from 'fast-memoize';
import { createSelector } from 'reselect';

const MOUNT_POINT = 'components/graph/options';
const LITHOLOGY_VISIBILITY_SET = `${MOUNT_POINT}/LITHOLOGY_VISIBILITY_SET`;

const DEFAULT_LITHOLOGY_VISIBILITY = false;


/**
 * Action creator to set the default visibility of the lithology layers in the
 * water levels chart.
 * @param {Object}  id      ID of component who visibility to set
 * @param {Boolean} lithologyVisibility
 */
export const setLithologyVisibility = function(id, lithologyVisibility) {
    return {
        type: LITHOLOGY_VISIBILITY_SET,
        payload: {
            id,
            lithologyVisibility
        }
    };
};

/**
 * Returns a selector that:
 * Returns the visibility of the lithology layers for a given component.
 * If unset, the default visibility is loaded from localStorage, defaulting to true.
 * @param  {Object} state Redux store
 * @return {Object}       Visibility for given component
 */
export const getLithologyVisibility = memoize(opts => createSelector(
    state => state.lithologyVisibility || {},
    (lithologyVisibility) => {
        // Always show the lithology layers on construction graphs
        if (opts.graphType === 'construction') {
            return true;
        }

        // If we don't have a visibility in the state, default to localStorage
        if (lithologyVisibility[opts.id] === undefined) {
            const visibility = window.localStorage.getItem('defaultLithologyVisibility');
            if (!visibility) {
                return DEFAULT_LITHOLOGY_VISIBILITY;
            }
            // localStorage uses strings; convert to boolean:
            return visibility === 'true';
        }

        // Return the visibility from state
        return lithologyVisibility[opts.id];
    }
));

/**
 * Layout reducer
 * @param  {Object} state  Redux state
 * @param  {Object} action Action object
 * @return {Object}        New state
 */
export const reducer = function(state = {}, action) {
    let lithologyVisibility;
    switch (action.type) {
        case LITHOLOGY_VISIBILITY_SET:
            // Remember this visibility for next page load
            window.localStorage.setItem(
                'defaultLithologyVisibility',
                action.payload.lithologyVisibility
            );
            lithologyVisibility = Object.assign({}, state.lithologyVisibility);
            lithologyVisibility[action.payload.id] = action.payload.lithologyVisibility;
            return {
                ...state,
                lithologyVisibility: lithologyVisibility
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
