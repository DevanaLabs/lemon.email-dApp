import React  from 'react';
import { Link } from 'react-router';

const Mail = ( {mail, active, urlLocation, formatDate, mail_clicked } ) => (
  <Link className={"mail-item " + active} to={"/mail/type/" + urlLocation + '/email/' + mail.ipfsHash} onClick={
    () => {
      mail_clicked(mail.transactionHash)
    }
  }>
    <h1 className="mail-item-subject">{mail.subject}</h1>
    <div>
      <span className="mail-item-from">
                {urlLocation === "sent" ? mail.to : mail.from}
            </span>
      <span className="mail-item-time">{formatDate(mail.time)}</span>
    </div>
  </Link>
);

Mail.propTypes = {
  mail: React.PropTypes.object.isRequired,
  urlLocation: React.PropTypes.string.isRequired,
  formatDate: React.PropTypes.func.isRequired
};

export default Mail;