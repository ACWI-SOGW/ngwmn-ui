const MOUNT_POINT = 'components/graph/options';
const GRAPH_OPTIONS_SET = `${MOUNT_POINT}/GRAPH_OPTIONS_SET`;


/**
 * Action creator to set current options for the graph.
 * @param {Object} options Graph options object
 */
export const setOptions = function (options) {
    return {
        type: GRAPH_OPTIONS_SET,
        payload: {
            options
        }
    };
};

/**
 * Selector to return current graph options.
 * @param  {Object} state Redux state
 * @return {Object}       Graph options object
 */
export const getOptions = state => state[MOUNT_POINT];

const reducer = function (state = {}, action) {
    switch (action.type) {
        case GRAPH_OPTIONS_SET:
            return {
                ...state,
                ...action.payload.options
            };
        default:
            return state;
    }
};

export default {
    [MOUNT_POINT]: reducer
};
