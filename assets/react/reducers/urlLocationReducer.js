import { LOCATION_CHANGE } from 'react-router-redux';

const urlLocation = ( state = "" , action ) => {
    switch (action.type){
        case LOCATION_CHANGE:
            let url = action.payload.pathname;
            return url === "/" ? "inbox" : url.split("/")[2] || null;
        default:
            return state;
    }
};

export default urlLocation;