import React from 'react';
import { Link } from 'react-router';
import logo from '../../../../images/logo-white.svg';

const Login = React.createClass({
    validate(e){
        if(e.target.value.length === 0){
            e.target.parentNode.classList += " error";
            return;
        }

        e.target.parentNode.classList = "auth-input-wrapper";
    },
    login(e){
        e.preventDefault();
        let creds = {
            username: this.refs.email.value,
            password: this.refs.password.value
        };
        if(creds.username.length === 0){
            this.refs.email.parentNode.classList += " error";
        }
        if(creds.password.length === 0){
            this.refs.password.parentNode.classList += " error";
        }
        this.props.loginUser(creds);
    },
    render(){
        const { errorMessage } = this.props.login;
        return (
            <div className="auth-background">
                <header>
                    <div id="header-wrapper">
                        <a id="header-logo" href="/">
                            <img src={logo}/>
                        </a>
                    </div>
                </header>
                <form onSubmit={this.login} className="auth-form" autoComplete="off">
                    <h1 className="auth-title">Ethereum Mail</h1>
                    <input onBlur={this.validate} className="auth-input" type="email" ref="email" placeholder="Email"/>
                    <input onBlur={this.validate} autoComplete="new-password" className="auth-input" type="password" ref="password" placeholder="Password"/>
                    <Link className="register" to="/register">Don't have an account?</Link>
                    <input className="auth-button" type="submit" onClick={this.login} value="Login"/>
                    <h1 className="error-message">{errorMessage}</h1>
                </form>
            </div>
        )
    }
});

Login.propTypes = {
    login: React.PropTypes.object.isRequired,
    loginUser: React.PropTypes.func.isRequired
};

export default Login;