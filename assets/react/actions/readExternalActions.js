import * as cryptojs from "crypto-js";

import ipfs from './../../../modules/ipfsService';

export const request_unlock = () => {
  return {
    type: 'UNLOCK_REQUEST',
    isFetching: true
  }
};

export const unlock = (externalMail) => {
  return {
    type: 'UNLOCK_SUCCESS',
    isFetching: false,
    externalMail
  }
};

export const unlock_mail_error = (message) => {
  return {
    type: 'UNLOCK_ERROR',
    isFetching: false,
    message
  }
};

export const unlockMail = (ipfsHash) => {
  return dispatch => {
    //Request the mails
    dispatch(request_unlock());

    ipfs.fetch(ipfsHash, function(error, content, ipfsHash) {
        if(error) {
          dispatch(unlock_mail_error(error));
        } else {
          dispatch(unlock(JSON.parse(content)));
        }
    });
  }
};

export const decryptMail = (externalMail, answer) => {
  return dispatch =>{
    let decryptedEmail;
    try{
      decryptedEmail = cryptojs.AES.decrypt(
        externalMail.encryptedReceiverData,
        answer
      ).toString(cryptojs.enc.Utf8);
    } catch (e){
      console.log(e);
      dispatch(decrypt_mail_error("Mail decryption failed, check your answer"));
      return;
    }
    decryptedEmail = JSON.parse(decryptedEmail);
    decryptedEmail.attachments = externalMail.storedAttachments;
    dispatch(decrypt_mail_success(decryptedEmail, answer));

  };
};

export const decrypt_mail_success = (externalMail, answer) => {
  return {
    type: 'MAIL_DECRYPTED',
    externalMail,
    answer
  }
};

export const decrypt_mail_error = (message) => {
  return {
    type: 'MAIL_DECRYPT_ERROR',
    message
  }
};

export const open_guest_reply = () => {
  return {
    type: 'OPEN_GUEST_REPLY'
  }
};

export const hide_guest_reply = () => {
  return {
    type: 'HIDE_GUEST_REPLY'
  }
};