//credentials function
import {updateCredentials} from './';

//xmlhttprequest function
import {sendXHR} from './'

export function signup(email, username, password, cb) {
    sendXHR('POST', '/signup', { fullname: username,
        email: email,
        password: password }, () => {
            cb(true);
        }, () => {
            cb(false);
        }
    );
}

export function login(email, password, cb) {
    sendXHR('POST', '/login', { email: email, password: password},
    (xhr) => {
        // Success callback: Login succeeded.
        var authData = JSON.parse(xhr.responseText);
        // Update credentials and indicate success via the callback!
        updateCredentials(authData.user, authData.token);
        cb(true);
    }, () => {
        // Error callback: Login failed.
        cb(false);
    });
}
