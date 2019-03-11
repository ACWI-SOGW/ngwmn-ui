import memoize from 'fast-memoize';
import { createSelector } from 'reselect';

import { getExtentX } from './points';

import { FOCUS_CIRCLE_RADIUS } from '../view/cursor';

const MOUNT_POINT = 'components/graph/layout';
const GRAPH_SIZE_SET = `${MOUNT_POINT}/GRAPH_SIZE_SET`;
const AXIS_Y_BBOX_SET = `${MOUNT_POINT}/AXIS_Y_BBOX_SET`;
const VIEWPORT_RESET = `${MOUNT_POINT}/VIEWPORT_RESET`;
const VIEWPORT_SET = `${MOUNT_POINT}/VIEWPORT_SET`;


/**
 * Action creator to set the current viewport date range (x-axis)
 * @param {Date} startDate  Start date of viewport
 * @param {Date} endDate    End date of viewport
 */
export const setViewport = function (id, [startDate, endDate]) {
    return {
        type: VIEWPORT_SET,
        payload: {
            id,
            viewport: [startDate, endDate]
        }
    };
};

/**
 * Action creator to reset the viewport to the default, 100% view.
 * @return {Object} VIEWPORT_RESET action
 */
export const resetViewport = function (id) {
    return {
        type: VIEWPORT_RESET,
        payload: {
            id
        }
    };
};

/**
 * Returns the current viewport, or the complete range if none is selection.
 * @type {Object}
 */
export const getViewport = memoize(opts => createSelector(
    state => state[MOUNT_POINT].viewports || {},
    getExtentX(opts),
    (viewports, extentX) => {
        return viewports[opts.id] || [
            extentX[0],
            extentX[1]
        ];
    }
));

/**
 * Action creator to set the graph size to a given (width, height)
 * @param {Number} options.width  Width of graph container
 * @param {Number} options.height Height of graph container
 */
export const setContainerSize = function (id, {width, height}) {
    return {
        type: GRAPH_SIZE_SET,
        payload: {
            id,
            size: {width, height}
        }
    };
};

/**
 * Selector to return the current container size
 * @param  {Object} state Redux state
 * @return {Object}       Layout
 */
export const getContainerSize = memoize(opts => createSelector(
    state => state[MOUNT_POINT].graphSizes || {},
    (graphSizes) => {
        return graphSizes[opts.id] || {
            width: 0,
            height: 0
        };
    }
));

/**
 * Action creator to set the bounding box of the y-axis in the main chart.
 * @param {Number} options.x      x-location of y-axis
 * @param {Number} options.y      y-location of y-axis
 * @param {Number} options.width  width of y-axis bounding box
 * @param {Number} options.height height of y-axis bounding box
 */
export const setAxisYBBox = function (id, {x, y, width, height}) {
    return {
        type: AXIS_Y_BBOX_SET,
        payload: {
            id,
            axisYBBox: {
                x,
                y,
                width,
                height
            }
        }
    };
};

/**
 * Selector to return the current container size
 * @param  {Object} state Redux state
 * @return {Object}       Layout
 */
export const getAxisYBBox = memoize(opts => createSelector(
    state => state[MOUNT_POINT].axisYBBoxes || {},
    (axisYBBoxes) => {
        return axisYBBoxes[opts.id] || {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
    }
));

/**
 * Returns the viewBox of the chart's SVG node, taking into account the size of
 * its containing SVG node and the dimensions of the y-axis ticks.
 * @param  {Object} state   Redux state
 * @return {Object}         {x, y, width, height} of viewBox
 */
export const getViewBox = memoize(opts => createSelector(
    getContainerSize(opts),
    getAxisYBBox(opts),
    (containerSize, axisYBBox) => {
        if (chartType === 'main' || chartType === 'brush') {
           const aspectRatio = containerSize.height / containerSize.width || 0;
        } else if (chartType === 'lithology' || chartType === 'construction') {
           const aspectRatio = 4;
        }
        const width = containerSize.width + axisYBBox.width + FOCUS_CIRCLE_RADIUS;
        const height = width * aspectRatio;

        return {
            left: axisYBBox.x,
            top: 0,
            right: axisYBBox.x + width,
            bottom: height
        };
    }
));

/**
 * Returns the position of a chart type within the graph container.
 * @param  {String}     graph Chart type identifier
 * @return {Function}   Selector for chart position
 */
export const getChartPosition = memoize((opts) => createSelector(
    getViewBox(opts),
    (viewBox) => {
        const height = viewBox.bottom - viewBox.top;
        const width = viewBox.right;
        const PADDING = 10;
        switch (chartType) {
            case 'main':
                return {
                    x: 0,
                    y: 0,
                    width: Math.max(width - FOCUS_CIRCLE_RADIUS - PADDING, FOCUS_CIRCLE_RADIUS),
                    height: height * 0.8
                };
            case 'brush':
                return {
                    x: 0,
                    y: height * 0.8,
                    width: Math.max(width - FOCUS_CIRCLE_RADIUS - PADDING, FOCUS_CIRCLE_RADIUS),
                    height: height * 0.2
                };
            case 'lithology':
                return {
                    // x: adjusts starting point of well lithology chart within the SVG view box
                    // No multiplication (x: viewBox.right * 1) well construction chart is out of the SVG view box to the right
                    // No multiplication (x: viewBox.right * 0) well construction chart touches edge of SVG view box to the left
                    x: viewBox.right * .03,
                    y: 0,
                    // reduces the width lithology chart so that the tick mark labels fit in the SVG viewport
                    width: width * .75,
                    height: height
                };
            case 'construction':
                return {
                    // x: adjusts starting point of well construction chart within the SVG view box
                    // No multiplication (x: viewBox.right * 1) well construction chart is out of the SVG view box to the right
                    // No multiplication (x: viewBox.right * 0) well construction chart touches edge of SVG view box to the left
                    x: viewBox.right * .235,
                    y: 0,
                    // reduces the width of the construction chart to produce a visually appealing effect
                    width: width * 0.35,
                    height: height
                };
            default:
                return null;
        }
    }
));

/**
 * Layout reducer
 * @param  {Object} state  Redux state
 * @param  {Object} action Action object
 * @return {Object}        New state
 */
export const reducer = function (state = {}, action) {
    switch (action.type) {
        case GRAPH_SIZE_SET:
            return {
                ...state,
                graphSizes: {
                    ...state.graphSizes,
                    ...{[action.payload.id]: action.payload.size}
                }
            };
        case AXIS_Y_BBOX_SET:
            return {
                ...state,
                axisYBBoxes: {
                    ...state.axisYBBoxes,
                    ...{[action.payload.id]: action.payload.axisYBBox}
                }
            };
        case VIEWPORT_SET:
            // Don't update if values are not valid
            if (!action.payload.viewport.every(isFinite)) {
                return state;
            }
            // Don't update if new values are the same as last viewport
            if (state.viewports && state.viewports[action.payload.id] &&
                    state.viewports[action.payload.id][0] === action.payload.viewport[0] &&
                    state.viewports[action.payload.id][1] === action.payload.viewport[1]) {
                return state;
            }
            return {
                ...state,
                viewports: {
                    ...state.viewports,
                    ...{[action.payload.id]: action.payload.viewport}
                }
            };
        case VIEWPORT_RESET:
            return {
                ...state,
                viewports: {
                    ...state.viewports,
                    ...{[action.payload.id]: null}
                }
            };
        default:
            return state;
    }
};

/**
 * Export the reducer keyed on the mount point, for easy usage with
 * combineReducers.
 */
export default {
    [MOUNT_POINT]: reducer
};
