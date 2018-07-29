const axios = require('axios');


export function changeUserInfo(data, cb){
    axios.put('/settings/user/'+data.userId,data)
    .then(response=>cb(response.data));
}

export function ChangeAvatar(user,img,cb){
    axios.put('/settings/avatar/user/'+user,{
        img:img
    })
    .then(response=>cb(response.data));
}

export function changeEmail(data,cb){
    axios.put('/settings/emailChange/user/'+data.userId,data)
    .then(response=>cb(response.data));
}
