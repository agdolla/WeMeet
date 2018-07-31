let axios = require('axios');

// var debug = require('react-debug');

export function getSessionId(userid,targetid){
    return axios.get('/getsession/'+userid+'/'+targetid);
}

export function acceptActivityRequest(notificationid,fromuser){
    return axios.put('/acceptactivity/'+notificationid+'/'+fromuser);
}

export function addFriend(sender,target){
    return axios.post('/friendRequest/'+sender+"/"+target,{});
}

export function sendJoinActivityRequest(sender,target,activityid){
    return axios.post('/activityJoinRequest/'+sender+'/'+target+'/'+activityid,{});
}

export function sendInviteActivityRequest(sender,target,activityid){
    return axios.post('/activityInviteRequest/'+sender+'/'+target+'/'+activityid,{});
}
