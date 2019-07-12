/**
 * Gets the unique id for a given site.
 * @param  {String} agencyCode Agency code of site
 * @param  {String} siteId     Agency's site ID for site
 * @return {String}            Unique site ID
 */
export const getSiteKey = function (agencyCode, siteId) {
    return `${agencyCode}:${siteId}`;
};
