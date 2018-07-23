import { createSelector } from 'reselect';

import * as cache from '../cache';


const MOUNT_POINT = 'services/cache/waterLevels';
const WATER_LEVELS_SET = `${MOUNT_POINT}/WATER_LEVELS_SET`;

/**
 * Action creator:
 * Store the specified water levels for a given site in the store.
 * @param  {String} agencyCode  Agency code
 * @param  {String} siteID      Site ID
 * @params {Object} waterLevels Water level details to set
 * @return {Object}             WATER_LEVELS_GET action
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
    cache.retrieveWaterLevels(agencyCode, siteID).then(waterLevels => {
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

export const getTimeRange = createSelector(
    getWaterLevels,
    (waterLevels) => {
        const samples = waterLevels.samples || [];
        return Object.keys(samples).reduce((timeRanges, id) => {
            timeRanges[id] = {
                start: waterLevels[0].time,
                end: waterLevels[waterLevels.length - 1].time
            };
            return timeRanges;
        }, {});
    }
);

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
