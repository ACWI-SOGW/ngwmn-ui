const MOUNT_POINT = 'components/well-log';
const SELECTED_CONSTRUCTION_ITEM_SET = `${MOUNT_POINT}/SELECTED_CONSTRUCTION_ITEM_SET`;
const VISIBLE_CONSTRUCTION_ITEMS_SET = `${MOUNT_POINT}/VISIBLE_CONSTRUCTION_ITEMS_SET`;


/**
 * Action creator to set the selected construction item index
 * @param {Date} date   Date of cursor
 */
export const setSelectedConstructionId = function (selectedConstructionId) {
    return {
        type: SELECTED_CONSTRUCTION_ITEM_SET,
        payload: {
            selectedConstructionId
        }
    };
};

/**
 * Action creator to set the visible construction item index list
 * @param {Date} date   Date of cursor
 */
export const setVisibleConstructionIds = function (visibleConstructionIds) {
    return {
        type: VISIBLE_CONSTRUCTION_ITEMS_SET,
        payload: {
            visibleConstructionIds
        }
    };
};

/**
 * Gets the index of the selected construction item.
 */
export const getSelectedConstructionId = function (state) {
    return state[MOUNT_POINT].selectedConstructionId;
};

/**
 * Gets the visible IDs, if set. Otherwise return all IDs.
 */
export const getVisibleConstructionIds = function (state) {
    return state[MOUNT_POINT].visibleConstructionIds;
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
                selectedConstructionId: action.payload.selectedConstructionId
            };
        case VISIBLE_CONSTRUCTION_ITEMS_SET:
            return {
                ...state,
                visibleConstructionIds: action.payload.visibleConstructionIds
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
