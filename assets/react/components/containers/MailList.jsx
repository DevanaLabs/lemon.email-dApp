import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MailList from '../Mail/MailList/';
import * as actions from '../../actions/fetchMailsActions';
import * as notifActions from '../../actions/notificationsActions';

const mapStateToProps = (state) => {
  return {
    mails: state.mailData.mails,
    notifications: state.notifications
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({...actions, ...notifActions}, dispatch);
};

const MailListComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(MailList);

export default MailListComponent;