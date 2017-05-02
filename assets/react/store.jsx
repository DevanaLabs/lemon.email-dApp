import { createStore, compose, applyMiddleware } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import { hashHistory } from 'react-router';
import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';


// import the root reducer
import rootReducer from './reducers/index';

// create an object for the default data

const defaultState = {
};

// Redux developer tools enchancer
const reduxDevToolsEnchancer = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore)

const store = createStoreWithMiddleware(rootReducer, defaultState, reduxDevToolsEnchancer);

export const history = syncHistoryWithStore(hashHistory, store);

if(module.hot) {
    module.hot.accept('./reducers/',() => {
        const nextRootReducer = require('./reducers/index').default;
        store.replaceReducer(nextRootReducer);
    });
}

export default store;