let axios = require('axios');

export function getMessages(time,userid,id){
    return axios.get('/user/'+userid+'/chatsession/'+id+"/"+time);
}

export function postMessage(sessionId,sender,target, text){
    return axios.post('/chatsession/'+sessionId,{
        sender:sender,
        target:target,
        text:text
    });
}
