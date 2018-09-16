var moment = require('moment');
const axiosHelper = require('./axiosHelper.js');
// let debug = require('react-debug');

export function createActivity(data) {
    return axiosHelper.post('/createActivity', {
        postDate: new Date().getTime(),
        type: data.type,
        author: data.userData._id,
        title: data.title,
        description: data.description,
        img: data.img === null ? "./img/default.png" : data.img,
        startTime: moment(data.startTime).valueOf(),
        endTime: moment(data.endTime).valueOf(),
        location: data.location,
        contents: {
            "text": data.detail
        }
    });
}

export function likeActivity(activityId, user) {
    return axiosHelper.put('/activityItem/' + activityId + '/likelist/' + user);
}

export function unLikeActivity(activityId, user) {
    return axiosHelper.delete('/activityItem/' + activityId + '/likelist/' + user);
}

export function getAllActivities(time) {
    return axiosHelper.get('/activities/' + time)
}

export function getActivityDetail(id) {
    return axiosHelper.get('/activityItem/' + id);
}

export function postActivityDetailComment(activityId, author, comment) {
    return axiosHelper.post('/activityItem/' + activityId + '/commentThread/comment', {
        author: author,
        text: comment
    });
}

export function getActivityItemCommments(activityItemId, date) {
    return axiosHelper.get('/activityItem/' + activityItemId + '/comment/' + date);
}

export function getActivityMessages(activityId, date) {
    return axiosHelper.get('/activityItem/' + activityId + '/messages/' + date);
}

export function acceptActivityRequest(notificationid, fromuser) {
    return axiosHelper.put('/acceptactivity/' + notificationid + '/' + fromuser);
}
