import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import avatar from './assets/lemon-logo-gray.png';
import * as actions from '../../../actions/topBarActions';

const TopBarMenu = ({ toggled, toggleTopMenu }) => (
    <div className="top-bar-menu">
        <div className="user-info" onClick={toggleTopMenu}>
            <div className="avatar">
                <img src={avatar} alt="Avatar"/>
            </div>
            <p className="username">{localStorage.getItem("from")}</p>
            <i className={toggled ? "icon-arrow-up down" : "icon-arrow-up"}></i>
        </div>
        {
            toggled &&
            <div className="toggled-menu">
                <a href="https://lemon.email/dashboard">Dashboard</a>
                <a href="https://webmail.lemon.email/">Classic Mail</a>
            </div>
        }
    </div>
);

const mapStateToProps = (state) => ( state.topBar );

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

const TopBarMenuContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TopBarMenu);

export default TopBarMenuContainer;
