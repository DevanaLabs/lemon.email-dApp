export const select_mail = (mail) => {
  return {
    type: 'MAIL_SELECTED',
    mail
  }
};

export const clear_mail = () => {
  return {
    type: 'MAIL_CLEARED'
  }
};