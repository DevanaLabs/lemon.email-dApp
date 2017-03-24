pragma solidity ^0.4.9;

contract mortal {
    address public administrator;

    function mortal() {
        administrator = msg.sender;
    }

    function withdraw() {
        if (msg.sender == administrator) {
            while(!administrator.send(this.balance)){}
        }
    }

    function kill() {
        suicide(administrator);
    }
}

contract Email is mortal {
   mapping (bytes32 => address) usernameToAddress;

   event BroadcastPublicKey(bytes32 indexed username, string publicKey);
   event SendEmail(bytes32 emailId, address indexed from, address indexed to, string ipfsHash, bytes32 indexed inReplyToId, string inReplyToIpfsHash);

   function registerUser(bytes32 username, string publicKey) returns (bool) {
       if(usernameToAddress[username] != 0) {
           throw;
       }

       usernameToAddress[username] = msg.sender;

       BroadcastPublicKey(username, publicKey);

       return true;
   }

   function sendEmail(address to, string ipfsHash, bytes32 inReplyTo, string inReplyToIpfsHash) returns (bool) {
       SendEmail(sha3(ipfsHash), msg.sender, to, ipfsHash, inReplyTo, inReplyToIpfsHash);

       return true;
   }
}