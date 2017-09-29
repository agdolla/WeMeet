//xmlhttprequest function
import {sendXHR} from './'

//geolocation function
import {getlocation} from './'

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
    getlocation((res)=>{
        sendXHR('POST', '/postItem', {
            userId:user,
            text:text,
            img: img,
            location:res!=="error"&&res.status==="OK" && res.results.length>0 ? res.results[0] : {}
        }, (xhr)=>{
            cb(JSON.parse(xhr.responseText));
        });
    });
}

export function getAllPosts(time,cb){
    // We don't need to send a body, so pass in 'undefined' for the body.
    sendXHR('GET', '/posts/'+time, undefined, (xhr) => {
        // Call the callback with the data.
        cb(JSON.parse(xhr.responseText));
    });
}
