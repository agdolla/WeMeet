let axios = require('axios');

var debug = require('react-debug');

export function getSessionId(userid,targetid,cb){
    axios.get('/getsession/'+userid+'/'+targetid)
    .then((response)=>{
        cb(response.data);
    });
}

export function acceptActivityRequest(notificationid,fromuser,cb){
    axios.put('/acceptactivity/'+notificationid+'/'+fromuser)
    .then(response=>cb(response.data));
}

export function addFriend(sender,target,cb){
    axios.post('/friendRequest/'+sender+"/"+target,{})
    .then(response=>{cb(true)})
    .catch(err=>{cb(false)});
}

export function sendJoinActivityRequest(sender,target,activityid,cb){
    axios.post('/activityJoinRequest/'+sender+'/'+target+'/'+activityid,{})
    .then(response=>{cb(true)})
    .catch(err=>{cb(false)});
}

export function sendInviteActivityRequest(sender,target,activityid,cb){
    axios.post('/activityInviteRequest/'+sender+'/'+target+'/'+activityid,{})
    .then(response=>{cb(true)})
    .catch(err=>{cb(false)});
}
