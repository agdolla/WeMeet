//xmlhttprequest function
import {sendXHR} from './'

// var debug = require('react-debug');





export function getSessionId(userid,targetid,cb){
    sendXHR('GET','/getsession/'+userid+'/'+targetid, undefined ,(xhr) => {
        cb(JSON.parse(xhr.responseText));
    });
}

export function acceptActivityRequest(notificationid,fromuser,cb){
    sendXHR('PUT','/acceptactivity/'+notificationid+'/'+fromuser,undefined,(xhr)=>{
        cb(JSON.parse(xhr.responseText));
    })
}

export function addFriend(sender,target,cb){
    sendXHR('POST','/friendRequest/'+sender+"/"+target,undefined,()=>{
        cb(true);
    },()=>{
        cb(false);
    });
}

export function sendJoinActivityRequest(sender,target,activityid,cb){
    sendXHR('POST','/activityJoinRequest/'+sender+'/'+target+'/'+activityid,undefined,()=>{
        cb(true);
    },()=>{
        cb(false);
    })
}

export function sendInviteActivityRequest(sender,target,activityid,cb){
    sendXHR('POST','/activityInviteRequest/'+sender+'/'+target+'/'+activityid,undefined,()=>{
        cb(true);
    },()=>{
        cb(false);
    })
}
