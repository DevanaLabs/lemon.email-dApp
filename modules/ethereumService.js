'use strict';

const _ = require('lodash'),
  sha3  = require('solidity-sha3'),
  bitcore = require('bitcore-lib');

// Email contract info
var contractAbi = [{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"username","type":"bytes32"},{"name":"publicKey","type":"string"}],"name":"registerUser","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"ipfsHash","type":"string"},{"name":"inReplyTo","type":"bytes32"},{"name":"inReplyToIpfsHash","type":"string"}],"name":"sendEmail","outputs":[{"name":"result","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"administrator","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"username","type":"bytes32"},{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"publicKey","type":"string"}],"name":"BroadcastPublicKey","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"emailId","type":"bytes32"},{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"ipfsHash","type":"string"},{"indexed":true,"name":"inReplyToId","type":"bytes32"},{"indexed":false,"name":"inReplyToIpfsHash","type":"string"}],"name":"SendEmail","type":"event"}];
var contractAddress = '0x6154E4F9795387628C1a1D6A3FC0C79523D12A13';

// Public functions to be exported
var ethereumService = {
  initialize: function(callback) {
    if(window.web3 == undefined) {
      console.log("Metamask not detected");
      return callback(false);
    }

    window.web3.eth.getTransaction('0xcf5240b6ed8ff000f3f537ab16839ff4ead6dffa19a6a4a4850dcc34d24d4b99', function(error, result) {
      if(result == null) {
        console.log("Web3 error: " + error);
        return callback(false);
      } else {
        window.web3.emailContract = window.web3.eth.contract(contractAbi).at(contractAddress);
        callback(true);
      }
    });
  },
  // Get Ethereum address of the current user
  getOwnerEthereumAddress: function() {
    return web3.eth.accounts[0]
  },
  // Check if current MetaMask user has already registered an account
  checkIfUserExists: function(callback) {
    var broadcastPublicKeyEvent = window.web3.emailContract.BroadcastPublicKey({addr: web3.eth.accounts[0]}, {fromBlock: 0, toBlock: 'latest'});

    broadcastPublicKeyEvent.get(function(error, events) {
      if(!events.length) {
        return callback(null);
      } else {
        return callback({
          "emailAddress": web3.toAscii(events[0].args.username),
          "startingBlock" : events[0].blockNumber
        });
      };
    });
  },
  // Generate key pair
  generateKeyPair: function(userData, callback) {
    web3.eth.sign(web3.eth.accounts[0], "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef", function(error, result) {
      var privateKey = bitcore.PrivateKey.fromString(result.slice(2, 66));
      return callback(privateKey.toString());
    });
  },
// Create new Ethereum account for the user
  registerUser: function(username, callback) {
    web3.eth.sign(web3.eth.accounts[0], "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef", function(error, result) {
      var privateKey = bitcore.PrivateKey.fromString(result.slice(2, 66));
      var publicKey = bitcore.PublicKey.fromPrivateKey(privateKey);

      var emailAddress = username + "@lemonmail.eth";

      window.web3.emailContract.registerUser(emailAddress, publicKey.toString(), function(error, result) {
        if(error) {
          console.log("Registration error: " + error);
          callback(error, null);
        } else {
          web3.eth.getBlockNumber(function(error, latestBlock) {
            if(error) {
              return callback(error, null);
            }

            var userData = {
              "emailAddress": emailAddress,
              "privateKey" : privateKey.toString(),
              "startingBlock" : latestBlock
            };

            callback(null, userData);
          });
        }
      });
    });
  },
// Find public key belonging to the user with given email address
  getUsersPublicKey: function(email, callback) {
    var broadcastPublicKeyEvent = window.web3.emailContract.BroadcastPublicKey({username: web3.fromAscii(email)}, {fromBlock: 0, toBlock: 'latest'});

    broadcastPublicKeyEvent.get(function(error, events) {
      if(!events.length) {
        return callback("User not found", null);
      } else {
        var result = {
          'address' : events[0].args.addr,
          'publicKey' : events[0].args.publicKey
        };

        callback(null, result);
      }
    });
  },
// Get emails for the given folder. Limit the number of emails by given batch size using given block number as the upper block limit
  getEmailsFolder: function(folder, batchSize, startingBlock, upperBlockLimit, callback) {
    if (upperBlockLimit == null) {
      web3.eth.getBlockNumber(function(error, latestBlock) {
        findBatchOfEmails(folder, batchSize, startingBlock, latestBlock, 128, {}, function(emailsData, oldestEmailBlock) {
          var upperBlockLimit = oldestEmailBlock != null ? oldestEmailBlock - 1 : null;
          callback(emailsData, upperBlockLimit, latestBlock, folder);
        });
      });
    } else {
      findBatchOfEmails(folder, batchSize, startingBlock, upperBlockLimit, 128, {}, function(emailsData, oldestEmailBlock) {
        var upperBlockLimit = oldestEmailBlock != null ? oldestEmailBlock - 1 : null;
        callback(emailsData, upperBlockLimit, null, folder);
      });
    }
  },
// Fetch replies for the email with given ID
  getEmailReplies: function(emailId, correspondentAddress, startingBlock, callback) {
    var replyEvent = window.web3.emailContract.SendEmail({from: correspondentAddress, inReplyToId: emailId}, {fromBlock: startingBlock, toBlock: 'latest'});

    console.log("Getting replies for " + emailId);

    replyEvent.get(function(error, events) {
      var result = [];

      for (var i = 0; i < events.length; i++) {
        result.push({ ipfsHash: events[i].args.ipfsHash, transactionHash: events[i].transactionHash });
      }

      callback(result);
    });
  },
// Listen for the incoming emails for the given address
  watchForIncomingEmails: function(startBlock, callback) {
    var sendEvent = window.web3.emailContract.SendEmail({to: web3.eth.accounts[0]}, {fromBlock: startBlock, toBlock: 'latest'});

    console.log("Watching from block: " + startBlock);

    sendEvent.watch(function(error, event) {
      console.log("Got incoming email " + JSON.stringify(event));
      callback(event);
    });

    return sendEvent;
  },
// Emit new email contract event
  writeEmail: function(toAddress, ipfsHash, inReplyToIpfsHash, callback) {
    var inReplyTo = inReplyToIpfsHash != null ? sha3.default(inReplyToIpfsHash) : 0;
    inReplyToIpfsHash = inReplyToIpfsHash != null ? inReplyToIpfsHash : 'null';

    console.log("Trying to call sendEmail with toAddress=" + toAddress + ", hash=" + ipfsHash + ", inReplyTo=" + inReplyTo + ", inReplyToIpfsHash=" + inReplyToIpfsHash);

    window.web3.emailContract.sendEmail(toAddress, ipfsHash, inReplyTo, inReplyToIpfsHash, function(error, result) {
      if (error) {
        console.log("Could not execute sendEmail() contract function!" + error);
        return callback("Could not execute sendEmail() contract function!" + error, null);
      }

      console.log("sendEmail result is " + result);

      callback(null, result);
    });
  }
};

