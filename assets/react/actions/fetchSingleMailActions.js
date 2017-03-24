import { getCookieValue } from './cookieActions';
import { browserHistory } from 'react-router'
import * as openpgp from 'openpgp';
import * as cryptojs from "crypto-js";

export const request_mail = () => {
  return {
    type: 'MAIL_REQUEST',
    isFetching: true
  }
};

export const receive_mail = (mail) => {
  return {
    type: 'MAIL_SUCCESS',
    isFetching: false,
    mail
  }
};

export const receive_mail_error = (message) => {
  return {
    type: 'MAIL_ERROR',
    isFetching: false,
    message
  }
};

export const fetchMail = (mailType, mailHash) => {
  let config = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + getCookieValue("jwt_token"),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  return dispatch => {
    //Request the mails
    dispatch(request_mail());

    return fetch('/api/' + mailType + '/email/' + mailHash, config)
      .then(response => response.json()
        .then(mail => ({mail, response})))
      .then(({mail, response}) => {
        if (!response.ok) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(receive_mail_error(mail.message));
        } else {

          // Dispatch the success action
          let { emails } = mail;
          let privKey = openpgp.key.readArmored(sessionStorage.getItem("privateKey")).keys[0];
          if (mailType == "inbox") {
            if (privKey.decrypt(sessionStorage.getItem("passphrase"))) {
              let promises = emails.map((email) => email.encryptedReceiverData ? openpgp.decrypt({
                  privateKey: privKey,
                  message: openpgp.message.readArmored(email.encryptedReceiverData)
                }) : new Promise(function (resolve, reject) {
                  resolve({ data : cryptojs.AES.decrypt(
                    email.encryptedSenderData,
                    sessionStorage.getItem("passphrase")
                  ).toString(cryptojs.enc.Utf8) });
                })
              );

              Promise.all(promises)
                .then((data) => {
                  data = data.map((item, i) => {
                    return {
                      ...JSON.parse(item.data),
                      attachments: emails[i].storedAttachments,
                      privKey: privKey
                    };
                  });
                  dispatch(receive_mail(data));
                });
            } else {
              dispatch(receive_mail_error("Could not unlock privateKey. Wrong passphrase."));
              sessionStorage.removeItem("passphrase");
              sessionStorage.removeItem("privateKey");
              browserHistory.push("/unlock?error=Wrong passphrase");
            }
          }
          if (mailType == "sent") {
            try {
              if (privKey.decrypt(sessionStorage.getItem("passphrase"))) {
                let promises = emails.map((email) => email.encryptedReceiverData ? openpgp.decrypt({
                    privateKey: privKey,
                    message: openpgp.message.readArmored(email.encryptedReceiverData)
                  }) : new Promise(function (resolve, reject) {
                    resolve({ data : cryptojs.AES.decrypt(
                      email.encryptedSenderData,
                      sessionStorage.getItem("passphrase")
                    ).toString(cryptojs.enc.Utf8) });
                  })
                );

                Promise.all(promises)
                  .then((data) => {
                    data = data.map((item, i) => {
                      return {
                        ...JSON.parse(item.data),
                        attachments: emails[i].storedAttachments,
                        privKey: privKey
                      };
                    });
                    dispatch(receive_mail(data));
                  });
              } else {
                dispatch(receive_mail_error("Could not unlock privateKey. Wrong passphrase."));
                sessionStorage.removeItem("passphrase");
                sessionStorage.removeItem("privateKey");
                browserHistory.push("/unlock?error=Wrong passphrase");
              }
            } catch (e) {
              console.log(e);
              dispatch(receive_mail_error("Mail decryption failed, check your answer"));
              sessionStorage.removeItem("passphrase");
              sessionStorage.removeItem("privateKey");
              browserHistory.push("/unlock?error=Wrong passphrase");
              return;
            }
          }
        }
      }).catch(err => dispatch(receive_mail_error(err)))
  }
};

export const decryptAttachment = (ipfsHash, privKey, answer) => {
  return dispatch => {
    fetch('/api/getAttachment/' + ipfsHash)
      .then(response => response.json()
        .then(data => ({data, response})))
      .then(({data, response}) => {
        if (typeof answer === "string") {
          let decryptedFile;

          try {
            decryptedFile = cryptojs.AES.decrypt(
              data.file,
              answer
            ).toString(cryptojs.enc.Utf8);
          } catch (e) {
            console.log(e);
            return false;
          }
          downloadFile(decryptedFile);
          return;
        }


        openpgp.decrypt({
          privateKey: privKey,
          message: openpgp.message.readArmored(data.file)
        })
          .then(function (data) {
            downloadFile(data.data)
          });
      });
  }
};

function downloadFile(data) {
  let fileData = data.split(',');
  let fileName = fileData[0];
  let fileType = fileData[1].substring(5).split(';')[0];
  let byteCharacters = atob(fileData[2]);

  let byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  let byteArray = new Uint8Array(byteNumbers);

  let blob = new Blob([byteArray], {type: fileType});
  let blobUrl = URL.createObjectURL(blob);
  let link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;
  link.click();
}