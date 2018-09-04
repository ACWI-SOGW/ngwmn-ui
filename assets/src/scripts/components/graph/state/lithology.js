import memoize from 'fast-memoize';
import { createSelector } from 'reselect';

import { getWellLogs } from 'ngwmn/services/state/index';
import { getCurrentSiteID } from './options';
import { getChartPosition, getScaleY } from '../state';


/**
 * Returns the well log for the current site.
 * @param  {Object} state       Redux state
 * @return {Object}             Well log object
 */
export const getCurrentWellLog = createSelector(
    getWellLogs,
    getCurrentSiteID,
    (wellLogs, siteID) => {
        return wellLogs[siteID] || {};
    }
);

export const getWellLogEntries = createSelector(
    getCurrentWellLog,
    (wellLog) => {
        return wellLog.log_entries || [];
    }
);

export const getWellLogExtentY = createSelector(
    getWellLogEntries,
    (wellLogEntries) => {
        return [
            Math.min(...wellLogEntries.map(entry => parseFloat(entry.shape.coordinates.start))),
            Math.max(...wellLogEntries.map(entry => parseFloat(entry.shape.coordinates.end)))
        ];
    }
);

export const getLithology = memoize(chartType => createSelector(
    getWellLogEntries,
    getChartPosition(chartType),
    getScaleY(chartType),
    (wellLogEntries, layout, yScale) => {
        return wellLogEntries.map(entry => {
            const top = yScale(parseFloat(entry.shape.coordinates.start)) || 0;
            const bottom = yScale(parseFloat(entry.shape.coordinates.end)) || 0;
            return {
                x: 0,
                y: top,
                width: layout.width,
                height: bottom - top,
                entry
            };
        });
    }
));
