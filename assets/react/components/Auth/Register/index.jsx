import React from 'react';
import eth from './../../../../../modules/ethereumService';

const Auth = React.createClass({
  getInitialState(){
    return {
      currentState: 'initial'
    }
  },
  componentDidMount() {
    if(this.props.register.privateKey != null) {
      this.setState({ currentState: 'initial' });
      return;
    }

    eth.initialize(function(connected) {
      if(!connected) {
        console.log("Not connected to the Ethereum network");
        this.setState({ currentState: 'notConnected' });
        return;
      }

      this.setState({ currentState: 'checkingUser' });

      eth.checkIfUserExists((userData) => {
        if(userData !== null) {
          this.setState({ currentState: 'userFound' });

          eth.generateKeyPair(userData, (privateKey) => {
            this.props.register_success(privateKey, userData.emailAddress, userData.startingBlock);
            this.setState({ currentState: 'transactionSigned' });
          });
        } else {
          this.setState({ currentState: 'userNotFound' });
        }
      });
    }.bind(this));
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

    this.props.registerUser(this.refs.username.value);
  },
  render() {
    if(this.state.currentState == 'initial') {
      return(
        <div className="app-wrapper">

          <div className="auth-wrapper">
            <h1>Connecting to the Ethereum network...</h1>
          </div>

        </div>
      )
    }

    if(this.state.currentState == 'notConnected') {
      return(
        <div className="app-wrapper">

          <div className="auth-wrapper">
            <h1>Could not connect to the Ethereum network :(</h1>
            <p className="regular-text">It seems like you either don't have <a href="https://metamask.io/" target="_blank">MetaMask</a> extension installed or that the extension is not connected to the Kovan test network.</p>
          </div>

        </div>
      )
    }

    if(this.state.currentState == 'checkingUser') {
      return(
        <div className="app-wrapper">

          <div className="auth-wrapper">
            <h1>Searching blockchain for user data...</h1>
          </div>

        </div>
      )
    }

    if(this.state.currentState == 'userFound') {
      return(
        <div className="app-wrapper">
          <div className="auth-wrapper">
            <h1>User account found</h1>
            <p className="regular-text">A MetaMask dialog will soon appear asking you to sign a dummy transaction. Transaction content should be "0xdeadbeefdeafbeef...". <b>Do not sign</b> if it is anything else.</p>
            <p className="regular-text">Message signing is used for private/public key generation - see <a href="#/about">here</a> for more details.</p>
            <p className="regular-text">If the dialog does not appear, make sure you have the <a href="https://metamask.io/" target="_blank">MetaMask extension</a> installed and connected to Kovan test network.</p>
          </div>

        </div>
      )
    }

    if(this.state.currentState == 'transactionSigned') {
      window.location.hash = "/mail/type/inbox";
      return null;
    }

    if(this.state.currentState == 'userNotFound') {
      const {errorMessage} = this.props.register;
      return (
        <div className="auth-background">
          <div className="auth-wrapper">
            <form onSubmit={this.register} className="auth-form register" autoComplete="off">
              <h1 className="auth-title">Welcome!</h1>

              <div>
                <p className="auth-regular">To begin, please choose a username. Your new email address will be <span className="auth-email"><i>Username</i>@LemonMail.eth</span></p>
                <input ref="username" onBlur={this.validate} className="auth-input" placeholder="Username" required/>
                <input onSubmit={this.register} className="auth-button" type="submit" value="REGISTER"
                       disabled={ this.register.isFetching }/>
              </div>

              <p className="auth-warning">A MetaMask dialog will appear asking you to sign a dummy transaction. Transaction content should be "0xdeadbeefdeafbeef...". <b>Do not sign</b> if it is anything else. </p>

              {
                this.props.register.isFetching &&
                <div className="form-loader">
                  <span>Waiting for user confirmation...</span>
                  <div className='uil-ring-css'>
                    <div></div>
                  </div>
                </div>
              }

              <h1 className="error-message">{errorMessage}</h1>
            </form>
          </div>
        </div>
      )
    }
  }
});

Auth.propTypes = {
  register: React.PropTypes.object.isRequired,
  registerUser: React.PropTypes.func.isRequired,
  register_error: React.PropTypes.func.isRequired
};

export default Auth;