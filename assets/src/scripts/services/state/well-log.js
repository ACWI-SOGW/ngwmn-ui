import { getSiteID } from './index';


export const MOUNT_POINT = 'services/wellLog';
export const WELL_LOG_SET = `${MOUNT_POINT}/WELL_LOG_SET`;

/**
 * Action creator:
 * Store the specified well log for a given site in the store.
 * @param  {String} agencyCode  Agency code
 * @param  {String} siteID      Site ID
 * @params {Object} wellLog     Well log to set
 * @return {Object}             WELL_LOG_SET action
 */
export const setWellLog = function (agencyCode, siteID, wellLog) {
    return {
        type: WELL_LOG_SET,
        payload: {
            agencyCode,
            siteID,
            wellLog
        }
    };
};

/**
 * Return all water level data
 * @param  {Object} state Redux state
 * @return {Object}       Water levels keyed on ID
 */
export const getWellLogs = state => state[MOUNT_POINT];

/**
 * Well log reducer
 * @param  {Object} state  Redux state
 * @param  {Object} action Action object
 * @return {Object}        New state
 */
const reducer = function (state = {}, action) {
    switch (action.type) {
        case WELL_LOG_SET:
            return {
                ...state,
                [getSiteID(action.payload.agencyCode, action.payload.siteID)]: action.payload.wellLog
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
