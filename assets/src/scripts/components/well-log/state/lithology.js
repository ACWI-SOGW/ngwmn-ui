import memoize from 'fast-memoize';


const MOUNT_POINT = 'components/well-log/lithology';
const SELECTED_LITHOLOGY_ITEM_SET = `${MOUNT_POINT}/SELECTED_LITHOLOGY_ITEM_SET`;


/**
 * Action creator to set the selected lithology item index, key on siteKey.
 * @param {Object} siteKey                 Site ID
 * @param {Object} selectedLithologyId Lithology ID
 */
export const setSelectedLithologyId = function (siteKey, selectedLithologyId) {
    return {
        type: SELECTED_LITHOLOGY_ITEM_SET,
        payload: {
            siteKey,
            selectedLithologyId
        }
    };
};


/**
 * Gets the index of the selected lithology item.
 */
export const getSelectedLithologyId = memoize(siteKey => state => {
    const selectedLithologyIds = state[MOUNT_POINT].selectedLithologyIds || {};
    return selectedLithologyIds[siteKey];
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
