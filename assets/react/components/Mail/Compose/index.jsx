import React from 'react';
import * as cryptojs from "crypto-js";
import * as openpgp from 'openpgp';

const Compose = React.createClass({
  getInitialState(){
    return {
      externalMail: false
    };
  },
  checkExternal(e){
    if(this.refs.to.value == "") return;
    let regex = /(@lemon\.eth)/g;
    if(!regex.test(this.refs.to.value)) {
      this.setState({
        externalMail: true
      });
    } else {
      this.setState({
        externalMail: false
      });
    }
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

    let emailData = {
      "to": receiverEmail,
      "from": localStorage.getItem('from'),
      "subject": this.refs.subject.value,
      "body": this.refs.body.value,
      "time": currentTime.toString(),
      "attachments" : []
    };

    let _this = this;

    let generateEmailRequest = function(emailData, encryptedReceiverData, encryptedSenderData, encryptedAttachments) {
      emailData.secretQuestion = _this.refs.question ? _this.refs.question.value : null;
      emailData.inReplyTo = _this.props.item.mail ? _this.props.item.mail.inReplyTo : null;
      emailData.encryptedReceiverData = encryptedReceiverData;
      emailData.encryptedSenderData = encryptedSenderData;

      for (let i = 0; i < encryptedAttachments.length; i++) {
        emailData.attachments.push(encryptedAttachments[i]);
      }

     _this.props.sendMail(emailData, _this.props.index);
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
    let encryptedSenderData = JSON.stringify(emailData); // TODO: Encrypt this
    let encryptedReceiverData;

    if(this.state.externalMail) {
      //Encrypt email using secret answer that only sender and receiver know
      encryptedReceiverData = cryptojs.AES.encrypt(JSON.stringify(emailData), this.refs.answer.value);

      encryptAttachmentFiles(files, null, function(encryptedAttachments) {
        generateEmailRequest(emailData, encryptedReceiverData, encryptedSenderData, encryptedAttachments);
      });
    } else {
      // TODO: Encrypt email using receiver's public key

      encryptAttachmentFiles(files, "", function(encryptedAttachments) {
        generateEmailRequest(emailData, encryptedReceiverData, encryptedSenderData, encryptedAttachments);
      });
    }
  },
  render(){
    const btnClass = this.props.mail_sender.isSending ? "widen" : "";
    const errorMessage = this.props.mail_sender.message;

    let mailSpecialType = this.props.item.mail.special;
    let mailBody = "";
    let mailSubject = "";
    let mailSendTo = "";
    if(mailSpecialType) {
      if(mailSpecialType == "reply") {
        mailBody = "\n\n-----\n" + this.props.item.mail.time + " <" + this.props.item.mail.from + ">\n\n" + this.props.item.mail.body;
        mailSubject = "Re: " + this.props.item.mail.subject;
        mailSendTo = this.props.item.mail.from;
      } else if (mailSpecialType == "forward") {
        mailBody = "\n\n-----\n" + this.props.item.mail.time + " <" + this.props.item.mail.from + ">\n\n" + this.props.item.mail.body;
        mailSubject = "Fw: " + this.props.item.mail.subject;
      }
    }
    const defaultValues = {
      ...this.props.item.mail,
      'from': localStorage.getItem('from') == this.props.item.mail.from ? this.props.item.mail.to : this.props.item.mail.from,
      'body': mailBody,
      'subject': mailSubject,
      'sendTo': mailSendTo
    };

    return (
      <form onSubmit={this.handleFormSubmit}
            className={this.props.item.toggled ? "form compose-box" : "form compose-box hidden"}>
        <div className="compose-box-bar" onClick={this.props.toggleBox.bind(null, this.props.index)}>
          <h1 className="compose-box-title">New message</h1>
          <i onClick={(e) => this.props.removeBox(this.props.index, e)} className="icon-close exit"> </i>
        </div>
        <div className="compose-box-body">
          <input onBlur={this.checkExternal}
                 type="email"
                 ref="to"
                 defaultValue={defaultValues.from}
                 placeholder="To"
                 autoFocus="autoFocus"/>
          {
            this.state.externalMail &&
            <div>
              <input ref="question" type="text" placeholder="Secret question"/>
              <input ref="answer" type="text" placeholder="Secret answer"/>
            </div>
          }
          <input type="text"
                 ref="subject"
                 defaultValue={defaultValues.subject}
                 placeholder="Subject"/>
          <textarea ref="body"
                    cols="30"
                    rows="15"
                    defaultValue={defaultValues.body}></textarea>
          <p className="error">{errorMessage}</p>
          <input ref="files" type="file" multiple="multiple"/>
          <button ref="send" type="submit" className={btnClass}>
            Send Message
            { this.props.mail_sender.isSending &&
            <div className="loader">Loading...</div>
            }
          </button>
        </div>
      </form>
    )
  }
});

Compose.propTypes = {
  mail_sender: React.PropTypes.object.isRequired,
  item: React.PropTypes.object,
  removeBox: React.PropTypes.func.isRequired,
  toggleBox: React.PropTypes.func.isRequired,
  sendMail: React.PropTypes.func.isRequired
};

Compose.contextTypes = {
  router: React.PropTypes.object
};

export default Compose;