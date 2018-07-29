let axios = require('axios');

export function getNotificationData(user, cb){
    axios.get('/user/'+user+'/notification')
    .then((response)=>cb(response.data));
}

export function getPostFeedData(user, cb){
    axios.get('/user/'+user+'/feed')
    .then((response)=>cb(response.data));

}

export function getActivityFeedData(user,cb){
    axios.get('/user/' + user + '/activity')
    .then((response)=>cb(response.data));
}

export function getUserData(user,cb){
    axios.get('/user/'+user)
    .then((response)=>cb(response.data));
}

export function getSessions(user,cb){
    axios.get('/user/'+user+'/sessions')
    .then((response)=>cb(response.data));
}
