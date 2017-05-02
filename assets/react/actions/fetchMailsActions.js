import { paginate } from './paginationActions';
import _ from 'lodash';
import eth from './../../../modules/ethereumService';
import ipfs from './../../../modules/ipfsService';
import mailer from './../../../modules/mailerService';
import crypto from './../../../modules/cryptoService';
import * as cryptojs from "crypto-js";
import * as sha3 from 'solidity-sha3';
import 'whatwg-fetch';

export const new_mail = (mail, privateKey) => {
  decryptAndProcessEmail(mail, privateKey, 'inbox');

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

export const mail_clicked = (transactionHash) => {
  return {
    type: 'MAIL_OPENED',
    transactionHash
  }
};

export const receive_mails_error = (message) => {
  return {
    type: 'MAILS_ERROR',
    isFetching: false,
    message
  }
};

export const decryptAndProcessEmail = (mail, privateKey) => {
  let decryptedData;

  if(mail.toAddress == eth.getOwnerEthereumAddress()) {

    let receiverIdentity = {
      privateKey: privateKey
    };

    decryptedData = JSON.parse(crypto.decrypt(receiverIdentity, mail.encryptedReceiverData));
  } else {
    if(!mail.encryptedSenderData) {
      decryptedData = {subject: "Missing data"};
    } else {
      decryptedData = JSON.parse(cryptojs.AES.decrypt(mail.encryptedSenderData, privateKey).toString(cryptojs.enc.Utf8));
    }
  }

  Object.assign(mail, decryptedData);

  if(mail.isReply) {
    mail.subject = "Re: " + mail.subject;
  }
};

export const fetchMails = (mailType, upperBlockLimit, prevUpperBlockLimit, direction) => {
  return (dispatch, getState)  => {
    //Request the mails
    dispatch(request_mails(direction));

    const supportedMailTypes = ["inbox", "sent"];
    if(supportedMailTypes.indexOf(mailType) === -1) dispatch(receive_mails_error("This folder does not exist!"));
    let blockLimit = getState().register.startingBlock;
    let ipfsToEthereumHash = [];

    eth.getEmailsFolder(mailType, 10, blockLimit, null, function (responseData, oldestEmailBlock, latestEmailBlock, folder) {
      if (_.isEmpty(responseData)) {
        if (mailType == 'inbox') {
          mailer.startInboxListener(getState().register.startingBlock, function (mailData) {
            dispatch(new_mail(mailData, getState().register.privateKey));
          });
        }

        paginate(direction, 0, dispatch);
        dispatch(receive_mails([], 0));

        return;
      }

      var data = {
        emails: [],
        upperBlockLimit: oldestEmailBlock
      };

      ipfs.safeInit(function () {
        // Iterate trough emails, parse and retrieve from IPFS using hash
        for (let emailId in responseData) {
          ipfsToEthereumHash[responseData[emailId].ipfsHash] = responseData[emailId].transactionHash;

          // Retrieving from IPFS here
          ipfs.fetch(responseData[emailId].ipfsHash, function (error, content, hash) {
            if (error) {
              console.log("Error: " + error);
              return;
            }

            let mail = JSON.parse(content);

            mail.ipfsHash = hash;
            mail.transactionHash = ipfsToEthereumHash[hash];

            decryptAndProcessEmail(mail, getState().register.privateKey);

            // We have to slightly modify reply emails
            if (responseData[sha3.default(hash)].isReply) {
              let temp = mail.from;
              mail.from = mail.to;
              mail.to = temp;
            }

            data.emails.push(mail);

            // Stop when we hit last email in responseData
            if (data.emails.length == _.size(responseData)) {

              if (latestEmailBlock !== null && folder === 'inbox' && upperBlockLimit == null) {
                mailer.startInboxListener(latestEmailBlock + 1, function (mailData) {
                  dispatch(new_mail(mailData, getState().register.privateKey));
                });
              }

              // Sort emails in the response
              data.emails = _.sortBy(data.emails, function (item) {
                return responseData[sha3.default(item.ipfsHash)] != undefined ?
                  responseData[sha3.default(item.ipfsHash)].lastReplyBlock : responseData[sha3.default(item.inReplyTo)].lastReplyBlock;
              }).reverse();

              paginate(direction, data.upperBlockLimit, dispatch);
              dispatch(receive_mails(data.emails, data.upperBlockLimit));
            }
          });
        }
      });
    });
  }
};