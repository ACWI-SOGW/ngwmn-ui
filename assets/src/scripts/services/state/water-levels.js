import memoize from 'fast-memoize';
import { createSelector } from 'reselect';

import * as cache from '../cache';
import { getSiteKey } from './index';


export const MOUNT_POINT = 'services/water-levels';
export const WATER_LEVELS_SET = `${MOUNT_POINT}/WATER_LEVELS_SET`;

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
 * Thunk action:
 * Action that returns a thunk that calls the getWaterLevels action and then
 * dispatches actions to update the state.
 * @param  {String} agencyCode Agency code
 * @param  {String} siteId)    Site ID
 * @return {Function}          Thunk
 */
export const retrieveWaterLevels = (agencyCode, siteId) => (dispatch) => {
    return cache.retrieveWaterLevels(agencyCode, siteId).then(waterLevels => {
        dispatch(setWaterLevels(agencyCode, siteId, waterLevels));
    });
};

/**
 * Return all water level data
 * @param  {Object} state Redux state
 * @return {Object}       Water levels keyed on ID
 */
export const getWaterLevels = state => state[MOUNT_POINT];

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
                [getSiteKey(action.payload.agencyCode, action.payload.siteId)]: action.payload.waterLevels
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
