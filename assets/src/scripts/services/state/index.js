import waterLevels from './water-levels';
import wellLog from './well-log';

export * from './water-levels';
export * from './well-log';
export default {
    ...waterLevels,
    ...wellLog
};

/**
 * Gets the unique id for a given site.
 * @param  {String} agencyCode Agency code of site
 * @param  {String} siteID     Agency's site ID for site
 * @return {String}            Unique site ID
 */
export const getSiteID = function (agencyCode, siteID) {
    return `${agencyCode}:${siteID}`;
};
