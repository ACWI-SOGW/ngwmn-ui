import * as cache from '../cache';


export const MOUNT_POINT = 'services/cache/waterLevels';
export const WATER_LEVELS_SET = `${MOUNT_POINT}/WATER_LEVELS_SET`;

/**
 * Action creator:
 * Store the specified water levels for a given site in the store.
 * @param  {String} agencyCode  Agency code
 * @param  {String} siteID      Site ID
 * @params {Object} waterLevels Water level details to set
 * @return {Object}             WATER_LEVELS_SET action
 */
export const setWaterLevels = function (agencyCode, siteID, waterLevels) {
    return {
        type: WATER_LEVELS_SET,
        payload: {
            agencyCode,
            siteID,
            waterLevels
        }
    };
};

/**
 * Thunk action:
 * Action that returns a thunk that calls the getWaterLevels action and then
 * dispatches actions to update the state.
 * @param  {String} agencyCode Agency code
 * @param  {String} siteID)    Site ID
 * @return {Function}          Thunk
 */
export const retrieveWaterLevels = (agencyCode, siteID) => (dispatch) => {
    return cache.retrieveWaterLevels(agencyCode, siteID).then(waterLevels => {
        dispatch(setWaterLevels(agencyCode, siteID, waterLevels));
    });
};

/**
 * Gets the unique id for a given site.
 * @param  {String} agencyCode Agency code of site
 * @param  {String} siteID     Agency's site ID for site
 * @return {String}            Unique site ID
 */
export const getWaterLevelID = function (agencyCode, siteID) {
    return `${agencyCode}:${siteID}`;
};

/**
 * Return all water level data
 * @param  {Object} state Redux state
 * @return {Object}       Water levels keyed on ID
 */
export const getWaterLevels = state => state[MOUNT_POINT];

/**
 * Cache service reducer
 * @param  {Object} state  Redux state
 * @param  {Object} action Action object
 * @return {Object}        New state
 */
const reducer = function (state = {}, action) {
    switch (action.type) {
        case WATER_LEVELS_SET:
            return {
                ...state,
                [getWaterLevelID(action.payload.agencyCode, action.payload.siteID)]: action.payload.waterLevels
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
