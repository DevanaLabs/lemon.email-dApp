import * as cryptojs from "crypto-js";

export const request_unlock = () => {
    return {
        type: 'UNLOCK_REQUEST',
        isFetching: true
    }
};

export const unlock = (externalMail) => {
    return {
        type: 'UNLOCK_SUCCESS',
        isFetching: false,
        externalMail
    }
};

export const unlock_mail_error = (message) => {
    return {
        type: 'UNLOCK_ERROR',
        isFetching: false,
        message
    }
};

export const unlockMail = (secretHash) => {
    let config = {
        method: 'GET',
        headers: {
            'Content-Type':'application/x-www-form-urlencoded'
        }
    };

    return dispatch => {
        //Request the mails
        dispatch(request_unlock());

        return fetch('/api/getExternalEmail/'+secretHash, config)
            .then(response => response.json()
            .then(mail => ({ mail , response })))
            .then(({ mail, response }) =>  {
                if (!response.ok) {
                    // If there was a problem, we want to
                    // dispatch the error condition
                    dispatch(unlock_mail_error(mail.message));
                } else {
                    // Dispatch the success action
                    dispatch(unlock(mail));
                }
            }).catch(err => console.log(err))
    }
};

export const decryptMail = (externalMail, answer) => {
    return dispatch =>{
        let decryptedEmail;
        try{
            decryptedEmail = cryptojs.AES.decrypt(
                externalMail.encryptedData,
                answer
            ).toString(cryptojs.enc.Utf8);
        } catch (e){
            console.log(e);
            dispatch(decrypt_mail_error("Mail decryption failed, check your answer"));
            return;
        }
        decryptedEmail = JSON.parse(decryptedEmail);
        decryptedEmail.attachments = externalMail.storedAttachments;
        dispatch(decrypt_mail_success(decryptedEmail, answer));

    };
};

export const decrypt_mail_success = (externalMail, answer) => {
    return {
        type: 'MAIL_DECRYPTED',
        externalMail,
        answer
    }
};

export const decrypt_mail_error = (message) => {
    return {
        type: 'MAIL_DECRYPT_ERROR',
        message
    }
};

export const open_guest_reply = () => {
    return {
        type: 'OPEN_GUEST_REPLY'
    }
};

export const hide_guest_reply = () => {
    return {
        type: 'HIDE_GUEST_REPLY'
    }
};