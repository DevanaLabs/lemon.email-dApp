export const mail_sender = (state = {
    isSending: false,
    message: "",
    publicKey: ""
}, action) => {
    switch (action.type) {
        case 'SEND_REQUEST':
            return {
                ...state,
                isSending: true
            };
        case 'SEND_SUCCESS':
            return {
                ...state,
                isSending: false
            };
        case 'SEND_ERROR':
            return {
                ...state,
                isSending: false,
                message: action.message
            };
        case 'PUBLIC_KEY':
            return {
                ...state,
                publicKey: action.publicKey
            };
        default:
            return state;
    }
};

export const singleMail = (state = {
    isFetching: false,
    mail: []
}, action) => {
    switch (action.type) {
        case 'MAIL_REQUEST':
            return {
                ...state,
                isFetching: true
            };
        case 'MAIL_SUCCESS':
            return {
                ...state,
                isFetching: false,
                mail: action.mail
            };
        case 'MAIL_ERROR':
            return {
                ...state,
                isFetching: false,
                message: action.message
            };
        case 'MAILS_REQUEST':
            return {
                ...state,
                mail: []
            };
        default:
            return state;
    }
};

const mailData = (state = {
    isFetching: false,
    message: "",
    mails: []
}, action) => {
    switch (action.type) {
        case 'MAILS_REQUEST':
            return {
                ...state,
                isFetching: true
            };
        case 'MAILS_SUCCESS':
            return {
                ...state,
                isFetching: false,
                mails: action.mails
            };
        case 'MAILS_ERROR':
            return {
                ...state,
                isFetching: false,
                message: action.message,
                mails: []
            };
        case 'NEW_MAIL':
            return {
                ...state,
                mails: [action.mail, ...state.mails]
            };
        default:
            return state;
    }
};

export default mailData;