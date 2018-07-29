var moment = require('moment');
let axios = require('axios');
// let debug = require('react-debug');

export function createActivity(data,cb){
    axios.post('/createActivity',{
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
    })
    .then(response=>{
        cb(response.data);
    });
}

export function likeActivity(activityId, user, cb){
    axios.put('/activityItem/' + activityId + '/likelist/' + user)
    .then((response=>cb(response.data)));
}

export function unLikeActivity(activityId, user, cb){
    axios.delete('/activityItem/' + activityId +'/likelist/' + user)
    .then(response=>cb(response.data));
}

export function getAllActivities(time,cb){
    axios.get('/activities/'+time)
    .then((response)=>cb(response.data));
}

export function getActivityDetail(id,cb){
    axios.get('/activityItem/'+id)
    .then((response)=>cb(response.data));
}

export function adpostComment(activityId, author, comment, cb){
    axios.post('/activityItem/'+activityId+'/commentThread/comment',{
        author:author,
        text:comment
    })
    .then(response=>cb(response.data));
}
