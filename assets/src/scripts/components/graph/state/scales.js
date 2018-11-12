import { scaleLinear } from 'd3-scale';
import memoize from 'fast-memoize';
import { createSelector } from 'reselect';

import { getChartPosition } from './layout';
import { getDomainX, getDomainY } from './points';


/**
 * Selector for x-scale
 * @param  {Object} state       Redux store
 * @return {Function}           D3 scale function
 */
export const getScaleX = memoize((opts, chartType) => createSelector(
    getDomainX(opts, chartType),
    getChartPosition(chartType),
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
    getChartPosition(chartType),
    (domainY, size) => {
        return scaleLinear()
            .domain(domainY)
            .range([size.y, size.y + size.height]);
    }
));
