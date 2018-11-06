const MOUNT_POINT = 'components/well-log';
const SELECTED_CONSTRUCTION_ITEM_SET = `${MOUNT_POINT}/SELECTED_CONSTRUCTION_ITEM_SET`;
const VISIBLE_CONSTRUCTION_ITEMS_SET = `${MOUNT_POINT}/VISIBLE_CONSTRUCTION_ITEMS_SET`;


/**
 * Action creator to set the selected construction item index
 * @param {Date} date   Date of cursor
 */
export const setSelectedConstructionIndex = function (selectedConstructionIndex) {
    return {
        type: SELECTED_CONSTRUCTION_ITEM_SET,
        payload: {
            selectedConstructionIndex
        }
    };
};

/**
 * Action creator to set the visible construction item index list
 * @param {Date} date   Date of cursor
 */
export const setVisibleConstructionIndices = function (visibleConstructionIndices) {
    return {
        type: VISIBLE_CONSTRUCTION_ITEMS_SET,
        payload: {
            visibleConstructionIndices
        }
    };
};

/**
 * Gets the index of the selected construction item.
 */
export const getSelectedConstructionIndex = function (state) {
    return state[MOUNT_POINT].selectedConstructionIndex;
};

/**
 * Gets the visible indices, if set. Otherwise return all indices.
 */
export const getVisibleConstructionIndices = function (state) {
    return state[MOUNT_POINT].visibleConstructionIndices;
};

/**
 * Well log reducer
 * @param  {Object} state  Redux state
 * @param  {Object} action Action object
 * @return {Object}        New state
 */
export const reducer = function (state = {}, action) {
    switch (action.type) {
        case SELECTED_CONSTRUCTION_ITEM_SET:
            return {
                ...state,
                selectedConstructionIndex: action.payload.selectedConstructionIndex
            };
        case VISIBLE_CONSTRUCTION_ITEMS_SET:
            return {
                ...state,
                visibleConstructionIndices: action.payload.visibleConstructionIndices
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
