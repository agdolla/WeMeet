const axiosHelper = require('./axiosHelper');

export function deleteNotification(id, user){
    return axiosHelper.delete('/notification/'+id+'/'+user);
}

export function acceptFriendRequest(id,user){
    return axiosHelper.put('/notification/'+id+'/'+user);
}
