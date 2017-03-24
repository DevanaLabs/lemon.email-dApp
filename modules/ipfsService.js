'use strict';

const concat = require('concat-stream'),
  IPFS = require('ipfs');

var ipfsNode = null;

var ipfsService = {
  init: function(callback) {
    const repoPath = String(Math.random());

    ipfsNode = new IPFS({
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

      console.log(ipfsNode);

      ipfsNode.start(function (err) {
        if (err) {
          throw err
        }
        console.log('IPFS node is ready');

        // http://earth.i.ipfs.io/ipfs/
        ipfs.swarm.connect('/ip4/178.62.158.247/tcp/80/ws/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd', function (error, result) {
          ipfsNode.swarm.peers({}, function (error, result) {
            callback();
          });
        });
      })
    });
  },
  store: function(data) {
    if(ipfsNode == null) {
      console.log("Doing init");
      this.init(function() {
        addFile(data);
      });
    } else {
      addFile(data);
    }

    function addFile(data) {
      console.log("Adding file");

      ipfsNode.files.add(new Buffer(data), function (err, res) {
        if (err || !res) {
          return console.log('ipfs add error', err, res);
        }

        res.forEach(function (file) {
          if (file && file.hash) {
            console.log('successfully stored', file.hash);
            display(file.hash);
          }
        })
      })
    }

  },
  display: function(hash) {
    // buffer: true results in the returned result being a buffer rather than a stream
    ipfsNode.files.cat(hash, function (err, res) {
      if (err || !res) {
        return console.log('ipfs cat error', err, res)
      }

      res.pipe(concat(function (data) {
        console.log(String.fromCharCode.apply(null, data));
      }))
    })
  }
};

module.exports = ipfsService;