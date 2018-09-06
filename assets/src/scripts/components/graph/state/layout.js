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
export const setViewport = function ([startDate, endDate]) {
    return {
        type: VIEWPORT_SET,
        payload: [
            startDate,
            endDate
        ]
    };
};

/**
 * Action creator to reset the viewport to the default, 100% view.
 * @return {Object} VIEWPORT_RESET action
 */
export const resetViewport = function () {
    return {
        type: VIEWPORT_RESET
    };
};

/**
 * Returns the current viewport, or the complete range if none is selection.
 * @type {Object}
 */
export const getViewport = createSelector(
    state => state[MOUNT_POINT].viewport,
    getExtentX,
    (viewport, extentX) => {
        return viewport || [
            extentX[0],
            extentX[1]
        ];
    }
);

/**
 * Action creator to set the graph size to a given (width, height)
 * @param {Number} options.width  Width of graph container
 * @param {Number} options.height Height of graph container
 */
export const setContainerSize = function ({width, height}) {
    return {
        type: GRAPH_SIZE_SET,
        payload: {
            width,
            height
        }
    };
};

/**
 * Selector to return the current container size
 * @param  {Object} state Redux state
 * @return {Object}       Layout
 */
export const getContainerSize = state => state[MOUNT_POINT].graphSize || {
    width: 0,
    height: 0
};

/**
 * Action creator to set the bounding box of the y-axis in the main chart.
 * @param {Number} options.x      x-location of y-axis
 * @param {Number} options.y      y-location of y-axis
 * @param {Number} options.width  width of y-axis bounding box
 * @param {Number} options.height height of y-axis bounding box
 */
export const setAxisYBBox = function ({x, y, width, height}) {
    return {
        type: AXIS_Y_BBOX_SET,
        payload: {
            x,
            y,
            width,
            height
        }
    };
};

/**
 * Selector to return the current container size
 * @param  {Object} state Redux state
 * @return {Object}       Layout
 */
export const getAxisYBBox = state => state[MOUNT_POINT].axisYBBox || {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};

/**
 * Returns the viewBox of the chart's SVG node, taking into account the size of
 * its containing SVG node and the dimensions of the y-axis ticks.
 * @param  {Object} state   Redux state
 * @return {Object}         {x, y, width, height} of viewBox
 */
export const getViewBox = createSelector(
    getContainerSize,
    getAxisYBBox,
    (containerSize, axisYBBox) => {
        const aspectRatio = containerSize.height / containerSize.width || 0;
        const width = containerSize.width + axisYBBox.width + FOCUS_CIRCLE_RADIUS;
        const height = width * aspectRatio;
        return {
            left: axisYBBox.x,
            top: 0,
            right: axisYBBox.x + width,
            bottom: height
        };
    }
);

/**
 * Returns the position of a chart type within the graph container.
 * @param  {String} graph Chart type identifier
 * @return {Function}     Selector for chart position
 */
export const getChartPosition = memoize(chartType => createSelector(
    getViewBox,
    (viewBox) => {
        const height = viewBox.bottom - viewBox.top;
        const width = viewBox.right;
        const PADDING = 10;
        switch (chartType) {
            case 'main':
                return {
                    x: 0,
                    y: 0,
                    width: Math.max(width * 0.9 - FOCUS_CIRCLE_RADIUS - PADDING, FOCUS_CIRCLE_RADIUS),
                    height: height * 0.8
                };
            case 'brush':
                return {
                    x: 0,
                    y: height * 0.8,
                    width: Math.max(width * 0.9 - FOCUS_CIRCLE_RADIUS - PADDING, FOCUS_CIRCLE_RADIUS),
                    height: height * 0.2
                };
            case 'lithology':
                return {
                    x: viewBox.right * 0.9,
                    y: 0,
                    width: Math.max(width * 0.1, 0),
                    height: height * 0.8
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
                graphSize: {
                    width: action.payload.width,
                    height: action.payload.height
                }
            };
        case AXIS_Y_BBOX_SET:
            return {
                ...state,
                axisYBBox: {
                    x: action.payload.x,
                    y: action.payload.y,
                    width: action.payload.width,
                    height: action.payload.height
                }
            };
        case VIEWPORT_SET:
            // Don't update if values are not valid
            if (!action.payload.every(isFinite)) {
                return state;
            }
            // Don't update if new values are the same as last viewport
            if (state.viewport && state.viewport[0] === action.payload[0] &&
                    state.viewport[1] === action.payload[1]) {
                return state;
            }
            return {
                ...state,
                viewport: action.payload
            };
        case VIEWPORT_RESET:
            return {
                ...state,
                viewport: null
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
