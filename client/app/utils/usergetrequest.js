let axiosHelper = require('./axiosHelper');

export function getNotificationData(user){
    return axiosHelper.get('/user/'+user+'/notification');
}

export function getPostFeedData(user){
    return axiosHelper.get('/user/'+user+'/feed');

}

export function getActivityFeedData(user){
    return axiosHelper.get('/user/' + user + '/activity');
}

export function getUserData(user){
    return axiosHelper.get('/user/'+user);
}

export function getSessions(user){
    return axiosHelper.get('/user/'+user+'/sessions');
}
