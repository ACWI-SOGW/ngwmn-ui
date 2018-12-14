import memoize from 'fast-memoize';


const MOUNT_POINT = 'components/well-log/lithology';
const SELECTED_LITHOLOGY_ITEM_SET = `${MOUNT_POINT}/SELECTED_LITHOLOGY_ITEM_SET`;
const VISIBLE_LITHOLOGY_ITEMS_SET = `${MOUNT_POINT}/VISIBLE_LITHOLOGY_ITEMS_SET`;


/**
 * Action creator to set the selected construction item index, key on siteKey.
 * @param {Object} siteKey                 Site ID
 * @param {Object} selectedLithologyId Construction ID
 */
export const setSelectedLithologyId = function (siteKey, selectedLithologyId) {
    return {
        type: SELECTED_LITHOLOGY_ITEM_SET,
        payload: {
            siteKey,
            selectedConstructionId: selectedLithologyId
        }
    };
};

/**
 * Action creator to set the selected construction item index, key on siteKey.
 * @param {Object} siteKey                 Site ID
 * @param {Object} visibleLithologyIds Currently visible IDs
 */
export const setVisibleLithologyIds = function (siteKey, visibleLithologyIds) {
    return {
        type: VISIBLE_LITHOLOGY_ITEMS_SET,
        payload: {
            siteKey,
            visibleConstructionIds: visibleLithologyIds
        }
    };
};

/**
 * Gets the index of the selected construction item.
 */
export const getSelectedLithologyId = memoize(siteKey => state => {
    const selectedLithologyIds = state[MOUNT_POINT].selectedLithologyIds || {};
    return selectedLithologyIds[siteKey];
});

/**
 * Gets the visible IDs, if set.
 */
export const getVisibleLithologyIds = memoize(siteKey => state => {
    const visibleLithologyIds = state[MOUNT_POINT].visibleLithologyIds || {};
    return visibleLithologyIds[siteKey];
});

/**
 * Well log reducer
 * @param  {Object} state  Redux state
 * @param  {Object} action Action object
 * @return {Object}        New state
 */
export const reducer = function (state = {}, action) {
    switch (action.type) {
        case SELECTED_LITHOLOGY_ITEM_SET:
            return {
                ...state,
                selectedLithologyIds: {
                    ...state.selectedLithologyIds,
                    ...{[action.payload.siteKey]: action.payload.selectedLithologyId}
                }
            };
        case VISIBLE_LITHOLOGY_ITEMS_SET:
            return {
                ...state,
                visibleLithologyIds: {
                    ...state.visibleLithologyIds,
                    ...{[action.payload.siteKey]: action.payload.visibleLithologyIds}
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
