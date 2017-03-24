'use strict';

const _ = require('lodash'),
  sha3  = require('solidity-sha3'),
  bitcore = require('bitcore-lib');

if (typeof web3 !== 'undefined') {
  window.web3 = new Web3(web3.currentProvider);
} else {
  console.log('No web3? You should consider trying MetaMask!')
  window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

// Initialize Email contract
var contractAbi = [{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"username","type":"bytes32"},{"name":"publicKey","type":"string"}],"name":"registerUser","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"ipfsHash","type":"string"},{"name":"inReplyTo","type":"bytes32"},{"name":"inReplyToIpfsHash","type":"string"}],"name":"sendEmail","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"administrator","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"username","type":"bytes32"},{"indexed":false,"name":"publicKey","type":"string"}],"name":"BroadcastPublicKey","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"emailId","type":"bytes32"},{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"ipfsHash","type":"string"},{"indexed":true,"name":"inReplyToId","type":"bytes32"},{"indexed":false,"name":"inReplyToIpfsHash","type":"string"}],"name":"SendEmail","type":"event"}];
var contractAddress = '0xde72c0B70eF9c73D326CA82222b28C3dBd1f3e73';

var emailContract = web3.eth.contract(contractAbi).at(contractAddress);

// Public functions to be exported
var ethereumService = {
  // Create new Ethereum account for the user
  registerUser: function(username, callback) {
    web3.eth.sign(web3.eth.accounts[0], web3.sha3("0xdeadbeef"), function(error, result) {
      var privateKey = bitcore.PrivateKey.fromString(result.slice(2, 66));
      var publicKey = bitcore.PublicKey.fromPrivateKey(privateKey);

      var emailAddress = username + "@lemon.eth";

      emailContract.registerUser(emailAddress, publicKey.toString(), function(error, result) {
        if(error) {
          console.log("Registration error: " + error);
        } else {
          localStorage.setItem("privateKey", privateKey);
        }
      });

      callback(null, "Cool");

      // var broadcastPublicKeyEvent = contract.BroadcastPublicKey({username: web3.fromAscii('test@lemon.eth')}, {fromBlock: 0, toBlock: 'latest'});
      //
      // broadcastPublicKeyEvent.watch(function(error, event) {
      //   console.log("Got public key " + JSON.stringify(event));
      //
      //   var sendEvent = contract.SendEmail({}, {fromBlock: 0, toBlock: 'latest'});
      //   sendEvent.watch(function(error, event) {
      //     console.log("Got incoming email " + JSON.stringify(event));
      //
      //     var dec = decrypt(testIdentity, enc);
      //
      //     console.log("Decrypted message: " + dec);
      //   });
      //
      //   var testIdentity= {
      //     type: 'ethereum',
      //     display: web3.eth.accounts[0],
      //     privateKey: privateKey,
      //     publicKey: publicKey,
      //     foreign: false
      //   };
      //
      //   var text = "0xdeadbeef";
      //
      //   var enc = encrypt(testIdentity, text);
      //
      //   console.log("Encrypted message: " + enc);
      //
      //   contract.sendEmail(1, enc, 0, "null", web3.eth.accounts[0], function(error, result) {
      //     console.log(error);
      //     console.log(result);
      //   });
    });
  },
  // Get emails for the given folder. Limit the number of emails by given batch size using given block number as the upper block limit
  getEmailsFolder: function(userId, folder, batchSize, startingBlock, upperBlockLimit, callback) {
    if (upperBlockLimit == 'null') {
      web3.eth.getBlockNumber(function(error, latestBlock) {
        findBatchOfEmails(folder, userId, batchSize, startingBlock, latestBlock, 128, {}, function(ipfsHashes, oldestEmailBlock) {
          var upperBlockLimit = oldestEmailBlock != null ? oldestEmailBlock - 1 : null;
          callback(ipfsHashes, upperBlockLimit, latestBlock, folder);
        });
      });
    }
    else {
      findBatchOfEmails(folder, userId, batchSize, startingBlock, upperBlockLimit, 128, {}, function(ipfsHashes, oldestEmailBlock) {
        var upperBlockLimit = oldestEmailBlock != null ? oldestEmailBlock - 1 : null;
        callback(ipfsHashes, upperBlockLimit, null, folder);
      });
    }
  },
  // Fetch replies for the email with given ID
  getEmailReplies: function(emailId, startingBlock, callback) {
    var replyEvent = emailContract.SendEmail({inReplyTo: emailId}, {fromBlock: startingBlock, toBlock: 'latest'});

    console.log("Getting replies for " + emailId);

    replyEvent.get(function(error, events) {
      var result = {};

      for (var i = 0; i < events.length; i++) {
        result[events[i].args.ipfsHash] = {blockNumber: events[i].blockNumber};
      }

      callback(result);
    });
  },
  // Fetch all emails
  getAllEmails: function(id, callback) {
    var sendEvent = emailContract.SendEmail({toId: id}, {fromBlock: 0, toBlock: 'latest'});

    sendEvent.get(function(error, events) {
      var result = {};
      for (var i = 0; i < events.length; i++) {
        var emailId = events[i].args.emailId;
        result[emailId] = {
          ipfsHash: events[i].args.ipfsHash,
          lastReplyBlock: events[i].blockNumber
        };
      }
      callback(result);
    });
  },
  // Listen for the incoming emails for the given address
  watchForIncomingEmails: function(toId, startBlock, callback) {
    var sendEvent = emailContract.SendEmail({toId: toId}, {fromBlock: startBlock, toBlock: 'latest'});
    console.log("Watching from block: " + startBlock);
    sendEvent.watch(function(error, event) {
      console.log("Got incoming email " + JSON.stringify(event));
      callback(toId, event);
    });

    return sendEvent;
  },
  // Emit new email contract event
  writeEmail: function(toId, ipfsHash, inReplyToIpfsHash, callback) {
    console.log("Trying to call sendEmail with toId=" + toId + ", hash=" + ipfsHash + ", inReplyTo=" + inReplyToIpfsHash);

    if (inReplyToIpfsHash == 'undefined') {
      inReplyToIpfsHash = 'null';
    }

    var inReplyTo = inReplyToIpfsHash != 'null' ? sha3.default(inReplyToIpfsHash) : 0;

    emailContract.sendEmail(toId, ipfsHash, inReplyTo, inReplyToIpfsHash, function(error, result) {
      if (error) {
        console.log("Could not execute sendEmail() contract function!" + error);
        return callback("Could not execute sendEmail() contract function!" + error, null);
      }

      console.log("result: " + result)
      callback(null, result);
    });

  }
};

