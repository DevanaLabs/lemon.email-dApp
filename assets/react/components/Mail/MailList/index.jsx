import React from 'react';

import Mail from '../MailListItem/';
import Spinner from '../../Layout/Spinner/';
import SingleMail from '../SingleMail/';
import Tools from '../Tools/';
import Notification from '../Notification/';

const MailList = React.createClass({
  componentWillMount(){
    this.props.fetchMails(this.props.urlLocation, null, null, 0);
  },
  componentDidUpdate(prevProps){
    if (prevProps.urlLocation !== this.props.urlLocation) {
      this.props.fetchMails(this.props.urlLocation, null, null, 0);
    }
  },
  formatDate(inputDate){
    let date = new Date(inputDate);

    return date.getDate() + "." +
      (date.getMonth() + 1) + "." +
      date.getFullYear() + ". " +
      (("0" + (date.getHours())).slice(-2)) + ":" +
      (("0" + (date.getMinutes())).slice(-2));
  },
  render(){
    const mails = this.props.mails || [];
    const {mailData, urlLocation} = this.props;

    if (mailData.isFetching) {
      return (
        <section>
          <div className="mails-wrapper">
            <Spinner/>
          </div>
          <SingleMail formatDate={this.formatDate} {...this.props}/>
        </section>
      )
    }

    if (!mailData.isFetching && mails.length === 0) {
      return (
        <section>
          <Notification title={"Mail sent"} text={"It will take a few seconds for it to show up in sent messages. "} shown={this.props.notifications.sentOk} />
          <div className="mails-wrapper">
            <Tools {...this.props}/>
            <div className="no-emails">
              <h1>{this.props.urlLocation == "inbox" ? "Welcome to Lemon Email! You'll receive a welcome email in a few seconds. " : "This folder is empty."}</h1>
            </div>
          </div>
          <SingleMail formatDate={this.formatDate} {...this.props}/>
        </section>
      )
    }

    return (
      <section>
        <Notification title={"Mail sent"} text={"It will take a few seconds for it to show up in sent messages. "} shown={this.props.notifications.sentOk} />
        <div className="mails-wrapper">
          <Tools {...this.props}/>
          {mails.map((mail, index) =>
            <Mail
              key={index}
              mail={mail}
              active={this.props.params.id == mail.ipfsHash ? "active" : "" }
              mail_clicked={this.props.mail_clicked}
              urlLocation={urlLocation}
              formatDate={this.formatDate}
              index={index}/>
          )}
        </div>
        <SingleMail formatDate={this.formatDate} {...this.props}/>
      </section>
    )
  }
});

MailList.propTypes = {
  mails: React.PropTypes.array.isRequired,
  urlLocation: React.PropTypes.string.isRequired
};

export default MailList;