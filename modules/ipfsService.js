'use strict';

const concat = require('concat-stream'),
      decoder = require('text-encoding');

var bootstrapWsAddr = '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd';
var ipfsNode = null;

var ipfsService = {
  safeInit: function(callback) {
    if(ipfsNode !== null) {
      if(ipfsNode.isOnline()) {
        return callback();
      } else {
        ipfsNode.on('start', function() {
          console.log("Calling ipfs callback");
          callback();
        });
        return;
      }
    }

    const repoPath = String(Math.random());

    ipfsNode = new Ipfs({
      repo: repoPath,
      init: false,
      start: false,
      EXPERIMENTAL: {
        pubsub: false
      }
    });

    window.ipfs = ipfsNode;

    ipfsNode.init({emptyRepo: true, bits: 2048}, function (err) {
      if (err) {
        throw err
      }

      ipfsNode.start(function (err) {
        if (err) {
          console.log("Error while staring IPFS node: " + err)
          return;
        }

        console.log('IPFS node is ready');

        // http://earth.i.ipfs.io/ipfs/
        ipfs.swarm.connect(bootstrapWsAddr, function (error, result) {
          ipfsNode.swarm.peers({}, function (error, result) {
            callback(error, result);
          });
        });
      })
    });
  },
  store: function(data, callback) {
    this.safeInit(function() {
      ipfsNode.files.add(new Buffer(data), function (err, res) {
        if (err || !res) {
          return callback('ipfs add error ' + err, null);
        }

        res.forEach(function (file) {
          if (file && file.hash) {
            console.log("Stored email at " + file.hash);
            return callback(null, file.hash);
          }
        })
      })
    });
  },
  fetch: function(hash, callback) {
    this.safeInit(function() {
      console.log("Trying to fetch " + hash);

      ipfsNode.files.cat(hash, function (err, res) {
        if (err || !res) {
          return console.log('ipfs cat error', err, res)
        }

        res.pipe(concat(function (data) {
          console.log("Done fetching " + hash);
          return callback(null, new TextDecoder("utf-8").decode(data), hash);
        }))
      });
    });
  }
};

module.exports = ipfsService;