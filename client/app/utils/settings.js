//xmlhttprequest function
import {sendXHR} from './'


export function changeUserInfo(data, cb){
    sendXHR('PUT','/settings/user/'+data.userId,data,(xhr)=>{
        cb(JSON.parse(xhr.responseText));
    })
}

export function ChangeAvatar(user,img,cb){
    sendXHR('PUT','/settings/avatar/user/'+user,{"img":img},(xhr)=>{
        cb(JSON.parse(xhr.responseText));
    });
}

export function changeEmail(data,cb){
    sendXHR('PUT','/settings/emailChange/user/'+data.userId, data,(xhr)=>{
        cb(JSON.parse(xhr.responseText));
    })
}
