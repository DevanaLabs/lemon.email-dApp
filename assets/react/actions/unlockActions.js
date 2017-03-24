import { browserHistory } from 'react-router'
import { getCookieValue } from './cookieActions';
import * as openpgp from 'openpgp';


export const unlock_request = () => {
    return {
        type: "UNLOCK_REQUEST",
        isFetching: true
    }
};

export const unlock_error = (message) => {
    return {
        type: "UNLOCK_ERROR",
        isFetching: false,
        message
    }
};

export const unlock_success = () => {
    return {
        type: "UNLOCK_SUCCESS",
        isFetching: false,
    }
};


export const checkPassphrase = (passphrase) => {
    let config = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookieValue("jwt_token")
        }
    };

    return dispatch => {
        dispatch(unlock_request());
        return fetch('/api/getPrivateKey',config)
            .then(response => response.json()
            .then(data => ({ data, response })))
            .then(({ data, response }) =>  {
                if(!response.ok){
                    //handle err
                }

                let privKey = openpgp.key.readArmored(data.privateKey).keys[0];
                if (!privKey.decrypt(passphrase)) {
                    dispatch(unlock_error("Wrong passphrase."));
                    return;
                }

                dispatch(unlock_success());
                sessionStorage.setItem("privateKey", data.privateKey);
                sessionStorage.setItem("passphrase", passphrase);
                browserHistory.push('/');

            }).catch(err => console.log("Error: ", err))
    }
};



