//xmlhttprequest function
import {sendXHR} from './'

export function likePost(feedItemId, user, cb){
    sendXHR('PUT', '/postItem/'+feedItemId+'/likelist/'+user,
    undefined, (xhr)=>{
        cb(JSON.parse(xhr.responseText));
    });
}

export function unLikePost(feedItemId, user, cb){
    sendXHR('DELETE', '/postItem/'+feedItemId+'/likelist/'+user,
    undefined, (xhr)=>{
        cb(JSON.parse(xhr.responseText));
    });
}

export function postComment(feedItemId, author, comment, cb){
    sendXHR('POST','/postItem/'+feedItemId+'/commentThread/comment',{
        author:author,
        text:comment
    },(xhr)=>{
        cb(JSON.parse(xhr.responseText));
    })
}

export function postStatus(user, text, img, cb){
    sendXHR('POST', '/postItem', {
        userId:user,
        text:text,
        img: img
    }, (xhr)=>{
        cb(JSON.parse(xhr.responseText));
    });
}

export function getAllPosts(time,cb){
    // We don't need to send a body, so pass in 'undefined' for the body.
    sendXHR('GET', '/posts/'+time, undefined, (xhr) => {
        // Call the callback with the data.
        cb(JSON.parse(xhr.responseText));
    });
}
