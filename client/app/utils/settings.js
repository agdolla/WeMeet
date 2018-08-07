const axiosHelper = require('./axiosHelper');


export function changeUserInfo(data){
    return axiosHelper.put('/settings/user/'+data.userId,data);
}

export function ChangeAvatar(user,img){
    return axiosHelper.put('/settings/avatar/user/'+user,{
        img:img
    });
}

export function changeEmail(data){
    return axiosHelper.put('/settings/emailChange/user/'+data.userId,data);
}
