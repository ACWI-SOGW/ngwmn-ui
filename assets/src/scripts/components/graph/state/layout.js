const MOUNT_POINT = 'components/graph/layout';
const GRAPH_LAYOUT_SET = `${MOUNT_POINT}/GRAPH_LAYOUT_SET`;
const DEFAULT_LAYOUT = {
    width: 0,
    height: 0
};

export const setLayout = function (layout) {
    return {
        type: GRAPH_LAYOUT_SET,
        payload: {
            layout
        }
    };
};

export const getLayout = state => state[MOUNT_POINT].layout || DEFAULT_LAYOUT;

export const reducer = function (state = {}, action) {
    switch (action.type) {
        case GRAPH_LAYOUT_SET:
            return {
                ...state,
                layout: {
                    ...state.options,
                    ...action.payload.layout
                }
            };
        default:
            return state;
    }
};

export default {
    [MOUNT_POINT]: reducer
};
