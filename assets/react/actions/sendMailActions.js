import { remove_compose_box } from './composeBoxActions';
import mailer from './../../../modules/mailerService';
import { showNotification, hideNotification } from './notificationsActions';

export const send_request = () => {
  return {
    type: 'SEND_REQUEST',
    isSending: true
  }
};

export const send_success = () => {
  return {
    type: 'SEND_SUCCESS',
    isSending: false
  }
};

export const send_error = (message) => {
  return {
    type: 'SEND_ERROR',
    isSending: false,
    message
  }
};

export const get_public_key = (publicKey) => {
  return {
    type: 'PUBLIC_KEY',
    publicKey
  }
};

export const showSpinner = () => {
  return dispatch => {
    dispatch(send_request());
  }
};

export const sendMail = (data, composeBoxIndex) => {
  return dispatch => {
    mailer.sendEmail(data, (error, result) => {
      if(error) {
          dispatch(send_error());
          return;
      }

      // Dispatch the success action
      dispatch(send_success());
      dispatch(remove_compose_box(composeBoxIndex));
      dispatch(showNotification('sentOk'));
      setTimeout(() => {
        dispatch(hideNotification('sentOk'));
      }, 5000);
    });
  }
};

