const axios = require('axios');

export function deleteNotification(id, user){
    return axios.delete('/notification/'+id+'/'+user);
}

export function acceptFriendRequest(id,user,cb){
    return axios.put('/notification/'+id+'/'+user);
}
