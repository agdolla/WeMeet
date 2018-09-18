const axiosHelper = require("./axiosHelper.js");

export function getMessages(time, userid, id) {
    return axiosHelper.get(
        "/user/" + userid + "/chatsession/" + id + "/" + time
    );
}

export function getSessionId(userid, targetid) {
    return axiosHelper.get("/getsession/" + userid + "/" + targetid);
}
