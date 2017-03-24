import { combineReducers } from 'redux';
import mailData from './mailsReducer';
import { singleMail, mail_sender } from './mailsReducer';
import register from './registerReducer';
import urlLocation from './urlLocationReducer';
import composebox from './composeBoxReducer';
import login from './loginReducer';
import pagination from './paginationReducer';
import readExternal from './readExternalReducer';
import unlock from './unlockReducer';
import topBar from './topBarReducer';
import { routerReducer } from 'react-router-redux';

const appReducer = combineReducers({
    register,
    topBar,
    unlock,
    composebox,
    pagination,
    urlLocation,
    singleMail,
    mail_sender,
    mailData,
    readExternal,
    login,
    routing: routerReducer
});

/*   Clears the store state on logout    */
const rootReducer = (state, action) => {
    if(action.type === 'LOGOUT_SUCCESS') {
        const { routing } = state;
        state = { routing }
    }

    return appReducer(state, action);
};

export default rootReducer;