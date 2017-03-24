import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MailList from '../Mail/MailList/';
import * as actions from '../../actions/fetchMailsActions';


const mapStateToProps = (state) => {
    return {
        mails: state.mailData.mails
    }
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

const MailListComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(MailList);

export default MailListComponent;