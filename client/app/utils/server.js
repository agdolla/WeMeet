var moment = require('moment');
var swal = require('sweetalert');

//credentials function
import {updateCredentials,logout} from './';


//xmlhttprequest function
import {sendXHR} from './'

// var debug = require('react-debug');




export function acceptActivityRequest(notificationid,fromuser,cb){
    sendXHR('PUT','/acceptactivity/'+notificationid+'/'+fromuser,undefined,(xhr)=>{
        cb(JSON.parse(xhr.responseText));
    })
}

export function getNotificationData(user, cb){
    sendXHR('GET','/user/'+user+'/notification',undefined,(xhr)=>{
        cb(JSON.parse(xhr.responseText));
    });
}



export function getPostFeedData(user, cb){
    // We don't need to send a body, so pass in 'undefined' for the body.
    sendXHR('GET', '/user/'+user+'/feed', undefined, (xhr) => {
        // Call the callback with the data.
        cb(JSON.parse(xhr.responseText));
    });

}

export function getActivityFeedData(user,cb){
    // We don't need to send a body, so pass in 'undefined' for the body.
    sendXHR('GET', '/user/' + user + '/activity', undefined, (xhr) => {
        // Call the callback with the data.
        cb(JSON.parse(xhr.responseText));
    });
}



export function getUserData(user,cb){
    sendXHR('GET','/user/'+user,undefined,(xhr)=>{
        cb(JSON.parse(xhr.responseText));
    })
}

export function getSessions(user,cb){
    sendXHR('GET','/user/'+user+'/sessions',undefined,(xhr)=>{
        cb(JSON.parse(xhr.responseText));
    })
}


export function getMessages(time,userid,id,cb){
    sendXHR('GET','/user/'+userid+'/chatsession/'+id+"/"+time, undefined, (xhr) => {
        cb(JSON.parse(xhr.responseText));
    });
}

export function postMessage(sessionId,sender,target, text, cb){
    sendXHR('POST','/chatsession/'+sessionId,{
        sender:sender,
        target:target,
        text:text
    },(xhr)=>{
        cb(JSON.parse(xhr.responseText));
    })
}

export function getSessionId(userid,targetid,cb){
    sendXHR('GET','/getsession/'+userid+'/'+targetid, undefined ,(xhr) => {
        cb(JSON.parse(xhr.responseText));
    });
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
