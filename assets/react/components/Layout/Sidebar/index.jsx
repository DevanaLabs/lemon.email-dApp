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
                <Link className={location.pathname === "/" ? "active" : ""} activeClassName={"active"} to="/type/inbox">
                    {/*<i className="icon-envelope"></i>*/}
                    Inbox
                </Link>
            </li>
            <li>
                <Link activeClassName={"active"} to="/type/sent">
                    {/*<i className="icon-arrow-up"></i>*/}
                    Sent
                </Link>
            </li>

            <button className="logout-button" onClick={logoutUser}> <i className="icon-power"></i> Logout</button>
        </ul>
    </aside>
);


Sidebar.propTypes = {
    location: React.PropTypes.object.isRequired,
    logoutUser: React.PropTypes.func.isRequired
};

export default Sidebar;