/* Recursive helper function that searches blockchain for either incoming or outgoing emails
 blockOffset is used to indicate how many blocks below upperBlockLimit should be searched and is doubled on each recursive call
 foundEmails is used to store emails found during previous iterations
 */
function findBatchOfEmails(type, id, batchSize, startingBlock, upperBlockLimit, blockOffset, foundEmails, callback) {
  var fromBlock = upperBlockLimit - blockOffset > startingBlock ? upperBlockLimit - blockOffset : startingBlock;

  console.log("Finding batch from " + fromBlock + " to " + upperBlockLimit);

  var sendEvent;
  if(type == 'inbox') {
    sendEvent = emailContract.SendEmail({toId: id}, {fromBlock: fromBlock, toBlock: upperBlockLimit});
  } else if(type == 'sent') {
    sendEvent = emailContract.SendEmail({fromId: id}, {fromBlock: fromBlock, toBlock: upperBlockLimit});
  }

  sendEvent.get(function(error, events) {
    // We need to keep track of the oldest block which is later as the upperBlockLimit
    var oldestEmailBlock = null;

    // Reverse events, so that latest emails are at the front
    events.reverse();

    for(var i = 0; i < events.length; i++) {
      var emailId = events[i].args.emailId;
      var inReplyTo = events[i].args.inReplyTo;

      // Check if this email is reply to any other emails. If not, store it as a root email
      if(inReplyTo == 0) {
        foundEmails[emailId] = { ipfsHash: events[i].args.ipfsHash, lastReplyBlock: events[i].blockNumber };

        // Update oldest email block if needed
        if(oldestEmailBlock == null || events[i].blockNumber < oldestEmailBlock) {
          oldestEmailBlock = events[i].blockNumber;
        }
      } else {
        if(foundEmails[inReplyTo] !== undefined && events[i].blockNumber > foundEmails[inReplyTo].lastReplyBlock) {
          foundEmails[inReplyTo].lastReplyBlock = events[i].blockNumber;
        }
      }

      // Found enough root emails, we are done
      if(_.size(foundEmails) == batchSize) {
        break;
      }
    }

    // We also need to display thread for every sent email that has replies
    // Iterate again to find replies that aren't displayed and add those threads to root emails
    for(var i = 0; i < events.length; i++) {
      var inReplyTo = events[i].args.inReplyTo;

      if (inReplyTo != 0 && foundEmails[inReplyTo] == undefined) {
        foundEmails[inReplyTo] = { ipfsHash: events[i].args.inReplyToHash, lastReplyBlock: events[i].blockNumber, isReply: true };
      }
    }

    // Not enough root emails found, keep looking if possible
    if(_.size(foundEmails) < batchSize && fromBlock > startingBlock) {
      findBatchOfEmails(type, id, batchSize, startingBlock, upperBlockLimit - blockOffset, blockOffset * 2, foundEmails, callback);
    } else {
      // We have reached the end of the blockchain, return emails found so far
      callback( foundEmails, oldestEmailBlock);
    }
  });
}

module.exports = ethereumService;