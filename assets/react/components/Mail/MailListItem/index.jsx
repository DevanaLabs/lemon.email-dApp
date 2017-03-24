import React  from 'react';
import { Link } from 'react-router';

const Mail = ( {mail, active, urlLocation, formatDate } ) => (
    <Link className={"mail-item " + active} to={"/type/" + urlLocation + '/email/' + mail.ipfsHash}>
        <h1 className="mail-item-subject">{mail.subject}</h1>
        <div>
            <span className="mail-item-time">{formatDate(mail.time)}</span>
            <span className="mail-item-from">
                {urlLocation === "sent" ? mail.to : mail.from}
            </span>
        </div>
    </Link>
);

Mail.propTypes = {
    mail: React.PropTypes.object.isRequired,
    urlLocation: React.PropTypes.string.isRequired,
    formatDate: React.PropTypes.func.isRequired
};

export default Mail;