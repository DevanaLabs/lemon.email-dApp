import { browserHistory } from 'react-router';
import eth from './../../../modules/ethereumService';

export const register_request = () => {
  return {
    type: "REGISTER_REQUEST",
    isFetching: true
  }
};

export const register_success = () => {
  return {
    type: "REGISTER_SUCCESS",
    isFetching: false
  }
};

export const register_error = (message) => {
  return {
    type: "REGISTER_ERROR",
    isFetching: false,
    message
  }
};

export const registerUser = (username) => {
  return dispatch => {
    eth.registerUser(username, (error, result) => {
      dispatch(register_success());
      browserHistory.push('/');
    });
  }
};