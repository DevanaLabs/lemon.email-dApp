import React from 'react';
import * as cryptojs from "crypto-js";
import * as openpgp from 'openpgp';

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

    let formData = new FormData();
    let files = this.refs.files.files;

    let receiverEmail = this.refs.to.value;
    let currentTime = new Date();

    let emailBody = "Reply from " + this.props.item.mail.to + " \n\n " + this.refs.body.value;

    let emailData = {
      "to": receiverEmail,
      "from": this.props.item.mail.to,
      "subject": this.refs.subject.value,
      "body": emailBody,
      "time": currentTime.toString()
    };

    let _this = this;

    let generateEmailRequest = function(emailData, encryptedReceiverData, encryptedSenderData, encryptedAttachments, externalMailSecretHash) {
      formData.append("subject", emailData.subject);
      formData.append("secretQuestion", _this.refs.question ? _this.refs.question.value : null);
      formData.append("to", emailData.to);
      formData.append("from", emailData.from);
      formData.append("inReplyTo", _this.props.item.mail ? _this.props.item.mail.inReplyTo : null);
      formData.append("encryptedReceiverData", encryptedReceiverData);
      formData.append("encryptedSenderData", encryptedSenderData);
      formData.append("externalMailSecretHash", externalMailSecretHash);

      for (let i = 0; i < encryptedAttachments.length; i++) {
        formData.append("attachments[]", encryptedAttachments[i]);
      }

      _this.props.sendMail(formData, _this.props.index);
    };

    let encryptAttachmentFiles = function(files, publicKey, callback) {
      let encryptedAttachments = [];

      if(files.length == 0) {
        return callback(encryptedAttachments);
      }

      let createEncryptedFile = function(encryptedFileName, encryptedFileData) {
        let encryptedFile = new File([encryptedFileData], encryptedFileName, {
          type: "text/plain"
        });

        encryptedAttachments.push(encryptedFile);

        if (encryptedAttachments.length == files.length) {
          callback(encryptedAttachments);
        }
      };

      for (let i = 0; i < files.length; i++) {
        let fileEncryptor = new FileReader();

        fileEncryptor.fileName = files[i].name;

        fileEncryptor.onload = function(e) {
          let fileData = e.target.fileName + ',' + e.target.result;

          // If no public key was given, assume external email and encrypt using secret answer
          if(publicKey == null) {
            createEncryptedFile(e.target.fileName, cryptojs.AES.encrypt(fileData, _this.refs.answer.value));
          } else {
            let options = {
              data: fileData,
              publicKeys: openpgp.key.readArmored(publicKey).keys
            };

            openpgp.encrypt(options).then(function(cipherText) {
              createEncryptedFile(e.target.fileName, cipherText.data);
            });
          }
        };

        fileEncryptor.readAsDataURL(files[i]);
      }
    };

    // Encrypt the email with senders passphrase, so that he can read it later
    let encryptedSenderData = cryptojs.AES.encrypt(JSON.stringify(emailData), "guest");
    let encryptedReceiverData;
    let externalMailSecretHash = location.pathname.split('/').pop();

    // Encrypt email using receiver's public key

    let options = {
      data: JSON.stringify(emailData),
      publicKeys: openpgp.key.readArmored(publicKey).keys
    };

    openpgp.encrypt(options).then(function(cipherText) {
      encryptedReceiverData = cipherText.data;

      encryptAttachmentFiles(files, publicKey, function(encryptedAttachments) {
        generateEmailRequest(emailData, encryptedReceiverData, encryptedSenderData, encryptedAttachments, externalMailSecretHash);
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