
const MOUNT_POINT = 'components/median-water-level-table';
const TABLE_RENDERED = `${MOUNT_POINT}/TABLE_RENDERED`;

export const setTableWasExpanded = function() {
    return {
        type: TABLE_RENDERED,
        payload: {}
    };
};

export const isTableRendered = state => {
    return state[MOUNT_POINT].isRendered || false;
};


const reducer = function(state = {}, action) {
    switch (action.type) {
        case TABLE_RENDERED:
            return {
                ...state,
                isRendered: true
            };
        default:
            return state;
    }
};

export default {
    [MOUNT_POINT]: reducer
};