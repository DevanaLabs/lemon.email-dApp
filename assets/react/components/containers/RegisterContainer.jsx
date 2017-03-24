import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/registerActions';
import Register from '../../components/Auth/Register/';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators(actions,dispatch);

const RegisterContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Register);

export default RegisterContainer;