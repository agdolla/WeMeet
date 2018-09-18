const axiosHelper = require("./axiosHelper.js");

export function changeUserInfo(data) {
    return axiosHelper.put("/settings/user/" + data.userId, data);
}

export function ChangeAvatar(user, img) {
    return axiosHelper.put("/settings/avatar/user/" + user, {
        img: img
    });
}

export function changeEmail(userId, data) {
    return axiosHelper.put("/settings/emailChange/user/" + userId, data);
}

export function changePassword(userId, data) {
    return axiosHelper.put("/settings/passChange/user/" + userId, data);
}
