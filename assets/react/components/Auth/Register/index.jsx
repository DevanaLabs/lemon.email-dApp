import React from 'react';
import logo from '../../../../images/logo-white.svg';

const Register = React.createClass({
  getInitialState(){
    return {
      generatingKey: false
    }
  },
  validate(e){
    if (e.target.value.length === 0) {
      e.target.classList += " error";
      return;
    }
    e.target.classList = "auth-input";
  },
  register(e){
    e.preventDefault();

    //this.setState({generatingKey: true});

    this.props.registerUser(this.refs.username.value);
  },
  render(){
    const {errorMessage} = this.props.register;
    return (
      <div className="auth-background">
          <header>
              <div id="header-wrapper">
                  <a id="header-logo" href="/">
                      <img src={logo}/>
                  </a>
              </div>
          </header>
          <div className="form-wrapper">
              <form onSubmit={this.register} className="auth-form register" autoComplete="off">
                  <h1 className="auth-title">Hi! It's time to pick your username</h1>
                  <p className="auth-description">Your new email address will be YourUsername@lemon.eth</p>

                  <h1 className="error-message">{errorMessage}</h1>
                  <input ref="username" onBlur={this.validate} className="auth-input" placeholder="Username"/>

                {
                  this.state.generatingKey &&
                  <div className="form-loader">
                      <span>Generating encryption keys...</span>
                      <div className='uil-ring-css'>
                          <div></div>
                      </div>
                  </div>
                }

                  <input onSubmit={this.register} className="auth-button" type="submit" value="REGISTER"/>
              </form>
          </div>
      </div>
    )
  }
});

Register.propTypes = {
  register: React.PropTypes.object.isRequired,
  registerUser: React.PropTypes.func.isRequired,
  register_error: React.PropTypes.func.isRequired
};

export default Register;