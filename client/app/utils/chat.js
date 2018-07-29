let axios = require('axios');

export function getMessages(time,userid,id,cb){
    axios.get('/user/'+userid+'/chatsession/'+id+"/"+time)
    .then(response=>cb(response.data));
}

export function postMessage(sessionId,sender,target, text, cb){
    axios.post('/chatsession/'+sessionId,{
        sender:sender,
        target:target,
        text:text
    })
    .then(response=>cb(response.data))
    .catch(err=>{});
}
