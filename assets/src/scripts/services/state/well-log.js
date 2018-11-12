import { getSiteKey } from './index';


const MOUNT_POINT = 'services/well-log';
const WELL_LOG_SET = `${MOUNT_POINT}/WELL_LOG_SET`;

/**
 * Action creator:
 * Store the specified well log for a given site in the store.
 * @param  {String} agencyCode  Agency code
 * @param  {String} siteId      Site ID
 * @params {Object} wellLog     Well log to set
 * @return {Object}             WELL_LOG_SET action
 */
export const setWellLog = function (agencyCode, siteId, wellLog) {
    return {
        type: WELL_LOG_SET,
        payload: {
            agencyCode,
            siteId,
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
                [getSiteKey(action.payload.agencyCode, action.payload.siteId)]: action.payload.wellLog
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
