import { scaleLinear } from 'd3-scale';
import memoize from 'fast-memoize';
import { createSelector } from 'reselect';

import { getWellLogs } from 'ngwmn/services/state/index';
import { getCursorDatum } from './cursor';
import { getChartPosition } from './layout';
import { getCurrentSiteID } from './options';
import { getScaleX, getScaleY } from './scales';


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

/**
 * Returns the well log entries for the current site.
 * @param  {Object} state       Redux state
 * @return {Array}              List of well log entries
 */
export const getWellLogEntries = createSelector(
    getCurrentWellLog,
    (wellLog) => {
        return wellLog.log_entries || [];
    }
);

/**
 * Returns the depth extent for the current well log.
 * @param  {Object} state       Redux state
 * @return {Array}              y-extent [min, max]
 */
export const getWellLogExtentY = createSelector(
    getWellLogEntries,
    (wellLogEntries) => {
        if (wellLogEntries.length === 0) {
            return [0, 0];
        }
        return [
            Math.min(...wellLogEntries.map(entry => entry.shape.coordinates.start)),
            Math.max(...wellLogEntries.map(entry => entry.shape.coordinates.end))
        ];
    }
);

/**
 * Produces a list of lithology rectangles for a given chart type.
 * @param  {String} chartType            Kind of chart
 * @return {Array}                       Array of rectangles {x, y, width, height}
 */
export const getLithology = memoize(chartType => createSelector(
    getWellLogEntries,
    getChartPosition(chartType),
    getScaleY(chartType),
    (wellLogEntries, layout, yScale) => {
        return wellLogEntries.map(entry => {
            const top = yScale(entry.shape.coordinates.start) || 0;
            const bottom = yScale(entry.shape.coordinates.end) || 0;
            return {
                x: layout.x,
                y: top,
                width: layout.width,
                height: bottom - top,
                entry
            };
        });
    }
));

const getDrawableCasings = createSelector(
    getCurrentWellLog,
    (wellLog) => {
        return (wellLog.casings || [])
            .filter(casing => casing.position && casing.position.coordinates);
    }
);

const getDrawableScreens = createSelector(
    getCurrentWellLog,
    (wellLog) => {
        return (wellLog.screens || [])
            .filter(screen => screen.position && screen.position.coordinates);
    }
);

const getScreenExtentY = createSelector(
    getDrawableScreens,
    (screens) => {
        return [
            Math.min(...screens.map(screen => screen.position.coordinates.start)),
            Math.max(...screens.map(screen => screen.position.coordinates.end))
        ];
    }
);

const getCasingExtentY = createSelector(
    getDrawableCasings,
    (casings) => {
        return [
            Math.min(...casings.map(casing => casing.position.coordinates.start)),
            Math.max(...casings.map(casing => casing.position.coordinates.end))
        ];
    }
);

const getWellDiameterExtent = createSelector(
    getDrawableScreens,
    getDrawableCasings,
    (screens, casings) => {
        const values = [...screens, ...casings]
            .map(part => part.diameter.value)
            .filter(part => part !== null);
        return [
            Math.min(...values),
            Math.max(...values)
        ];
    }
);

const getWellExtentY = createSelector(
    getScreenExtentY,
    getCasingExtentY,
    (screenExtent, casingExtent) => {
        return [
            Math.min(screenExtent[0], casingExtent[0]),
            Math.max(screenExtent[1], casingExtent[1])
        ];
    }
);

/**
 * Returns extent of the water level for the cursor location.
 * @param  {Object} state       Redux state
 * @return {Array}              Water level rectangle
 */
export const getWellWaterLevel = memoize(chartType => createSelector(
    getChartPosition(chartType),
    getScaleX(chartType),
    getScaleY(chartType),
    getCursorDatum,
    getWellExtentY,
    (chartPos, xScale, yScale, cursorDatum, extentY) => {
        if (!cursorDatum) {
            return null;
        }
        const top = yScale(cursorDatum.value);
        const bottom = yScale(extentY[1]);
        return {
            x: xScale.range()[0] + 35,
            y: top,
            width: Math.max(0, chartPos.width - 70),
            height: Math.max(bottom - top, 0)
        };
    }
));

/**
 * Returns the construction casing entries for the current site.
 * @param  {Object} state       Redux state
 * @return {Array}              Array of casings
 */
export const getCasings = memoize(chartType => createSelector(
    getDrawableCasings,
    getChartPosition(chartType),
    getScaleX(chartType),
    getScaleY(chartType),
    (casings, chartPos, xScale, yScale) => {
        return casings.map(casing => {
            const loc = casing.position.coordinates;
            return {
                x: xScale.range()[0] + 30,
                y: yScale(loc.start),
                width: Math.max(0, chartPos.width - 60),
                height: Math.max(yScale(loc.end - loc.start), 0),
                casing
            };
        });
    }
));

/**
 * Returns the construction screen entries for the current site.
 * @param  {Object} state       Redux state
 * @return {Array}              Array of screens
 */
export const getScreens = memoize(chartType => createSelector(
    getDrawableScreens,
    getChartPosition(chartType),
    getScaleX(chartType),
    getScaleY(chartType),
    (screens, chartPos, xScale, yScale) => {
        return screens.map(screen => {
            const loc = screen.position.coordinates;

            return {
                x: xScale.range()[0] + 35,
                y: yScale(loc.start),
                width: Math.max(0, chartPos.width - 70),
                height: Math.max(yScale(loc.end - loc.start), 0),
                screen
            };
        });
    }
));

export const getRadiusScale = memoize(chartType => createSelector(
    getWellDiameterExtent,
    getScaleY(chartType),
    (diameterExtent, yScale) => {
        const range = yScale.range();
        const width = range[1] - range[0];
        const maxRadius = diameterExtent[1] / 2;
        return scaleLinear()
            .domain([0, maxRadius])
            .range([width / 2, range[1] - width * 0.05]);
    }
));

export const getConstruction = memoize(chartType => createSelector(
    getDrawableCasings,
    getDrawableScreens,
    getRadiusScale,
    getScaleY(chartType),
    (casings, screens, xScale, yScale) => {
        [...casings, ...screens].map(part => {
            return {
                x1: 0,
                y1: yScale(part.position.coordinates.start),
                x2: xScale(part.diameter / 2),
                y2: yScale(part.position.coordinates.end)
            };
        });
    }
));
