import React, { PropTypes, Component } from 'react';

import Modal from 'tg-modal';


class TrialExpiredModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: props.isOpen
        };
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.showModal = this.showModal.bind(this);
    }
    onCancel(){
    }
    onConfirm(){
        this.setState({
            isOpen: false
        });
        document.location = "https://lemon.email/dashboard/account";
    }
    showModal(){
        this.setState({
            isOpen: true
        });
    }
    render() {
        return (
            <div className="modal">
                <Modal
                    isOpen={this.state.isOpen} isBasic
                    onCancel={this.onCancel}
                    onConfirm={this.onConfirm}
                    keyboard={false}
                >
                    <Modal.Header addClose={false}>
                        Your trial account has used up all ether!
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Please upgrade your account to be able to send and receive emails.
                        </p>
                    </Modal.Body>
                    <div className="modal-footer">
                        <a className="btn btn-primary" onClick={this.onConfirm}>UPGRADE</a>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default TrialExpiredModal;