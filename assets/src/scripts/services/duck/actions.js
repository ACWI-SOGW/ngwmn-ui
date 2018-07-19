import * as types from './types';


/**
 * Store the specified water levels for a given site in the store.
 * @param  {String} agencyCode  Agency code
 * @param  {String} siteID      Site ID
 * @params {Object} waterLevels Water level details to set
 * @return {Object}             WATER_LEVELS_GET action
 */
export const setWaterLevels = function (agencyCode, siteID, waterLevels) {
    return {
        type: types.WATER_LEVELS_SET,
        payload: {
            agencyCode,
            siteID,
            waterLevels
        }
    };
};
