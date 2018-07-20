import { axisBottom, axisLeft } from 'd3-axis';
import { createSelector } from 'reselect';

import { getScaleX, getScaleY } from './scales';


/**
 * Get the x for the current graph
 * @param  {Object} xScale      D3 Scale object for the x-axis
 * @return {Object}             {xAxis, yAxis} - D3 Axis
 */
export const getAxisX = createSelector(
    getScaleX,
    (xScale) => {
        return axisBottom()
            .scale(xScale)
            .tickSizeOuter(0);
    }
);

/**
 * Get the y axis for the current graph
 * @param  {Object} yScale      D3 Scale object for the y-axis
 * @return {Object}             {xAxis, yAxis} - D3 Axis
 */
export const getAxisY = createSelector(
    getScaleY,
    (yScale) => {
        return axisLeft()
            .scale(yScale)
            .tickPadding(3)
            .tickSizeOuter(0);
    }
);
