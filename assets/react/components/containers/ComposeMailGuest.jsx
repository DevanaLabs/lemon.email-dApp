import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Compose from '../Mail/ComposeGuest/';
import * as actions from '../../actions/sendMailActions';

const mapStateToProps = (state) => ( state );

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

const ComposeMail = connect(
    mapStateToProps,
    mapDispatchToProps
)(Compose);

export default ComposeMail;