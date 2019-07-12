import { scaleLinear } from 'd3-scale';
import memoize from 'fast-memoize';
import capitalize from 'lodash/capitalize';
import { createSelector } from 'reselect';

import {
    getSelectedConstructionId, getVisibleConstructionIds
} from '../../well-log/state';

import { getCursorDatum } from './cursor';
import { getChartPosition, getContainerSize } from './layout';
import { getScaleX, getScaleY } from './scales';

import { getSiteWellDepth, getWellLogs } from '../../../services/state';


/**
 * Returns the well log for the current site.
 * @param  {Object} state       Redux state
 * @return {Object}             Well log object
 */
export const getCurrentWellLog = memoize(opts => createSelector(
    getWellLogs,
    (wellLogs) => {
        return wellLogs[opts.siteKey] || {};
    }
));

/**
 * Returns the well log entries for the current site.
 * @param  {Object} state       Redux state
 * @return {Array}              List of well log entries
 */
export const getWellLogEntries = memoize(opts => createSelector(
    getCurrentWellLog(opts),
    (wellLog) => {
        return wellLog.log_entries || [];
    }
));

/**
 * Returns the depth extent for the well log entries.
 * @param  {Object} state       Redux state
 * @return {Array}              y-extent [min, max]
 */
export const getWellLogEntriesExtentY = memoize(opts => createSelector(
    getWellLogEntries(opts),
    getSiteWellDepth(opts.agencyCode, opts.siteId),
    (wellLogEntries, wellDepth) => {
        if (wellLogEntries.length === 0) {
            return [0, Math.max(0,wellDepth)];
        }
        return [
            Math.min(...wellLogEntries.map(entry => entry.shape.coordinates.start)),
            Math.max(...wellLogEntries.map(entry => entry.shape.coordinates.end), wellDepth)
        ];
    }
));

/**
 * Produces a list of lithology rectangles for a given chart type.
 * @param  {String} chartType            Kind of chart
 * @return {Array}                       Array of rectangles {x, y, width, height}
 */
export const getLithology = memoize((opts, chartType) => createSelector(
    getWellLogEntries(opts),
    getChartPosition(opts, chartType),
    getScaleY(opts, chartType),
    (wellLogEntries, layout, yScale) => {
        return wellLogEntries.map(entry => {
            const loc = entry.shape.coordinates;
            const top = yScale(loc.start) || 0;
            const bottom = yScale(loc.end) || 0;
            const name = entry.unit.description;
            return {
                id: entry.id,
                x: layout.x,
                y: top,
                width: layout.width,
                height: bottom - top,
                colors: entry.unit.ui.colors,
                materials: entry.unit.ui.materials,
                title: `${loc.start} - ${loc.end} ${entry.shape.unit}, ${name}`
            };
        });
    }
));

const getDrawableElements = memoize(opts => createSelector(
    getCurrentWellLog(opts),
    getVisibleConstructionIds(opts.siteKey),
    (wellLog, visibleIds) => {
        return (wellLog.construction || [])
            .filter(element => {
                return element.position && element.position.coordinates &&
                       visibleIds && visibleIds.indexOf(element.id) !== -1;
            });
    }
));

export const getConstructionExtentY = memoize((opts) => createSelector(
    getDrawableElements(opts),
    (elements) => {
        return [
            Math.min(...elements.map(elem => elem.position.coordinates.start)),
            Math.max(...elements.map(elem => elem.position.coordinates.end))
        ];
    }
));

/**
 * Returns the depth extent for the current well log.
 * @param  {Object} state       Redux state
 * @return {Array}              y-extent [min, max]
 */
export const getWellLogExtentY = memoize((opts) => createSelector(
    getWellLogEntriesExtentY(opts),
    getConstructionExtentY(opts),
    (extentA, extentB) => {
        return [
            Math.min(extentA[0], extentB[0]),
            Math.max(extentA[1], extentB[1])
        ];
    }
));

/**
 * Returns extent of the water level for the cursor location.
 * @param  {Object} state       Redux state
 * @return {Array}              Water level rectangle
 */
export const getWellWaterLevel = memoize((opts, chartType) => createSelector(
    getScaleX(opts, chartType),
    getScaleY(opts, chartType),
    getCursorDatum(opts),
    getConstructionExtentY(opts),
    (xScale, yScale, cursorDatum, extentY) => {
        if (!cursorDatum) {
            return null;
        }
        const top = yScale(cursorDatum.value);
        const bottom = yScale(extentY[1]);
        const xRange = xScale.range();
        return {
            x: xRange[0],
            y: top,
            width: xRange[1] - xRange[0],
            height: Math.max(bottom - top, 0)
        };
    }
));

const getWellRadius = memoize((opts) => createSelector(
    getDrawableElements(opts),
    (elements) => {
        const values = elements
            .map(part => part.diameter ? part.diameter.value : null)
            .filter(part => part !== null);

        // If we lack data, default to a radius of 1.
        if (!values.length) {
            return 1;
        }

        return Math.max(...values) / 2;
    }
));

/**
 * Returns an xScale corresponding over the range of [-radius, radius] for the
 * given chartType.
 * @param  {Object} state       Redux state
 * @return {Array}              D3 linear scale
 */
