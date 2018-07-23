import { scaleLinear } from 'd3-scale';
import { createSelector } from 'reselect';

import { getLayout } from './layout';
import { getDomainX, getDomainY } from './points';


/**
 * Selector for x-scale
 * @param  {Object} state       Redux store
 * @return {Function}           D3 scale function
 */
export const getScaleX = createSelector(
    getDomainX,
    getLayout,
    (domainX, layout) => {
        return scaleLinear()
            .domain(domainX)
            .range([0, layout.width]);
    }
);

/**
 * Selector for y-scale
 * @param  {Object} state   Redux store
 * @return {Function}       D3 scale function
 */
export const getScaleY = createSelector(
    getDomainY,
    getLayout,
    (domainY, layout) => {
        return scaleLinear()
            .domain(domainY)
            .range([layout.height, 0]);
    }
);
