import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/unlockActions';

import logo from '../../../../images/logo-white.svg';

const Unlock = React.createClass({
    unlock(e){
        e.preventDefault();
        this.props.checkPassphrase(this.refs.passphrase.value);
    },
    render(){
        return(
            <div className="auth-background">
                <header>
                    <div id="header-wrapper">
                        <a id="header-logo" href="/">
                            <img src={logo}/>
                        </a>
                    </div>
                </header>
                <div className="form-wrapper">
                    <form className="auth-form unlock" autoComplete="off" onSubmit={this.unlock}>
                        <h1 className="auth-title">Decrypt your emails</h1>
                        <h1 className="error-message">{this.props.errorMessage}</h1>
                        <input ref="passphrase" className="auth-input" type="password" placeholder="Passphrase"/>
                        <input onSubmit={this.unlock} className="auth-button" type="submit" value="DECRYPT"/>
                    </form>
                </div>
            </div>
        )
    }
});

Unlock.propTypes = {
    location: React.PropTypes.object
};

const mapStateToProps = (state) => ( state.unlock );

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

const UnlockContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Unlock);

export default UnlockContainer;