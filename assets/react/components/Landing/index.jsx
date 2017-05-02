import React from 'react';

import icon_network from '../../../images/icon_network.png';
import icon_shield from '../../../images/icon_shield.png';
import icon_turnoff from '../../../images/icon_turnoff.png';
import logo from '../../../images/logo-white.svg';

class LandingPage extends React.Component {
    componentDidMount() {
        window.addEventListener('scroll', function(){
            if(0 !== document.body.scrollTop) document.getElementsByTagName("header")[0].classList.add("overlaid");
            else document.getElementsByTagName("header")[0].classList.remove("overlaid");
        });
    }

    render() {
        return (
        <div className="landing">
            <header>
                <div id="header-wrapper">
                    <a id="header-logo" href="#">
                        <img id="primary-logo" src={logo}/>
                    </a>

                    <div className="header-menu-wrapper" onClick={this.toggleMenu}>|||</div>

                    <div className="header-link-wrapper">
                        <a className="header-link" href="#/about">About</a>
                        <div className="header-separator"></div>
                        <a className="header-link" href="https://github.com/DevanaLabs/lemon.email-dApp" target="_blank">GitHub</a>
                        <div className="header-separator"></div>
                        <a className="header-link" href="#/auth">Login</a>
                    </div>
                </div>
            </header>

            <div id="section-hero-wrapper">
                <div id="section-hero">
                    <div className="fixed-width-section">
                        <h1>Decentralized secure webmail</h1>
                        <h2>
                            Lemon Email DApp is a completely decentralized version of <a href="https://lemon.email" target="_blank">Lemon Email</a>, a security-focused
                            webmail service. Functioning as a stand-alone version of Lemon Mail, it consist entirely
                            of front-end Javascript code that interacts with an Ethereum contract serving as a
                            back-end.
                        </h2>
                        <div id="action-wrapper">
                            <a className="action-button" id="action-contact" href="#/auth">Start now</a>
                        </div>
                    </div>
                </div>
            </div>

            <div id="section-decentralized">
                <div className="fixed-width-section">
                    <div className="landing-feature-wrapper">
                        <div className="image-wrapper">
                            <img src={icon_network} alt=""/>
                        </div>
                        <div className="text-wrapper">
                            <h2>100% decentralized</h2>
                            <p>All message transactions get stored on Ethereum blockchain, a distributed and immutable transaction ledger,
                                while end-to-end encrypted message content gets stored on IPFS, a peer-to-peer storage
                                network. The front-end code is also hosted on IPFS, although you are
                                free to deploy and run it anywhere you want. Utilizing decentralized technologies such
                                as Ethereum and IPFS along with public key cryptography ensures both platform stability
                                and user privacy. </p>
                        </div>
                    </div>
                </div>
            </div>

            <div id="section-opensource">
                <div className="fixed-width-section">
                    <div className="landing-feature-wrapper">
                        <div className="text-wrapper">
                            <h2>Secure and Open Source</h2>
                            <p>This is a highly experimental software that aims to demonstrate how emerging decentralized technologies
                                have made it possible to achieve secure message exchange without any trusted third parties. Only you and the person that
                                you are communicating with can see decrypted messages. We encourage you to inspect
                                the code or even deploy and run your own instance of the application anywhere you
                                want. See our <a href="https://github.com/DevanaLabs/lemon.email-dApp">GitHub page</a> for instructions on how to build
                                and deploy the DApp code.</p>
                        </div>
                        <div className="image-wrapper">
                            <img src={icon_shield} alt=""/>
                        </div>
                    </div>
                </div>
            </div>

            <div id="section-getstarted">
                <div className="fixed-width-section">
                    <div className="landing-feature-wrapper">
                        <div className="image-wrapper">
                            <img src={icon_turnoff} alt=""/>
                        </div>
                        <div className="text-wrapper">
                            <h2>How to get started</h2>
                            <p>In order to use Lemon Mail DApp you will need a Chrome browser with <a href="https://metamask.io/" target="_blank">MetaMask</a> extension
                                installed, along with Ethereum account on Kovan test network. Authentication for this service is not done in a
                                traditional way that requires you to choose and remember a password - instead, your
                                Ethereum account serves as a key to your Lemon Mail account.
                                You will also need some Kovan test ETH in order to execute transactions on the blockchain. <a href="https://lemon.email/contact" target="_blank">Get in touch</a> and we'll be more than happy to send you some!</p>
                        </div>
                    </div>
                </div>
            </div>

            <footer>
                <h4><b>Lemon</b> DApp</h4>
                <a href="#/about">About</a>
                <a href="https://github.com/DevanaLabs/lemon.email-dApp" target="_blank">GitHub</a>
                <a href="https://lemon.email/contact" target="_blank">Contact us</a>
            </footer>
        </div>
        )
    }
}


export default LandingPage;