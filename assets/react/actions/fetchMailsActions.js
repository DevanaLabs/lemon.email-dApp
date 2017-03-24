import { paginate } from './paginationActions';
import { getCookieValue } from './cookieActions';
import 'whatwg-fetch';

export const new_mail = (mail) => {
  return {
    type: 'NEW_MAIL',
    mail
  }
};

export const request_mails = (currPage) => {
  return {
    type: 'MAILS_REQUEST',
    isFetching: true,
    currPage
  }
};

export const receive_mails = (mails, upperBlockLimit) => {
  return {
    type: 'MAILS_SUCCESS',
    isFetching: false,
    mails,
    upperBlockLimit
  }
};

export const receive_mails_error = (message) => {
  return {
    type: 'MAILS_ERROR',
    isFetching: false,
    message
  }
};

export const fetchMails = (mailType, upperBlockLimit, prevUpperBlockLimit, direction) => {
let config = {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + getCookieValue("jwt_token"),
    'Content-Type':'application/x-www-form-urlencoded'
  }
};

return dispatch => {
  //Request the mails
  dispatch(request_mails(direction));

  const supportedMailTypes = ["inbox", "sent"];
  if(supportedMailTypes.indexOf(mailType) === -1) dispatch(receive_mails_error("This folder does not exist!"));

  let blockLimit = direction === 1 ? upperBlockLimit : prevUpperBlockLimit;

  return fetch('/api/'+mailType+'/'+blockLimit,config)
    .then(response => response.json()
    .then(data => ({ data , response })))
    .then(({ data, response }) =>  {
      if (!response.ok) {
        // If there was a problem, we want to
        // dispatch the error condition
        dispatch(receive_mails_error("Could not get mails."));
      } else {
        paginate(direction, data.upperBlockLimit, dispatch);
        dispatch(receive_mails(data.emails,data.upperBlockLimit));
      }
    }).catch(err => dispatch(receive_mails_error(err)));
}
};