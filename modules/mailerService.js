'use strict';

const ipfs = require('./ipfsService'),
  eth = require('./ethereumService'),
  sha3  = require('solidity-sha3');

var backupIpfsNodes = ['https://earth.i.ipfs.io/ipfs/', 'https://ipfs.io/ipfs/', 'https://ipfsdapp.lemon.email/ipfs/'];

var mailerService = {
  sendEmail: function(emailData, callback) {
    ipfs.store(JSON.stringify(emailData), function(error, ipfsHash) {
      eth.writeEmail(emailData.toAddress, ipfsHash, emailData.inReplyTo, function(error, result) {
        // Request newly stored data from bootstrap IPFS nodes
        for(var i = 0; i < backupIpfsNodes.length; i++) {
          makeHttpRequest(backupIpfsNodes[i] + ipfsHash);
        }

        callback(error, result);
      });
    });
  },
  fetchSingleEmailThread: function(ipfsHash, startingBlock, callback) {
    ipfs.fetch(ipfsHash, function(error, content, ipfsHash) {
      var response = { emails: [JSON.parse(content)] };

      var originalReceiverAddress = response.emails[0].toAddress;

      eth.getEmailReplies(sha3.default(ipfsHash), originalReceiverAddress, startingBlock, function (replies) {
        if (replies.length == 0) {
          callback(null, response);
          return;
        }

        var ipfsToEthereumHash = [];

        for (var i = 0; i < replies.length; i++) {
          ipfsToEthereumHash[replies[i].ipfsHash] = replies[i].transactionHash;

          ipfs.fetch(replies[i].ipfsHash, function (error, content, hash) {
            var replyEmail = JSON.parse(content);
            replyEmail.ipfsHash = hash;
            replyEmail.transactionHash = ipfsToEthereumHash[hash];

            response.emails.push(replyEmail);

            if (response.emails.length == replies.length + 1) {
              callback(null, response);
            }
          });
        }
      })
    });
  },
  startInboxListener: function(startingBlock, callback) {
    console.log("Starting inbox listener");

    eth.watchForIncomingEmails(startingBlock, function(event) {
      var isReply = event.args.inReplyToIpfsHash != 'null';

      var ipfsHash = isReply ? event.args.inReplyToIpfsHash : event.args.ipfsHash;

      ipfs.fetch(ipfsHash, function (error, content, hash) {
        var mailData = JSON.parse(content);

        mailData.fromAddress = event.args.from;
        mailData.ipfsHash = hash;
        mailData.transactionHash = event.transactionHash;
        mailData.isReply = event.args.inReplyToIpfsHash != 'null';
        mailData.inReplyTo = event.args.inReplyToIpfsHash;

        callback(mailData);
      });
    });
  }
};

function makeHttpRequest(url) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
}

module.exports = mailerService;