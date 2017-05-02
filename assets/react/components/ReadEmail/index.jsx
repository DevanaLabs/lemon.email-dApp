import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/readExternalActions';
import { decryptAttachment } from '../../actions/fetchSingleMailActions';
import ComposeBoxGuest from '../containers/ComposeMailGuest';

import Spinner from '../Layout/Spinner/';
import Header from '../Layout/Header/';

const ReadEmail = React.createClass({
  componentDidMount(){
    let secretHash = this.props.location.pathname.split('/').pop();
    this.props.unlockMail(secretHash);
  },
  decrypt(e){
    e.preventDefault();
    let answer       = this.refs.answer.value;
    let externalMail = this.props.externalMail;

    this.props.decryptMail(externalMail, answer);
  },
  render(){
    const mail = this.props.externalMail;
    if(this.props.isFetching){
      return(
        <div>
            <Header/>
            <Spinner/>
        </div>
      )
    }
    if(this.props.unlocked) {
      console.log(this.props);
      let _this = this;
      return(
        <div>
            <Header/>
            <div className="external-mail-preview single-mail">
                <h1 className="single-mail-subject">{mail.subject}</h1>
                <h3 className="single-mail-from">From: {mail.from}</h3>
                <h3 className="single-mail-to">To: {mail.to}</h3>
                <h3 className="single-mail-date">Date: {mail.time}</h3>
                <p className="single-mail-body">{mail.body}</p>
              {
                mail.attachments &&
                Object.keys(mail.attachments).map(function(attachment, index) {
                  return <a className="single-mail-attachment icon-download" onClick={this.props.decryptAttachment.bind(null, attachment, null, this.props.answer)} key={index}><span>{mail.attachments[attachment].filename}</span></a>
                }.bind(this))
              }
                <button onClick={this.props.open_guest_reply.bind(null)} className={this.props.isReplying ? "show-reply" : "show-reply active"}>Reply</button>
                <button onClick={this.props.hide_guest_reply.bind(null)} className={this.props.isReplying ? "hide-reply active" : "hide-reply"}>Cancel</button>
                <div className={this.props.isReplying ? "reply-wrapper active" : "reply-wrapper"}>
                    <p className="info-text">In order to send a reply, you will need a Chrome browser with <a href="https://metamask.io/" target="_blank">MetaMask</a> extension
                        installed, along with Ethereum account on Kovan test network.</p>
                    <ComposeBoxGuest item={{mail}} />
                </div>
            </div>
        </div>
      )
    }
    return(
      <div>
          <Header/>

          <form className="read-email-form" onSubmit={this.decrypt}>
              <h1>Unlock your email</h1>
              <label>Secret question: </label>
              <input readOnly="readOnly" ref="question" type="text" name="question" defaultValue={mail.secretQuestion}/>
              <label>Secret answer: </label>
              <input ref="answer" type="text" name="answer" placeholder="Answer"/>
              <p className="error-message">{this.props.errorMessage}</p>
              <input className="lemon-button" type="submit" value="Unlock" onClick={this.decrypt}/>
          </form>
      </div>
    )
  }
});

ReadEmail.propTypes = {
  externalMail: React.PropTypes.object,
  unlockMail: React.PropTypes.func.isRequired,
  location: React.PropTypes.object.isRequired,
  errorMessage: React.PropTypes.string
};


const mapStateToProps = (state) => ( state.readExternal );

const mapDispatchToProps = (dispatch) =>{
  return bindActionCreators({ ...actions, decryptAttachment }, dispatch);
};

const ReadEmailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReadEmail);


export default ReadEmailContainer;