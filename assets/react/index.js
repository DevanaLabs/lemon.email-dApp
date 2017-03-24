/* React imports */
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

/* Routing / Redux / store imports */
import { Router, Route, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import store, { history } from './store';

/* CSS import */
import '../sass/style.scss';

/* App components import */
import SecureApp from './components/App/App'; // requires login
import MailList from './components/containers/MailList';
import Compose from './components/containers/ComposeMail';
import Register from './components/containers/RegisterContainer';
import ReadEmail from './components/ReadEmail/';
import Unlock from './components/Auth/Unlock/';
import NotFound from './components/404/';

const router = (
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={SecureApp}>
                <IndexRoute component={MailList}/>
                <Route path="type/:mailType">
                    <IndexRoute component={MailList}/>
                    <Route path="email/:id" component={MailList}/>
                </Route>
                <Route path="compose" component={Compose}/>
            </Route>
            <Route path="/register" component={Register}/>
            <Route path="/readEmail/:ipfsHash" component={ReadEmail}/>
            <Route path="/unlock" component={Unlock}/>
            <Route path="*" component={NotFound}/>
        </Router>
    </Provider>
);

render((<AppContainer>{router}</AppContainer>),document.getElementById("app"));

module.hot.accept();