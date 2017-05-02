import React from 'react';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';

/* Routing / Redux / store imports */
import {Router, Route, IndexRoute} from 'react-router';
import {Provider} from 'react-redux';
import store, {history} from './store';

/* CSS import */
import '../sass/style.scss';

/* App components import */
import SecureApp from './components/App/App';
import MailList from './components/containers/MailList';
import Auth from './components/containers/RegisterContainer';
import ReadEmail from './components/ReadEmail/';
import NotFound from './components/404/';
import LandingPage from './components/Landing/';
import AboutPage from './components/About/';

window.addEventListener('load', function() {
  if (typeof web3 !== 'undefined') {
    console.log("Using MetaMask");

    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.log("Using local Ethereum node");

    const web3 = require('web3');
    var web3HttpProvider = new Web3.providers.HttpProvider("http://localhost:8545");

    if(web3HttpProvider.isConnected()) {
      window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    } else {
      console.log("Unable to connect to Web3 provider");
    }
  }

  const router = (
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={LandingPage}/>
            <Route path="/about" component={AboutPage}/>
            <Route path="/mail" component={SecureApp}>
                <IndexRoute component={MailList}/>
                <Route path="type/:mailType">
                    <IndexRoute component={MailList}/>
                    <Route path="email/:id" component={MailList}/>
                </Route>
            </Route>
            <Route path="/auth" component={Auth}/>
            <Route path="/readEmail/:ipfsHash" component={ReadEmail}/>
            <Route path="*" component={NotFound}/>
        </Router>
    </Provider>
  );

  render((<AppContainer>{router}</AppContainer>), document.getElementById("app"));

  module.hot.accept();
});