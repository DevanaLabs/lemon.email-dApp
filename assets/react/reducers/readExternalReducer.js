const readExternal = (state = {
    isFetching: false,
    externalMail: {},
    errorMessage: "",
    answer: "",
    unlocked: false
    }, action) => {
    switch (action.type){
        case 'UNLOCK_REQUEST':
            return {
                ...state,
                isFetching: true
            };
        case 'UNLOCK_SUCCESS':
            return {
                ...state,
                isFetching: false,
                externalMail : action.externalMail,
                answer: action.answer
            };
        case 'UNLOCK_ERROR':
            return {
                ...state,
                isFetching: false,
                errorMessage: action.message
            };
        case 'MAIL_DECRYPTED':
            return{
                ...state,
                unlocked: true,
                externalMail: action.externalMail,
                answer: action.answer
            };
        case 'MAIL_DECRYPT_ERROR':
            return{
                ...state,
                errorMessage: action.message
            };
        case 'OPEN_GUEST_REPLY':
            return {
                ...state,
                isReplying: true
            };
        case 'HIDE_GUEST_REPLY':
            return {
                ...state,
                isReplying: false
            };
        default:
            return state;
    }
};

export default readExternal;