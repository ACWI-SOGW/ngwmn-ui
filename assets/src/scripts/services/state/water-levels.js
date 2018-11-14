import memoize from 'fast-memoize';
import { createSelector } from 'reselect';

import * as cache from '../cache';
import { getSiteKey } from './index';


export const MOUNT_POINT = 'services/water-levels';
export const WATER_LEVELS_SET = `${MOUNT_POINT}/WATER_LEVELS_SET`;
export const WATER_LEVELS_CALL_STATUS = `${MOUNT_POINT}/WATER_LEVELS_CALL_STATUS`;

/**
 * Action creator:
 * Store the specified water levels for a given site in the store.
 * @param  {String} agencyCode  Agency code
 * @param  {String} siteId      Site ID
 * @param {Object} waterLevels Water level details to set
 * @return {Object}             WATER_LEVELS_SET action
 */
export const setWaterLevels = function (agencyCode, siteId, waterLevels) {
    return {
        type: WATER_LEVELS_SET,
        payload: {
            agencyCode,
            siteId,
            waterLevels
        }
    };
};

/**
 * Action creator:
 * Set the status of the water levels service call
 * @param {String} agencyCode Agency code
 * @param {String} siteId     Site ID
 * @param {String} status     Status string of service call for specified site
 */
export const setWaterLevelStatus = function (agencyCode, siteId, status) {
    return {
        type: WATER_LEVELS_CALL_STATUS,
        payload: {
            agencyCode,
            siteId,
            status
        }
    };
};

export const getWaterLevelStatus = memoize((agencyCode, siteId) => createSelector(
    state => (state[MOUNT_POINT] || {}).requestStatus || {},
    (status) => {
        return status[getSiteKey(agencyCode, siteId)];
    }
));

/**
 * Thunk action:
 * Action that returns a thunk that calls the getWaterLevels action and then
 * dispatches actions to update the state.
 * @param  {String} agencyCode Agency code
 * @param  {String} siteId)    Site ID
 * @return {Function}          Thunk
 */
export const retrieveWaterLevels = (agencyCode, siteId) => (dispatch) => {
    dispatch(setWaterLevelStatus(agencyCode, siteId, 'STARTED'));
    return cache.retrieveWaterLevels(agencyCode, siteId)
        .then(waterLevels => {
            dispatch(setWaterLevels(agencyCode, siteId, waterLevels));
            dispatch(setWaterLevelStatus(agencyCode, siteId, 'DONE'));
        });
};

/**
 * Return all water level data
 * @param  {Object} state Redux state
 * @return {Object}       Water levels keyed on ID
 */
export const getWaterLevels = state => state[MOUNT_POINT]['data'] || {};

/**
 * Return water level data for the site or the empty object if no data available
 * @param {String} agencyCode
 * @param {String} siteId
 * @return {Function} selector to return water level data for the site. Returns empty object if no data available.
 */
export const getSiteWaterLevels = memoize((agencyCode, siteId) =>  createSelector(
    getWaterLevels,
    (waterLevels) => {
        const id = getSiteKey(agencyCode, siteId);
        return waterLevels[id] || {};
    }
));

/**
 * Water levels reducer
 * @param  {Object} state  Redux state
 * @param  {Object} action Action object
 * @return {Object}        New state
 */
const reducer = function (state = {}, action) {
    switch (action.type) {
        case WATER_LEVELS_SET:
            return {
                ...state,
                data: {
                    ...state.data,
                    ...{[getSiteKey(action.payload.agencyCode, action.payload.siteId)]: action.payload.waterLevels}
                }

            };
        case WATER_LEVELS_CALL_STATUS:
            return {
                ...state,
                requestStatus: {
                    ...state.requestStatus,
                    ...{[getSiteKey(action.payload.agencyCode, action.payload.siteId)]: action.payload.status}
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
