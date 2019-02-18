import memoize from 'fast-memoize';
import { createSelector } from 'reselect';

import * as stats from '../statistics';
import {getSiteKey, getSiteWaterLevels} from './index';


export const MOUNT_POINT = 'services/median-water-levels';
export const MEDIAN_WATER_LEVELS_SET = `${MOUNT_POINT}/MEDIAN_WATER_LEVELS_SET`;
export const MEDIAN_WATER_LEVELS_CALL_STATUS = `${MOUNT_POINT}/MEDIAN_WATER_LEVELS_CALL_STATUS`;

/**
 * Action creator:
 * Store the specified water levels for a given site in the store.
 * @param  {String} agencyCode  Agency code
 * @param  {String} siteId      Site ID
 * @param {Object} waterLevels Water level details to set
 * @return {Object}             WATER_LEVELS_SET action
 */
export const setMedianWaterLevels = function(agencyCode, siteId, waterLevels) {
    return {
        type: MEDIAN_WATER_LEVELS_SET,
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
export const setMedianWaterLevelStatus = function(agencyCode, siteId, status) {
    return {
        type: MEDIAN_WATER_LEVELS_CALL_STATUS,
        payload: {
            agencyCode,
            siteId,
            status
        }
    };
};

// TODO asdf this looks like it might conflict with getWaterLevelStatus
export const getMedianWaterLevelStatus = memoize((agencyCode, siteId) => createSelector(
    state => (state[MOUNT_POINT] || {}).requestStatus || {},
    (status) => {
        return status[getSiteKey(agencyCode, siteId)];
    }
));

/**
 * Thunk action:
 * Action that returns a thunk that calls the getMedianWaterLevels action and then
 * dispatches actions to update the state.
 * @param  {String} agencyCode Agency code
 * @param  {String} siteId)    Site ID
 * @return {Function}          Thunk
 */
export const retrieveMedianWaterLevels = (agencyCode, siteId) => (dispatch, getState) => {
    dispatch(setMedianWaterLevelStatus(agencyCode, siteId, 'STARTED'));
    const waterLevels = getSiteWaterLevels(agencyCode, siteId)(getState());
    return stats.retrieveMedianWaterLevels(waterLevels)
        .then(medians => {
            dispatch(setMedianWaterLevels(agencyCode, siteId, medians));
            dispatch(setMedianWaterLevelStatus(agencyCode, siteId, 'DONE'));
        });
};

/**
 * Return median water level data
 * @param  {Object} state Redux state
 * @return {Object}       Water levels keyed on ID
 */
export const getMedianWaterLevels = state => {
    return state[MOUNT_POINT]['data'] || {};
}

/**
 * Return water level data for the site or the empty object if no data available
 * @param {String} agencyCode
 * @param {String} siteId
 * @return {Function} selector to return water level data for the site. Returns empty object if no data available.
 */
export const getSiteMedianWaterLevels = memoize((agencyCode, siteId) =>  createSelector(
    getMedianWaterLevels,
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
        case MEDIAN_WATER_LEVELS_SET:
            return {
                ...state,
                data: {
                    ...state.data,
                    ...{[getSiteKey(action.payload.agencyCode, action.payload.siteId)]: action.payload.waterLevels}
                }

            };
        case MEDIAN_WATER_LEVELS_CALL_STATUS:
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
