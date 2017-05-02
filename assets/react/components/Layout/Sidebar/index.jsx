import React from 'react';
import { Link } from 'react-router';

import logo from './assets/lemon-logo-gray.png';

const Sidebar = ({location, logoutUser, add_compose_box}) => (
    <aside className="left-sidebar">
        <ul>
            {/*<li>*/}
                {/*<Link to="/" className="logo">*/}
                    {/*<img src={logo} alt="Lemon Logo"/>*/}
                {/*</Link>*/}
            {/*</li>*/}
            <button className="compose-button" onClick={add_compose_box.bind(null, null)}>
            {/*<button className="compose-button">*/}
                Compose
            </button>
            <li>
                <Link className={location.pathname === "/mail" ? "active" : ""} activeClassName={"active"} to="/mail/type/inbox">
                    {/*<i className="icon-envelope"></i>*/}
                    Inbox
                </Link>
            </li>
            <li>
                <Link activeClassName={"active"} to="/mail/type/sent">
                    {/*<i className="icon-arrow-up"></i>*/}
                    Sent
                </Link>
            </li>
        </ul>
    </aside>
);


Sidebar.propTypes = {
    location: React.PropTypes.object.isRequired
};

export default Sidebar;