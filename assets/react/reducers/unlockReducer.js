const unlock = (state = { isFetching: false, errorMessage: "" }, action) => {
    switch (action.type){
        case 'UNLOCK_REQUEST':
            return {
                ...state,
                isFetching: true
            };
        case 'UNLOCK_SUCCESS':
            return {
                ...state,
                isFetching: false
            };
        case 'UNLOCK_ERROR':
            return {
                ...state,
                isFetching: false,
                errorMessage: action.message
            };
        default:
            return state;
    }
};

export default unlock;