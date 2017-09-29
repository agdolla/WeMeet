var moment = require('moment');

//xmlhttprequest function
import {sendXHR} from './'



export function createActivity(data,cb){
    sendXHR('POST','/postActivity',{
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
    }
    , (xhr) => {
        cb(JSON.parse(xhr.responseText));
    });

}

export function likeActivity(activityId, user, cb){
    sendXHR('PUT', '/activityItem/' + activityId + '/likelist/' + user,
    undefined, (xhr) => {
        cb(JSON.parse(xhr.responseText));
    });
}

export function unLikeActivity(activityId, user, cb){
    sendXHR('DELETE', '/activityItem/' + activityId +'/likelist/' + user,
    undefined, (xhr) => {
        cb(JSON.parse(xhr.responseText));
    });
}

export function getAllActivities(time,cb){
    // We don't need to send a body, so pass in 'undefined' for the body.
    sendXHR('GET', '/activities/'+time, undefined, (xhr) => {
        // Call the callback with the data.
        cb(JSON.parse(xhr.responseText));
    });
}

export function getActivityDetail(id,cb){
    sendXHR('GET','/activityItem/'+id, undefined, (xhr) => {
        cb(JSON.parse(xhr.responseText));
    });
}

export function adpostComment(activityId, author, comment, cb){
    sendXHR('POST','/activityItem/'+activityId+'/commentThread/comment',{
        author:author,
        text:comment
    },(xhr)=>{
        cb(JSON.parse(xhr.responseText));
    })
}
