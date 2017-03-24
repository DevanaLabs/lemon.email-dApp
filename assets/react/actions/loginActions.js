import { browserHistory } from 'react-router'
import { getCookieValue } from './cookieActions';

export const login_request = (creds) => {
    return {
        type: 'LOGIN_REQUEST',
        isAuthenticated: false,
        isFetching: true,
        creds
    }
};

export const login_success = () => {
    return {
        type: 'LOGIN_SUCCESS',
        isAuthenticated: true,
        isFetching: false
    }
};

export const login_error = (message) => {
    return {
        type: 'LOGIN_ERROR',
        isAuthenticated: false,
        isFetching: false,
        message
    }
};

export const logout_success = () => {
    return {
        type: 'LOGOUT_SUCCESS'
    }
};


export const logoutUser = () => {
    localStorage.removeItem("id_token");
    localStorage.removeItem("from");
    localStorage.removeItem("eth_addr");
    sessionStorage.removeItem("passphrase");
    return dispatch => {
        dispatch(logout_success());
        document.location = "https://lemon.email/auth/logout";
    }
};

export const loginUser = (creds) => {
    let config = {
        method: 'POST',
        headers: {
            'Content-Type':'application/x-www-form-urlencoded'
        },
        //body: window.btoa(`username=${creds.username}&password=${creds.password}`)
        body: 'username='+creds.username+"&password="+creds.password
    };

    return dispatch => {
        //Request the login
        dispatch(login_request(creds));

        return fetch('/login',config)
               .then(response => response.json()
               .then(user => ({ user, response })))
               .then(({ user, response }) =>  {
                   if (!response.ok) {
                       // If there was a problem, we want to
                       // dispatch the error condition
                       dispatch(login_error(user.message));
                   } else {
                       // If login was successful, set the token in local storage
                       localStorage.setItem('id_token', user.id_token);
                       localStorage.setItem('from', user.email);
                       localStorage.setItem('eth_addr', user.ethAddr);
                       // Dispatch the success action
                       dispatch(login_success(user));
                       browserHistory.push('/');
                   }
            }).catch(err => dispatch(login_error("Could not login.")));
    }
};

export const toggleUser = (isLowBalance) => {
    return {
        type: 'TOGGLE_USER',
        isLowBalance
    }
};

export const checkLogin = () => {
    let config = {
        method: 'POST',
        headers: {
            'Content-Type':'application/x-www-form-urlencoded'
        },
        body: 'token='+getCookieValue("jwt_token")
    };

    return dispatch => {
        return fetch('/checkToken',config)
            .then(response => response.json()
            .then(data => ({ data, response })))
            .then(({ data, response }) =>  {
                if(!response.ok){
                    dispatch(logoutUser());
                }
                dispatch(toggleUser(data.isLowBalance));
                localStorage.setItem('from', data.userData.username);
                localStorage.setItem('eth_addr', data.userData.ethAddr);
            }).catch(err => console.log("Error: ", err))
    }
};



