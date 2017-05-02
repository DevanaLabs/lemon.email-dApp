const selectedMail = (state = {}, action) => {
  switch (action.type){
    case 'MAIL_SELECTED':
      return {
        ...state,
        ...action.mail
      };
    default:
      return state;
  }
};

export default selectedMail;