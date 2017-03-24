import React from 'react';
import { getCookieValue } from '../../../actions/cookieActions';
import logo from './assets/logo.png';

import Mail from '../MailListItem/';
import Spinner from '../../Layout/Spinner/';
import SingleMail from '../SingleMail/';
import TopBar from '../TopBar/';
import Tools from '../Tools/';

// Define socket connection
const socket = io.connect();

socket.on('connect', function () {

});

const MailList = React.createClass({
    componentWillMount(){
        if(this.props.login.isLowBalance) return;
        socket.emit('authenticate', {token: getCookieValue("jwt_token")});
        this.props.fetchMails(this.props.urlLocation, null, null, 0);
    },
    componentDidMount(){
        if(this.props.login.isLowBalance) return;
        socket.on('newMailEvent', function (mailData) {
            this.props.new_mail(mailData);
        }.bind(this));
    },
    componentWillUnmount(){
        if(this.props.login.isLowBalance) return;
        socket.removeAllListeners("newMailEvent");
    },
    componentDidUpdate(prevProps){
        if (prevProps.urlLocation !== this.props.urlLocation && !this.props.login.isLowBalance) {
            this.props.fetchMails(this.props.urlLocation, null, null, 0);
        }
    },
    formatDate(date){
        date = new Date(date);

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
                    {/*<TopBar {...this.props}/>*/}
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
                    {/*<TopBar {...this.props}/>*/}
                    <div className="mails-wrapper">
                        <Tools {...this.props}/>
                        <div className="no-emails">
                            <img src={logo} alt=""/>
                            <h1>This folder is empty.</h1>
                        </div>
                    </div>
                    <SingleMail formatDate={this.formatDate} {...this.props}/>
                </section>
            )
        }

        return (
            <section>
                {/*<TopBar {...this.props}/>*/}
                <div className="mails-wrapper">
                    <Tools {...this.props}/>
                    {mails.map((mail, index) =>
                        <Mail
                            key={index}
                            mail={mail}
                            active={this.props.params.id == mail.ipfsHash ? "active" : "" }
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