//credentials function
import {updateCredentials} from './';
import {socket} from './';
//xmlhttprequest function
import {sendXHR} from './';

// let debug = require('react-debug');

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
        //let server know this user is online
        socket.emit('user',authData.user._id);
        cb(true);
    }, () => {
        // Error callback: Login failed.
        cb(false);
    });
}
