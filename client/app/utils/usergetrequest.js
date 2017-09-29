//xmlhttprequest function
import {sendXHR} from './'

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
