import { extent } from 'd3-array';
import memoize from 'fast-memoize';
import { createSelector } from 'reselect';

import { getWaterLevels } from 'ngwmn/services/state/index';

import { getViewport } from './layout';
import { getCurrentWaterLevelID } from './options';


// Lines will be split if the difference exceeds 6 months.
export const MAX_LINE_POINT_GAP =
    182/*days*/ * 24/*hrs*/ * 60/*min*/ * 60/*sec*/ * 1000/*ms*/;

// 20% padding around the y-domain
const PADDING_RATIO = 0.2;


export const getCurrentWaterLevels = createSelector(
    getWaterLevels,
    getCurrentWaterLevelID,
    (waterLevels, waterLevelID) => {
        return waterLevels[waterLevelID] || {};
    }
);

export const getCurrentWaterLevelUnit = createSelector(
    getCurrentWaterLevels,
    (waterLevels) => {
        if (waterLevels.samples && waterLevels.samples.length) {
            return waterLevels.samples[0].unit;
        } else {
            return null;
        }
    }
);

/**
 * Selector to return points visible on the current chart view.
 * @type {Array} List of visible points
 */
export const getChartPoints = createSelector(
    getCurrentWaterLevels,
    (waterLevels) => {
        const samples = waterLevels.samples || [];
        return samples.map(datum => {
            return {
                dateTime: new Date(datum.time),
                value: parseFloat(datum.fromDatumValue),
                class: {
                    A: 'approved',
                    P: 'provisional'
                }[datum.comment] || null
            };
        }).sort((a, b) => {
            return a.dateTime.getTime() - b.dateTime.getTime();
        });
    }
);

export const getDomainX = memoize(chartType => createSelector(
    getChartPoints,
    getViewport,
    (chartPoints, viewport) => {
        if (chartType === 'main' && viewport && viewport.startDate) {
            return [viewport.startDate, viewport.endDate];
        }
        return extent(chartPoints, pt => pt.dateTime);
    }
));

export const getDomainY = createSelector(
    getChartPoints,
    (chartPoints) => {
        const values = chartPoints.map(pt => pt.value);
        let domain = [
            Math.min(...values),
            Math.max(...values)
        ];
        const isPositive = domain[0] >= 0 && domain[1] >= 0;

        // Pad domains on both ends by PADDING_RATIO.
        const padding = PADDING_RATIO * (domain[1] - domain[0]);
        domain = [
            domain[0] - padding,
            domain[1] + padding
        ];

        // For positive domains, a zero-lower bound on the y-axis is enforced.
        return [
            isPositive ? Math.max(0, domain[0]) : domain[0],
            domain[1]
        ];
    }
);

/**
 * Returns all points in the current time series split into line segments.
 * @param  {Object} state     Redux store
 * @return {Array} List of lines segments
 */
export const getLineSegments = createSelector(
    getChartPoints,
    (points) => {
        let lines = [];

        // Accumulate data into line groups, splitting on the estimated and
        // approval status.
        let lastClass;

        for (let pt of points) {
            // Split lines if the gap from the period point exceeds
            // MAX_LINE_POINT_GAP.
            let splitOnGap = false;
            if (lines.length > 0) {
                const lastPoints = lines[lines.length - 1].points;
                const lastPtDateTime = lastPoints[lastPoints.length - 1].dateTime;
                if (pt.dateTime - lastPtDateTime > MAX_LINE_POINT_GAP) {
                    splitOnGap = true;
                }
            }

            // If this point doesn't have the same classes as the last point,
            // create a new line for it.
            if (lastClass !== pt.class || splitOnGap) {
                lines.push({
                    class: pt.class || 'unclassed',
                    points: []
                });
            }

            // Add this point to the current line.
            lines[lines.length - 1].points.push(pt);

            // Cache the class for the next loop iteration.
            lastClass = pt.class;
        }
        return lines;
    }
);

export const getActiveClasses = createSelector(
    getChartPoints,
    (chartPoints) => {
        return {
            approved: chartPoints.some(pt => pt.class === 'approved'),
            provisional: chartPoints.some(pt => pt.class === 'provisional')
        };
    }
);
