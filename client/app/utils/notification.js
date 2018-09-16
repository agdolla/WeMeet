const axiosHelper = require('./axiosHelper.js');

export function deleteNotification(id, user) {
    return axiosHelper.delete('/notification/' + id + '/' + user);
}

export function acceptFriendRequest(id, user) {
    return axiosHelper.put('/notification/' + id + '/' + user);
}

export function hasNewNotification(userId) {
    return axiosHelper.get('/newNotification/' + userId);
}
