import React from 'react';
import { Link } from 'react-router';

import logo from '../../../images/logo-white.svg';

const NotFound = () => (
    <div className="page-not-found">
        <img src={logo} alt="Lemon mail logo"/>
        <h1>404 Page not found...</h1>
        <Link to={"/"} className="go-back">Go back!</Link>
    </div>
);

export default NotFound;