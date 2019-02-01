import waterLevels from './water-levels'; 
import medianWaterLevels from './median-water-levels'; 
import wellLog from './well-log';

export * from './water-levels';
export * from './median-water-levels';
export * from './well-log';
export default {
    ...waterLevels,
    ...wellLog
};

/**
 * Gets the unique id for a given site.
 * @param  {String} agencyCode Agency code of site
 * @param  {String} siteId     Agency's site ID for site
 * @return {String}            Unique site ID
 */
export const getSiteKey = function (agencyCode, siteId) {
    return `${agencyCode}:${siteId}`;
};
