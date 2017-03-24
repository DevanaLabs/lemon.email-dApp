import { browserHistory } from 'react-router'
import { remove_compose_box } from './composeBoxActions';
import mailerService from './../../../modules/mailerService';

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

export const sendMail = (data, composeBoxIndex) => {
  return dispatch => {
    mailerService.sendEmail(data);

    // Dispatch the success action
    dispatch(send_success());
    dispatch(remove_compose_box(composeBoxIndex));
    browserHistory.push('/');
  }
};

