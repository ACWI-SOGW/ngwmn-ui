const MOUNT_POINT = 'components/graph/cursor';
const CURSOR_SET = `${MOUNT_POINT}/CURSOR_SET`;

export const setCursor = function (date) {
    console.log(date, new Date(date));
    return {
        type: CURSOR_SET,
        payload: {
            date
        }
    };
};

export const getCursor = state => state[MOUNT_POINT].date;

export const reducer = function (state = {}, action) {
    switch (action.type) {
        case CURSOR_SET:
            return {
                ...state,
                date: action.payload.date
            };
        default:
            return state;
    }
};

export default {
    [MOUNT_POINT]: reducer
};
