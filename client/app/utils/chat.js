//xmlhttprequest function
import {sendXHR} from './'


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
