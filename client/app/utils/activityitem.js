var moment = require('moment');
let axios = require('axios');
// let debug = require('react-debug');

export function createActivity(data){
     return axios.post('/createActivity',{
        postDate: new Date().getTime(),
        type: data.type,
        author:data.userData._id,
        title: data.title,
        description:data.description,
        img:data.img === null ? "./img/default.png" : data.img,
        startTime: moment(data.startTime).valueOf(),
        endTime: moment(data.endTime).valueOf(),
        location: data.location,
        contents: {
            "text": data.detail
        }
    });
}

export function likeActivity(activityId, user){
    return axios.put('/activityItem/' + activityId + '/likelist/' + user);
}

export function unLikeActivity(activityId, user){
    return axios.delete('/activityItem/' + activityId +'/likelist/' + user);
}

export function getAllActivities(time){
    return axios.get('/activities/'+time);
}

export function getActivityDetail(id,cb){
    return axios.get('/activityItem/'+id);
}

export function postActivityDetailComment(activityId, author, comment, cb){
    return axios.post('/activityItem/'+activityId+'/commentThread/comment',{
        author:author,
        text:comment
    });
}
