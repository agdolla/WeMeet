import {updateCredentials} from './';
import {socket} from './';
let axios = require('axios');
// let debug = require('react-debug');

export function signup(email, username, password, cb) {
    axios.post('/signup',{
        fullname: username,
        email: email,
        password: password
    })
    .then(response=>cb(true))
    .catch(err=>cb(false));
}

export function login(email, password, cb) {
    axios.post('/login',{
        email: email,
        password: password
    })
    .then(response=>{
        // Success callback: Login succeeded.
        var authData = response.data;
        // Update credentials and indicate success via the callback!
        updateCredentials(authData.user, authData.token);
        //let server know this user is online
        socket.emit('user',authData.user._id);
        cb(true);
    })
    .catch(err=>cb(false));
}
