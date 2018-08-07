import {updateCredentials} from './';
import {socket} from './';
const axiosHelper = require('./axiosHelper');
// let debug = require('react-debug');

export function signup(email, username, password, cb) {
    axiosHelper.post('/signup',{
        fullname: username,
        email: email,
        password: password
    })
    .then(response=>cb(true))
    .catch(err=>cb(false));
}

export function login(email, password, cb) {
    axiosHelper.post('/login',{
        email: email,
        password: password
    })
    .then(response=>{
        // Success callback: Login succeeded.
        var authData = response.data;
        // Update credentials and indicate success via the callback!
        updateCredentials(authData.user);
        //let server know this user is online
        socket.emit('user',authData.user._id);
        cb(true);
    })
    .catch(err=>cb(false));
}
