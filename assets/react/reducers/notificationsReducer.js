const notifications = (state = {}, action) => {
  switch (action.type){
    case 'NOTIFICATION_SHOW':
      return {
        ...state,
        [action.notificationType]: true
      };
    case 'NOTIFICATION_HIDE':
      return {
        ...state,
        [action.notificationType]: false
      };
    default:
      return state;
  }
};

export default notifications;