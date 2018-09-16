let axiosHelper = require('./axiosHelper');

export function getNotificationData(user) {
    return axiosHelper.get('/user/' + user + '/notification');
}

export function getPostFeedData(user, count) {
    return axiosHelper.get('/user/' + user + '/feed/' + count);

}

export function getActivityFeedData(user, count) {
    return axiosHelper.get('/user/' + user + '/activity/' + count);
}

export function getUserData(user) {
    return axiosHelper.get('/user/' + user);
}

export function getSessions(user) {
    return axiosHelper.get('/user/' + user + '/sessions');
}
