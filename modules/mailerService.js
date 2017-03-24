'use strict';

const ipfs = require('./ipfsService')

var mailerService = {
  sendEmail: function(emailData) {
    ipfs.store(JSON.stringify(emailData));

    console.log("IPFS stored data");
  }
};

module.exports = mailerService;