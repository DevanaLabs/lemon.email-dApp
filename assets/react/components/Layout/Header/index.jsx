import React from 'react';

import logo from '../../../../images/logo-white.svg';

const Header = () => (
    <header>
        <div id="header-wrapper">
            <a id="header-logo" href="#">
                <img src={logo}/>
            </a>

            <div className="header-link-wrapper">
                <a href="https://lemon.email/" className="header-link">Sign Up</a>
            </div>
        </div>
    </header>
);

export default Header;