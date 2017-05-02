import React  from 'react';

const Notification = ( { shown, title, text } ) => (
  <div className={shown ? "mail-notification active" : "mail-notification"}>
    <span className="title">{title}</span>
    {text ? <span>{text}</span> : ""}
  </div>
);

Notification.propTypes = {
  text: React.PropTypes.string.isRequired
};

export default Notification;