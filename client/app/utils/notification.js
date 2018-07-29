const axios = require('axios');

export function deleteNotification(id, user ,cb){
    axios.delete('/notification/'+id+'/'+user)
    .then(response=>cb(response.data));
}

export function acceptFriendRequest(id,user,cb){
    axios.put('/notification/'+id+'/'+user)
    .then(response=>cb(response.data));
}
