'use strict';


var bitcore = require('bitcore-lib');
delete global._bitcore;
var ECIES = require('bitcore-ecies');

var cryptoService = {
  encrypt: function(identity, message) {
    var privKey = new bitcore.PrivateKey(identity.privateKey);
    var receiver = ECIES().privateKey(privKey).publicKey(new bitcore.PublicKey(identity.publicKey));
    var encrypted = receiver.encrypt(message);

    return encrypted.toString('hex');
  },
  decrypt: function(identity, encrypted) {
    var privKey = new bitcore.PrivateKey(identity.privateKey);
    var alice = ECIES().privateKey(privKey);

    var decryptMe = new Buffer(encrypted, 'hex');

    var decrypted = alice.decrypt(decryptMe);
    return decrypted.toString('ascii');
  }
}

module.exports = cryptoService;