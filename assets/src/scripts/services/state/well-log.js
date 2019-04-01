import { getSiteKey } from '../site-key';
import memoize from 'fast-memoize';
import {createSelector} from 'reselect';


const MOUNT_POINT = 'services/well-log';
const WELL_LOG_SET = `${MOUNT_POINT}/WELL_LOG_SET`;



/**
 * Return all well log data
 * @param  {Object} state Redux state
 * @return {Object} well log data object
 */
export const getWellLogData = (state) => {
    return state[MOUNT_POINT] || {};
}

/**
 * Return water level data for the site or the empty object if no data available
 * @param {String} agencyCode
 * @param {String} siteId
 * @return {Function} selector to return well depth. Returns -1 if no depth available.
 */
export const getSiteWellDepth = memoize((agencyCode, siteId) =>  createSelector(
    getWellLogData,
    (wellLogData) => {
        const siteKey = getSiteKey(agencyCode, siteId);
        if (wellLogData && wellLogData[siteKey] && wellLogData[siteKey]['well_depth']) {
            return wellLogData[siteKey]['well_depth']['value'] || -1;
        }
        return -1;
    }
));

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
