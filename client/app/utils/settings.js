const axios = require('axios');


export function changeUserInfo(data){
    return axios.put('/settings/user/'+data.userId,data);
}

export function ChangeAvatar(user,img){
    return axios.put('/settings/avatar/user/'+user,{
        img:img
    });
}

export function changeEmail(data){
    return axios.put('/settings/emailChange/user/'+data.userId,data);
}
