import * as cache from '../cache';
import * as actions from './actions';


export const setWaterLevels = actions.setWaterLevels;

/**
 * Returns a thunk that calls the getWaterLevels action and then dispatches
 * actions to update the state.
 * @param  {String} agencyCode Agency code
 * @param  {String} siteID)    Site ID
 * @return {Function}          Thunk
 */
export const retrieveWaterLevels = (agencyCode, siteID) => (dispatch) => {
    cache.retrieveWaterLevels(agencyCode, siteID).then(waterLevels => {
        dispatch(actions.setWaterLevels(waterLevels));
    });
};