const getRadiusScale = memoize((opts, chartType) => createSelector(
    getWellRadius(opts),
    getChartPosition(opts, chartType),
    (wellRadius, chartPos) => {
        return scaleLinear()
            .domain([-wellRadius, wellRadius])
            .range([chartPos.x, chartPos.x + chartPos.width]);
    }
));

const createBoreholeElement = function(yScale, elements, wellDepth, size) {
    if (yScale === undefined || size === undefined || size.height === undefined) {
        return undefined;
    }

    // check to see if we have construction elements
    const hasElements = elements && elements.length > 0;
    // scale the well depth to the graph size
    const scaleDepth  = yScale(wellDepth); // TODO is the well depth always scaled to graph height?

    const margin = 10;

    // initialize variables assuming no elements
    let minDepth = 0;
    let maxDepth = Math.max(size.height, scaleDepth);
    let leftX    = 0;
    let rightX   = Math.max(size.width-margin, 0);

    if (hasElements) {
        // if there are elements then prepare to base the bounds from them.
        // use the opposite bounds in order to detect the reverse extremes.
        minDepth = size.height;
        maxDepth = Math.max(scaleDepth,0); // if there is good depth info then default to it
        leftX    = rightX;
        rightX   = 0;

        elements.forEach((element) => {
            leftX    = Math.min(leftX,    element.left.x);  // left.x is more like position
            rightX   = Math.max(rightX,   element.right.x); // right.x is max girth or width
            minDepth = Math.min(minDepth, element.left.y1); // y1 is more like position
            maxDepth = Math.max(maxDepth, element.left.y2); // y2 is max depth or height
        });
    }

    const borehole = {
        title: 'borehole',
        type: 'borehole',
        thickness: 1,
        left: {
            x:  leftX,
            y1: minDepth,
            y2: maxDepth
        },
        right: {
            x:  rightX,
            y1: minDepth,
            y2: maxDepth
        }
    };
    return borehole;
};

/**
 * Returns the construction elements for the current site.
 * @param  {Object} state       Redux state
 * @return {Array}              Array of elements
 */
export const getConstructionElements = memoize((opts, chartType) => createSelector(
    getDrawableElements(opts),
    getRadiusScale(opts, chartType),
    getScaleY(opts, chartType),
    getSelectedConstructionId(opts.siteKey),
    getSiteWellDepth(opts.agencyCode, opts.siteId),
    getContainerSize(opts),
    (elements, xScale, yScale, selectedId, wellDepth, containerSize) => {
        const parts = elements.map(element => {
            const loc = element.position.coordinates;
            const unit = element.position.unit;
            const radius = element.diameter ? element.diameter.value / 2 : null;
            const diamStr = radius ? `${element.diameter.value} ${element.diameter.unit}` : 'unknown';
            const locString = `${loc.start} - ${loc.end} ${unit}`;
            return {
                id: element.id,
                isSelected: element.id == selectedId,
                type: element.type,
                radius: radius,
                title: `${capitalize(element.type)}, ${diamStr} diameter, ${locString} depth`,
                thickness: xScale(.5) - xScale(0),  // 0.5" pipe thickness
                left: {
                    x: radius ? xScale(-radius) : null,
                    y1: yScale(loc.start),
                    y2: yScale(loc.end)
                },
                right: {
                    x: radius ? xScale(radius) : null,
                    y1: yScale(loc.start),
                    y2: yScale(loc.end)
                }
            };
        });

        // For parts with null radii, fill in with something that will render
        // reasonably.
        for (let index = 0; index < parts.length; index++) {
            const part = parts[index];

            // We already have a radius... skip
            if (part.radius) {
                continue;
            }

            // If we have neighboring parts, use the smaller of the two.
            const neighbors = [
                // Closest left-side neighbor with a radius
                parts.slice(0, index).reverse().find(part => part.radius),
                // Closest right-side neighbor with a radius
                parts.slice(index + 1).find(part => part.radius)
            ].filter(neighbor => neighbor && neighbor.radius);

            const min = Math.min(...neighbors.map(n => n.radius));
            if (min && isFinite(min)) {
                part.left.x = xScale(-min);
                part.right.x = xScale(min);
                continue;
            }

            // If there isn't a neighboring part, default to a radius of 1
            part.left.x = xScale(-1);
            part.right.x = xScale(1);
        }

        // Sort the parts by end location and radius.
        // They should already be sorted by location, but we also want to draw
        // the wider diameter pipes before drawing the smaller ones, and have
        // overlapping elements hoverable.
        parts.sort(function (a, b) {
            if (a.left.y2 < b.left.y2) {
                return 1;
            }
            if (a.left.y2 > b.left.y2) {
                return -1;
            }
            if (a.radius < b.radius) {
                return 1;
            }
            if (a.radius > b.radius) {
                return -1;
            }
            return 0;
        });

        const borehole = createBoreholeElement(yScale, parts, wellDepth, containerSize);

        if (borehole === undefined) {
            return parts;
        }
        return [
            borehole,
            ...parts
        ];
    }
));
