import memoize from 'fast-memoize';


const MOUNT_POINT = 'components/graph/layout';
const GRAPH_SIZE_SET = `${MOUNT_POINT}/GRAPH_SIZE_SET`;
const GRAPH_SELECTION_RECT_SET = `${MOUNT_POINT}/GRAPH_SELECTION_RECT_SET`;
const GRAPH_SELECTION_RECT_CLEAR = `${MOUNT_POINT}/GRAPH_SELECTION_RECT_CLEAR`;

/**
 * Sets the graph size to a given (width, height)
 * @param {Number} options.width  Width of graph container
 * @param {Number} options.height Height of graph container
 */
export const setGraphSize = function ({graph, width, height}) {
    return {
        type: GRAPH_SIZE_SET,
        payload: {
            graph,
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
export const getGraphSize = memoize(graph => state => {
    const graphSizes = state[MOUNT_POINT].graphSize || {};
    return graphSizes[graph] || {width: 0, height: 0};
});

/**
 * Action creator to set the graph's selection rectangle.
 * @param {Number} options.top
 * @param {Number} options.left
 * @param {Number} options.bottom
 * @param {Number} options.right
 */
export const setSelectionRect = function ({top, left, bottom, right}) {
    return {
        type: GRAPH_SELECTION_RECT_SET,
        payload: {
            top,
            left,
            bottom,
            right
        }
    };
};

export const clearSelectionRect = function () {
    return {
        type: GRAPH_SELECTION_RECT_CLEAR
    };
};

/**
 * Returns the current selection rect, or null.
 * @type {Object} {x, y, width, height}
 */
export const getSelectionRect = state => state[MOUNT_POINT].selectionRect;

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
                    ...state.graphSize,
                    ...{
                        [action.payload.graph]: {
                            width: action.payload.width,
                            height: action.payload.height
                        }
                    }
                }
            };
        case GRAPH_SELECTION_RECT_SET:
            return {
                ...state,
                selectionRect: {
                    top: action.payload.top,
                    left: action.payload.left,
                    bottom: action.payload.bottom,
                    right: action.payload.right
                }
            };
        case GRAPH_SELECTION_RECT_CLEAR:
            return {
                ...state,
                selectionRect: null
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
