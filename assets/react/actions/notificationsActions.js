export const showNotification = (type) => {
  return {
    type: 'NOTIFICATION_SHOW',
    notificationType: type
  }
};

export const hideNotification = (type) => {
  return {
    type: 'NOTIFICATION_HIDE',
    notificationType: type
  }
};