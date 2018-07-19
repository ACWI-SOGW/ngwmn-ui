import * as types from './types';


const servicesReducer = (state = {}, action) => {
    switch (action.type) {
        case types.WATER_LEVELS_SET:
            return {
                waterLevels: {
                    ...state.waterLevels,
                    [`${action.payload.agencyCode}:${action.payload.siteID}`]: action.payload.waterLevels
                }
            };
        default:
            return state;
    }
};


export default servicesReducer;
