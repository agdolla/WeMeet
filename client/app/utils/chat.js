let axiosHelper = require('./axiosHelper');


export function getMessages(time,userid,id){
    return axiosHelper.get('/user/'+userid+'/chatsession/'+id+"/"+time);
}

export function postMessage(sessionId, sender, target, text, imgs){
    return axiosHelper.post('/chatsession/'+sessionId,{
        sender:sender,
        target:target,
        text:text,
        imgs:imgs
    });
}
