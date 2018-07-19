import memoize from 'fast-memoize';
import { createSelector } from 'reselect';


export const getAllWaterLevels = state => state.waterLevels;

/*
 * Provides a function which returns True if flood data is not empty.
 */
export const getWaterLevels = memoize((agencyCode, siteID) => createSelector(
    getAllWaterLevels,
    waterLevels => waterLevels[`${agencyCode}:${siteID}`]
));
