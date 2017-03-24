import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/fetchSingleMailActions';
import * as composeBoxActions from '../../../actions/composeBoxActions';
import Spinner from '../../Layout/Spinner/';

const SingleMail = React.createClass({
    componentWillMount(){
        let location = this.props.location.pathname;
        let hash = location.split('/').pop();
        let urlLocation = this.props.urlLocation;

        if(hash.length>10){
            this.props.fetchMail(urlLocation,hash);
        }
    },
    componentDidUpdate(prevProps){
        let prevHash = prevProps.location.pathname.split('/').pop();
        let currHash = this.props.location.pathname.split('/').pop();
        if(currHash.length < 10) return;
        if(prevHash !== currHash){
            this.props.fetchMail(this.props.urlLocation,currHash);
        }
    },
    downloadAttachment(e, ipfsHash, privKey){
        e.preventDefault();

        this.props.decryptAttachment(ipfsHash, privKey);
    },
    render(){
        const { isFetching } = this.props.singleMail;
        const mail = this.props.singleMail.mail || {};

        const inReplyTo = this.props.location.pathname.split('/').pop();

        if(isFetching) return(
            <div className="single-mails">
                <Spinner/>
            </div>
        );

        if(Object.keys(mail).length === 0) return (
            <div className="single-mails">
                <h1 className="placeholder">Click on one of the emails to read them.</h1>
            </div>
        );

        return(
            <div className="single-mails">
                <div className="mail-actions">
                    <a className="icon-reply reply" onClick={this.props.add_compose_box.bind(null,{ ...mail[0], inReplyTo, special: "reply"})}> Reply</a>
                    <a className="icon-forward" onClick={this.props.add_compose_box.bind(null,{ ...mail[0], inReplyTo, special: "forward"})}> Forward</a>
                    {/*<div className="mail-navigation">*/}
                        {/*<a className="icon-prev"> &lt; </a>*/}
                        {/*<a className="icon-next"> &gt; </a>*/}
                    {/*</div>*/}
                </div>
                {
                    mail.map( (mail, i) =>
                        <div className="single-mail" key={i}>
                            <h3 className="single-mail-from">
                                {mail.from}
                                <span className="single-mail-date-inline">{this.props.formatDate(mail.time)}</span>
                            </h3>
                            {/*<h3 className="single-mail-to">To: {mail.to}</h3>*/}
                            <h1 className="single-mail-subject">{mail.subject}</h1>
                            {/*<h3 className="single-mail-date">Date: {this.props.formatDate(mail.time)}</h3>*/}
                            <p className="single-mail-body">{mail.body}</p>
                            <div className="attachments-list">
                                {
                                    mail.attachments && this.props.urlLocation !== "sent" &&
                                    Object.keys(mail.attachments).map(function(attachment, index) {
                                        return <a
                                            className="single-mail-attachment icon-download"
                                            onClick={this.props.decryptAttachment.bind(null, attachment, mail.privKey)}
                                            key={index}>
                                            <span>{mail.attachments[attachment].filename}</span>
                                        </a>
                                    }.bind(this))
                                }
                            </div>
                        </div>
                    )
                }

            </div>
        )
    }
});

SingleMail.propTypes = {
    singleMail: React.PropTypes.shape({
        isFetching: React.PropTypes.bool.isRequired,
        mail: React.PropTypes.array.isRequired
    }).isRequired,
    location: React.PropTypes.object.isRequired,
    urlLocation: React.PropTypes.string.isRequired,
    decryptAttachment: React.PropTypes.func.isRequired
};

const mapStateToProps = (state) => (
    {
        singleMail: state.singleMail
    }
);

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({...actions,...composeBoxActions}, dispatch);
};

const SingleMailWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(SingleMail);

export default SingleMailWrapper;