const register = (state = { isFetching: false, errorMessage: "" }, action) => {
    switch (action.type){
        case 'REGISTER_REQUEST':
            return {
                ...state,
                isFetching: true
            };
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                isFetching: false
            };
        case 'REGISTER_ERROR':
            return {
                ...state,
                isFetching: false,
                errorMessage: action.message
            };
        default:
            return state;
    }
};

export default register;