import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as composeActions from '../../actions/composeBoxActions';
import * as registerActions from '../../actions/registerActions';
import eth from './../../../../modules/ethereumService';

import Sidebar from '../Layout/Sidebar/';
import ComposeBox from '../Mail/ComposeBox/';
import logo from '../../../images/logo-white.svg';

const App = React.createClass ({
  getInitialState(){
    return {
      ethInitialized: false
    }
  },
  componentDidMount() {
    if(!this.props.register.privateKey) {
      window.location.hash = "/auth";
    }

    eth.initialize(function(connected) {
      if(!connected) {
        console.log("Not connected to the Ethereum network");
        return true;
      }

      this.setState({ ethInitialized : true });
    }.bind(this));
  },
  render() {
    if(!this.state.ethInitialized) {
      return null;
    }

    return(
      <div className="app-wrapper">
        <header className="full-width">
          <div id="header-wrapper">
            <a id="header-logo" href="#">
              <img src={logo}/>
            </a>

            <div className="header-link-wrapper">
              {this.props.register.emailAddress &&
              <a className="header-link username" href="/#/mail">{this.props.register.emailAddress}</a>
              }
            </div>
          </div>
        </header>
        <Sidebar {...this.props}/>
        {/* Mail folders, passed from react-router */}
        <main className="main-content">
          {React.cloneElement({...this.props}.children, {...this.props})}
        </main>

        <ComposeBox
          composers={this.props.composebox}
          toggleBox={this.props.toggle_box}
          removeBox={this.props.remove_compose_box}/>
      </div>
    )
  }
});

//Connect to store
const mapStateToProps = (state) => ( state );
const mapDispatchToProps = (dispatch) => ( bindActionCreators({...composeActions, ...registerActions}, dispatch) );
const SecureApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default SecureApp;