import { scaleLinear } from 'd3-scale';
import memoize from 'fast-memoize';
import { createSelector } from 'reselect';

import { getGraphSize } from './layout';
import { getDomainX, getDomainY } from './points';


/**
 * Selector for x-scale
 * @param  {Object} state       Redux store
 * @return {Function}           D3 scale function
 */
export const getScaleX = memoize(graph => createSelector(
    getDomainX,
    getGraphSize(graph),
    (domainX, size) => {
        return scaleLinear()
            .domain(domainX)
            .range([0, size.width]);
    }
));

/**
 * Selector for y-scale
 * @param  {Object} state   Redux store
 * @return {Function}       D3 scale function
 */
export const getScaleY = memoize(graph => createSelector(
    getDomainY,
    getGraphSize(graph),
    (domainY, size) => {
        return scaleLinear()
            .domain(domainY)
            .range([0, size.height]);
    }
));
