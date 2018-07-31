let axios = require('axios');

export function getNotificationData(user){
    return axios.get('/user/'+user+'/notification');
}

export function getPostFeedData(user){
    return axios.get('/user/'+user+'/feed');

}

export function getActivityFeedData(user){
    return axios.get('/user/' + user + '/activity');
}

export function getUserData(user){
    return axios.get('/user/'+user);
}

export function getSessions(user){
    return axios.get('/user/'+user+'/sessions');
}
