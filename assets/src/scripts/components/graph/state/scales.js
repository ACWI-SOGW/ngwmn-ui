import { scaleLinear } from 'd3-scale';
import memoize from 'fast-memoize';
import { createSelector } from 'reselect';

import { getChartPosition } from './layout';
import { getDomainX, getDomainY } from './points';
import { getCurrentWellLog } from '../state/well-log';


/**
 * Selector for x-scale
 * @param  {Object} state       Redux store
 * @return {Function}           D3 scale function
 */
export const getScaleX = memoize((opts, chartType) => createSelector(
    getDomainX(opts, chartType),
    getChartPosition(opts, chartType),
    (domainX, size) => {
        return scaleLinear()
            .domain(domainX)
            .range([size.x, size.x + size.width]);
    }
));

/**
 * Selector for y-scale
 * @param  {Object} state   Redux store
 * @return {Function}       D3 scale function
 */
export const getScaleY = memoize((opts, chartType) => createSelector(
    getDomainY(opts, chartType),
    getChartPosition(opts, chartType),
    (domainY, size) => {
        return scaleLinear()
            .domain(domainY)
            .range([size.y, size.y + size.height]);
    }
));


// ADDED FOR 1790
export const getScaleYElevation = memoize((opts, chartType) => createSelector(
    getDomainY(opts, chartType),
    getChartPosition(opts, chartType),
    getCurrentWellLog(opts),
    (domainY, size, wellLog) => {
console.log('this is the domain for elevation ' + [domainY[0] + wellLog['elevation']['value'], domainY[1] - wellLog['elevation']['value']])
        return scaleLinear()
            .domain([domainY[0] + wellLog['elevation']['value'], domainY[1] - wellLog['elevation']['value']])
            .range([size.y, size.y + size.height]);
    }
));
