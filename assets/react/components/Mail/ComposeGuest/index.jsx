import React from 'react';
import * as cryptojs from "crypto-js";
import eth from './../../../../../modules/ethereumService';
import crypto from './../../../../../modules/cryptoService';

const ComposeBoxGuest = React.createClass({
  getInitialState(){
    return {
      externalMail: false
    };
  },
  componentDidUpdate(prevProps, prevState){
    if(this.state.externalMail !== prevState.externalMail && this.refs.question != undefined){
      this.refs.question.focus();
    }
  },
  handleFormSubmit(e){
    e.preventDefault();
    if(this.refs.to.value === "") return;

    let generateEmailRequest = function(_this, secureData, encryptedReceiverData, encryptedAttachments) {
      secureData.inReplyTo = _this.props.item.mail.inReplyTo != undefined ? _this.props.item.mail.inReplyTo : null;
      secureData.encryptedReceiverData = encryptedReceiverData;

      for (let i = 0; i < encryptedAttachments.length; i++) {
        secureData.attachments.push(encryptedAttachments[i]);
      }

      _this.props.sendMail(secureData, _this.props.index);
    };

    let encryptAttachmentFiles = function(_this, files, receiverIdentity, callback) {
      let encryptedAttachments = [];

      if(files.length == 0) {
        return callback(encryptedAttachments);
      }

      for (let i = 0; i < files.length; i++) {
        let fileEncryptor = new FileReader();

        fileEncryptor.fileName = files[i].name;

        fileEncryptor.onload = function(e) {
          let attachment = JSON.stringify({ 'fileName' : e.target.fileName, 'fileData' : e.target.result });

          // If no public key was given, assume external email and encrypt using secret answer
          if(receiverIdentity == null) {
            encryptedAttachments.push(cryptojs.AES.encrypt(attachment, _this.refs.answer.value).toString());
          } else {
            encryptedAttachments.push(crypto.encrypt(receiverIdentity, attachment));
          }

          if(encryptedAttachments.length == files.length) {
            return callback(encryptedAttachments);
          }
        };

        fileEncryptor.readAsDataURL(files[i]);
      }
    };

    let receiverEmail = this.refs.to.value;
    let currentTime = new Date();
    let files = this.refs.files.files;

    let emailData = {
      "to": receiverEmail,
      "from": this.props.item.mail.to,
      "subject": this.refs.subject.value,
      "body": this.refs.body.value,
      "time": currentTime.toString()
    };

    let _this = this;

    // Encrypt the email with senders passphrase, so that he can read it later
    let encryptedReceiverData;

    eth.initialize(function(connected) {
      if(!connected) {
        _this.props.send_error("Not connected to the Ethereum network.");
        return;
      }

      // Encrypt using receiver's public key
      eth.getUsersPublicKey(receiverEmail, function(error, result) {
        if(error) {
          _this.props.send_error("User not found");
          return;
        }

        let receiverIdentity= {
          publicKey: result.publicKey
        };

        encryptedReceiverData = crypto.encrypt(receiverIdentity, JSON.stringify(emailData));

        let secureData = {
          toAddress: result.address,
          attachments: []
        };

        encryptAttachmentFiles(_this, files, receiverIdentity, function(encryptedAttachments) {
          generateEmailRequest(_this, secureData, encryptedReceiverData, encryptedAttachments);
        });
      });
    });
  },
  render(){
    const btnClass = this.props.mail_sender.isSending ? "widen" : "";
    const errorMessage = this.props.mail_sender.message;
    const defaultValues = {
      ...this.props.item.mail,
      body: "\n\n-----\n" + this.props.item.mail.time + " <" + this.props.item.mail.from + ">\n\n" + this.props.item.mail.body
    };

    return (
      <form onSubmit={this.handleFormSubmit}
            className="form compose-box">
        <input type="email"
               ref="to"
               defaultValue={defaultValues.from}
               placeholder="To"
               disabled/>
        <input type="text"
               ref="subject"
               defaultValue={defaultValues.subject ? "Re: " + defaultValues.subject : ""}
               placeholder="Subject"/>
        <textarea ref="body"
                  cols="30"
                  rows="15"
                  defaultValue={defaultValues.body}>
                </textarea>
        <p className="error">{errorMessage}</p>
        <input ref="files" type="file" multiple="multiple"/>
        <button ref="send" type="submit" className={btnClass}>
          Send Message
          { this.props.mail_sender.isSending &&
          <div className="loader">Loading...</div>
          }
        </button>
      </form>
    )
  }
});

ComposeBoxGuest.propTypes = {
  mail_sender: React.PropTypes.object.isRequired,
  item: React.PropTypes.object,
  sendMail: React.PropTypes.func.isRequired
};

ComposeBoxGuest.contextTypes = {
  router: React.PropTypes.object
};

export default ComposeBoxGuest;