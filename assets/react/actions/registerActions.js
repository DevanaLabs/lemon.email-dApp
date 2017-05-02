import eth from './../../../modules/ethereumService';

export const register_request = () => {
  return {
    type: "REGISTER_REQUEST",
    isFetching: true
  }
};

export const register_success = (privateKey, emailAddress, startingBlock) => {
  return {
    type: "REGISTER_SUCCESS",
    isFetching: false,
    privateKey,
    emailAddress,
    startingBlock
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
    dispatch(register_request());

    eth.registerUser(username, (error, result) => {
      if(error) {
        dispatch(register_error("Unable to register new account, the chosen username is probably already in use."));
      }

      if(!error) {
        dispatch(register_success(result.privateKey, result.emailAddress, result.startingBlock));
        window.location.hash = "/mail";
      }
    });
  }
};