/* Recursive helper function that searches blockchain for either incoming or outgoing emails
 blockOffset is used to indicate how many blocks below upperBlockLimit should be searched and is doubled on each recursive call
 foundEmails is used to store emails found during previous iterations
 */
function findBatchOfEmails(type, batchSize, startingBlock, upperBlockLimit, blockOffset, foundEmails, callback) {
  var fromBlock = upperBlockLimit - blockOffset > startingBlock ? upperBlockLimit - blockOffset : startingBlock;

  console.log("Finding " + type + " batch from " + fromBlock + " to " + upperBlockLimit);

  var sendEvent;
  if(type == 'inbox') {
    sendEvent = window.web3.emailContract.SendEmail({to: web3.eth.accounts[0]}, {fromBlock: fromBlock, toBlock: upperBlockLimit});
  } else if(type == 'sent') {
    sendEvent = window.web3.emailContract.SendEmail({from: web3.eth.accounts[0]}, {fromBlock: fromBlock, toBlock: upperBlockLimit});
  }

  sendEvent.get(function(error, events) {
    // We need to keep track of the oldest block which is later as the upperBlockLimit
    var oldestEmailBlock = null;

    for(var i = 0; i < events.length; i++) {
      var emailId = events[i].args.emailId;
      var inReplyTo = events[i].args.inReplyToId;

      // Check if this email is reply to any other emails. If not, store it as a root email
      if(inReplyTo == 0) {
        if(foundEmails[emailId] == undefined) {
          foundEmails[emailId] = {
            fromAddress: events[i].args.from,
            ipfsHash: events[i].args.ipfsHash,
            transactionHash: events[i].transactionHash,
            lastReplyBlock: events[i].blockNumber };
        } else {
          console.log("Adding data to reply without root");
          _.assign(foundEmails[emailId], {
            fromAddress: events[i].args.from,
            ipfsHash: events[i].args.ipfsHash,
            transactionHash: events[i].transactionHash });
        }

        // Update oldest email block if needed
        if(oldestEmailBlock == null || events[i].blockNumber < oldestEmailBlock) {
          oldestEmailBlock = events[i].blockNumber;
        }
      } else {
        if(foundEmails[inReplyTo] == undefined) {
          foundEmails[inReplyTo] = { lastReplyBlock: events[i].blockNumber};
        } else if (events[i].blockNumber > foundEmails[inReplyTo].lastReplyBlock) {
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
      var inReplyTo = events[i].args.inReplyToId;

      if (inReplyTo != 0 && foundEmails[inReplyTo].ipfsHash == undefined) {
        foundEmails[inReplyTo] = {
          fromAddress: events[i].args.from,
          ipfsHash: events[i].args.inReplyToIpfsHash,
          transactionHash: events[i].transactionHash,
          lastReplyBlock: events[i].blockNumber,
          isReply: true };
      }
    }

    // Not enough root emails found, keep looking if possible
    if(_.size(foundEmails) < batchSize && fromBlock > startingBlock) {
      findBatchOfEmails(type, batchSize, startingBlock, upperBlockLimit - blockOffset, blockOffset * 2, foundEmails, callback);
    } else {
      // We have reached the end of the blockchain, return emails found so far
      callback(foundEmails, oldestEmailBlock);
    }
  });
}

module.exports = ethereumService;