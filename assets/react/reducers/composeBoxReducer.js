const composeBox = ( state = [] , action ) => {
    switch (action.type){
        case 'NEW_COMPOSE_BOX':
            let mail = {
                    ...action.mail,
                    creationTimeHash: Date.now()
            } || {
                    from: "",
                    eth_addr: "",
                    subject: "",
                    to: "",
                    body: "",
                    inReplyTo: null,
                    creationTimeHash: Date.now()
            };
            return [
                {
                    mail: mail,
                    toggled: true
                },
                ...state
            ];
        case 'REMOVE_COMPOSE_BOX':
            return [
                ...state.slice(0, action.index),
                ...state.slice(action.index + 1)
            ];
        case 'TOGGLE_COMPOSE_BOX':
            return [
                ...state.slice(0, action.index),
                {
                    ...state[action.index],
                    toggled: !state[action.index].toggled
                },
                ...state.slice(action.index + 1)
            ];
        default:
            return state;
    }
};

export default composeBox;