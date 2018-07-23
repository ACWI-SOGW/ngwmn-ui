import { createSelector } from 'reselect';

import { getWaterLevels, getWaterLevelID } from 'ngwmn/services/state/index';

import { getOptions } from './options';


export const getCurrentWaterLevels = createSelector(
    getWaterLevels,
    getOptions,
    (waterLevels, options) => {
        const waterLevelID = getWaterLevelID(options.agencycode, options.siteid);
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
                x: datum.fromDatumValue,
                y: datum.time
            };
        });
    }
);

export const getDomainX = createSelector(
    getChartPoints,
    (chartPoints) => {
        return [
            Math.min(chartPoints.map(pt => pt.x)),
            Math.max(chartPoints.map(pt => pt.x))
        ];
    }
);

export const getDomainY = createSelector(
    getChartPoints,
    (chartPoints) => {
        return [
            Math.min(chartPoints.map(pt => pt.y)),
            Math.max(chartPoints.map(pt => pt.y))
        ];
    }
);
