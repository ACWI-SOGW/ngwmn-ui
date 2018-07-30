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

export const getWaterLevelID = function (agencyCode, siteID) {
    return `${agencyCode}:${siteID}`;
};

/**
 * Selectors
 */

export const getWaterLevels = state => state[MOUNT_POINT];

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

export default {
    [MOUNT_POINT]: reducer
};
