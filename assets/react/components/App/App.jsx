import React from 'react';
import { browserHistory } from 'react-router'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/loginActions';
import * as composeActions from '../../actions/composeBoxActions';

import Sidebar from '../Layout/Sidebar/';
import ComposeBox from '../Mail/ComposeBox/';
import TrialExpiredModal from '../Modals/TrialExpiredModal';
import logo from '../../../images/logo-white.svg';

const App = React.createClass ({
  componentWillMount() {
    if(localStorage.getItem("privateKey") === null) {
      browserHistory.push('/register');
    }
  },
  render(){
    return(
      <div className="app-wrapper">
        <header className="full-width">
          <div id="header-wrapper">
            <a id="header-logo" href="/">
              <img src={logo}/>
            </a>

            <div className="header-link-wrapper">
              <a className="header-link mail" href="https://webmail.lemon.email/">Switch to classic</a>
              <a className="header-link username" href="https://lemon.email/dashboard">{localStorage.getItem("from")}</a>
            </div>
          </div>
        </header>
        <Sidebar {...this.props}/>
        {/* Mail folders, passed from react-router */}
        <main className="main-content">
          {React.cloneElement({...this.props}.children, {...this.props})}
        </main>

        <TrialExpiredModal isOpen={this.props.login.isLowBalance}/>

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
const mapDispatchToProps = (dispatch) => ( bindActionCreators({ ...actions, ...composeActions}, dispatch) );
const SecureApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default SecureApp;