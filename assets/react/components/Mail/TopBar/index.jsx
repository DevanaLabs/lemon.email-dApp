import React from 'react';
import Tools from '../Tools/';
import TopBarMenu from '../TopBarMenu/';

const TopBar = ({ pagination, mailData, urlLocation, fetchMails, add_compose_box }) => (
    <div className="mails-wrapper-header">
        <button className="compose-button" onClick={add_compose_box.bind(null, null)}>
            <i className="icon-add"> </i> Compose
        </button>
        <Tools pagination={pagination} mailData={mailData} urlLocation={urlLocation}
               fetchMails={fetchMails}/>
        {/*<a href="https://lemon.email/dashboard" className="dashboard-link">Dashboard</a>
        <a href="https://webmail.lemon.email/" className="dashboard-link">Classic Mail</a>*/}
        <TopBarMenu toggled={true}/>
    </div>
);

export default TopBar;