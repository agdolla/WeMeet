let axiosHelper = require('./axiosHelper');

// var debug = require('react-debug');

export function getSessionId(userid,targetid){
    return axiosHelper.get('/getsession/'+userid+'/'+targetid);
}

export function acceptActivityRequest(notificationid,fromuser){
    return axiosHelper.put('/acceptactivity/'+notificationid+'/'+fromuser);
}

export function addFriend(sender,target){
    return axiosHelper.post('/friendRequest/'+sender+"/"+target,{});
}

export function sendJoinActivityRequest(sender,target,activityid){
    return axiosHelper.post('/activityJoinRequest/'+sender+'/'+target+'/'+activityid,{});
}

export function sendInviteActivityRequest(sender,target,activityid){
    return axiosHelper.post('/activityInviteRequest/'+sender+'/'+target+'/'+activityid,{});
}
