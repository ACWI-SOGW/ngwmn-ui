const MOUNT_POINT = 'components/graph/layout';
const GRAPH_LAYOUT_SET = `${MOUNT_POINT}/GRAPH_LAYOUT_SET`;


/**
 * Sets the graph size to a given (width, height)
 * @param {Number} options.width  Width of graph container
 * @param {Number} options.height Height of graph container
 */
export const setLayout = function ({width, height}) {
    return {
        type: GRAPH_LAYOUT_SET,
        payload: {
            layout: {
                width,
                height
            }
        }
    };
};

/**
 * Selector to return the current container layout
 * @param  {Object} state Redux state
 * @return {Object}       Layout
 */
export const getLayout = state => state[MOUNT_POINT];

/**
 * Layout reducer
 * @param  {Object} state  Redux state
 * @param  {Object} action Action object
 * @return {Object}        New state
 */
export const reducer = function (state = {}, action) {
    switch (action.type) {
        case GRAPH_LAYOUT_SET:
            return {
                ...state,
                ...action.payload.layout
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
