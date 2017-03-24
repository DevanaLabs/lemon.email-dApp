import { getCookieValue } from '../actions/cookieActions';

const login = (state = {
                isAuthenticated: !!getCookieValue("jwt_token"),
                isLowBalance: false
                }, action) => {
    switch (action.type){
        case 'LOGIN_REQUEST':
            return {
                ...state,
                isAuthenticated: false,
                isFetching: true,
                user: action.creds
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                isFetching: false,
                errorMessage: ''
            };
        case 'LOGIN_ERROR':
            return {
                ...state,
                isAuthenticated: false,
                isFetching: false,
                errorMessage: action.message
            };
        case 'LOGOUT_SUCCESS':
            return {
                ...state,
                isAuthenticated: false
            };
        case 'TOGGLE_USER':
            return {
                ...state,
                isLowBalance: action.isLowBalance,
            };
        default:
            return state;
    }
};

export default login;