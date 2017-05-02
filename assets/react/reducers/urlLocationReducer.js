import { LOCATION_CHANGE } from 'react-router-redux';

const urlLocation = ( state = "" , action ) => {
    switch (action.type){
        case LOCATION_CHANGE:
            let url = action.payload.pathname;
            return url === "/mail" ? "inbox" : url.split("/")[3] || null;
        default:
            return state;
    }
};

export default urlLocation;