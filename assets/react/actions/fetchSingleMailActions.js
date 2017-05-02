import * as cryptojs from "crypto-js";
import _ from 'lodash';
import eth from './../../../modules/ethereumService';
import mailer from './../../../modules/mailerService';
import crypto from './../../../modules/cryptoService';

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
  return (dispatch, getState) => {
    //Request the mails
    dispatch(request_mail());

    mailer.fetchSingleEmailThread(mailHash, getState().register.startingBlock, function(error, result) {
      let receiverIdentity = {
        privateKey: getState().register.privateKey
      };

      let encryptedEmails = result.emails;

      let decryptedEmails = encryptedEmails.map((item, i) => {
        if(item.toAddress == eth.getOwnerEthereumAddress()) {
          return {
            ...JSON.parse(crypto.decrypt(receiverIdentity, item.encryptedReceiverData)),
            attachments: decryptAttachments(receiverIdentity, encryptedEmails[i].attachments),
            ipfsHash: item.ipfsHash,
            transactionHash: item.transactionHash
          };
        } else {
          return {
            ...JSON.parse(cryptojs.AES.decrypt(
              item.encryptedSenderData,
              getState().register.privateKey).toString(cryptojs.enc.Utf8)),
            attachments: encryptedEmails[i].attachments,
            ipfsHash: item.ipfsHash,
            transactionHash: item.transactionHash
          };
        }


      });

      decryptedEmails = _.sortBy(decryptedEmails, function (item) {
        return new Date(item.time);
      });

      dispatch(receive_mail(decryptedEmails));
    });
  }
};

export const downloadAttachment = (attachment) => {
  let splitData = attachment.fileData.split(',');
  let fileType = splitData[0].substring(5).split(';')[0];
  let byteCharacters = atob(splitData[1]);

  let byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  let byteArray = new Uint8Array(byteNumbers);

  let blob = new Blob([byteArray], {type: fileType});
  let blobUrl = URL.createObjectURL(blob);
  let link = document.createElement("a");
  link.href = blobUrl;
  link.download = attachment.fileName;
  link.click();

  return {};
};

function decryptAttachments(identity, encryptedAttachments) {
  let decryptedAttachments = [];

  for(let i = 0; i < encryptedAttachments.length; i++) {
    let attachment = JSON.parse(crypto.decrypt(identity, encryptedAttachments[i]));
    decryptedAttachments.push(attachment);
  }

  return decryptedAttachments;
}