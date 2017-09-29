//xmlhttprequest function
import {sendXHR} from './'


export function deleteNotification(id, user ,cb){
    sendXHR('DELETE','/notification/'+id+'/'+user,undefined,(xhr)=>{
        cb(JSON.parse(xhr.responseText));
    });
}

export function acceptFriendRequest(id,user,cb){
    sendXHR('PUT','/notification/'+id+'/'+user,undefined,(xhr)=>{
        cb(JSON.parse(xhr.responseText));
    });
}
