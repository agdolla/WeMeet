"use strict";
const Promise = require("bluebird");
let ServerHelper = require("./serverHelper");
let uuidV1 = require("uuid/v1");
let Jimp = require("jimp");

module.exports = class ChatHelper {
    constructor(db) {
        this.database = db;
        this.serverHelper = new ServerHelper(db);
    }

    getSessions(userId) {
        return new Promise((resolve, reject) => {
            this.database
                .collection("users")
                .findOneAsync({
                    _id: userId
                })
                .then(userData => {
                    if (userData === null) {
                        resolve(null);
                    } else {
                        this.resolveSessionObject(
                            userData.sessions,
                            userId
                        ).then(sessionMap => {
                            var sessions = userData.sessions.map(
                                id => sessionMap[id]
                            );
                            resolve(sessions);
                        });
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    postMessage(senderId, targetId, sessionId, date, message, imgs) {
        return new Promise((resolve, reject) => {
            let name = uuidV1();
            var imgPath = [];
            for (var i = 0; i < imgs.length; i++) {
                imgPath.push("img/chat/" + name + i + ".jpg");
            }
            var lastmessage = {
                sender: senderId,
                date: date,
                text: message,
                imgs: imgPath
            };
            this.getSessionContentsID(sessionId, (err, contentsId) => {
                if (err) reject(err);
                else {
                    this.database
                        .collection("message")
                        .updateOneAsync(
                            {
                                _id: contentsId
                            },
                            {
                                $push: {
                                    messages: lastmessage
                                }
                            }
                        )
                        .then(() => {
                            this.database
                                .collection("messageSession")
                                .findAndModifyAsync(
                                    { _id: sessionId },
                                    [],
                                    {
                                        $set: {
                                            lastmessage: lastmessage,
                                            ["unread." + senderId]: 0
                                        },
                                        $inc: { ["unread." + targetId]: 1 }
                                    },
                                    { new: true }
                                )
                                .then(updatedSession => {
                                    let updatedSessionData =
                                        updatedSession.value;
                                    resolve(updatedSessionData);
                                    imgs.forEach((img, idx) => {
                                        var buffer = new Buffer.from(
                                            img.split(",")[1],
                                            "base64"
                                        );
                                        Jimp.read(buffer).then(image => {
                                            image
                                                .quality(50)
                                                .write(
                                                    "../client/build/" +
                                                        imgPath[idx]
                                                );
                                        });
                                    });
                                });
                        })
                        .catch(err => reject(err));
                }
            });
        });
    }

    resolveSessionObject(sessionList, userId) {
        return new Promise((resolve, reject) => {
            if (sessionList.length === 0) {
                resolve({});
            } else {
                var query = {
                    $or: sessionList.map(id => {
                        return { _id: id };
                    })
                };
                this.database
                    .collection("messageSession")
                    .findAsync(query)
                    .then(cursor => {
                        return cursor.toArrayAsync();
                    })
                    .then(sessions => {
                        var sessionMap = {};
                        sessions.forEach(session => {
                            sessionMap[session._id] = session;
                        });
                        resolve(sessionMap);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }
        });
    }

    getMessage(time, sessionId) {
        return new Promise((resolve, reject) => {
            this.database
                .collection("message")
                .aggregateAsync([
                    { $match: { _id: sessionId } },
                    { $unwind: "$messages" },
                    { $match: { "messages.date": { $lt: parseInt(time) } } },
                    { $sort: { "messages.date": -1 } },
                    { $limit: 10 }
                ])
                .then(cursor => {
                    return cursor.toArray();
                })
                .then(messages => {
                    if (messages.length === 0) {
                        resolve(messages);
                    } else {
                        var resultMsgs = messages.map(message => {
                            return message.messages;
                        });
                        resultMsgs = resultMsgs.reverse();
                        // var userList = [resultMsgs[0].sender, resultMsgs[0].target];
                        // this.serverHelper.resolveUserObjects(userList, (err, userMap)=>{
                        //     if (err)
                        //         reject(err);
                        //     resultMsgs.forEach((message) => {
                        //         message.target = userMap[message.target];
                        //         message.sender = userMap[message.sender];
                        //     });
                        // })
                        resolve(resultMsgs);
                    }
                })
                .catch(err => reject(err));
        });
    }

    getSession(userid, targetid) {
        return new Promise((resolve, reject) => {
            this.database
                .collection("messageSession")
                .findOneAsync({
                    users: {
                        $all: [userid, targetid]
                    }
                })
                .then(session => {
                    resolve(session);
                })
                .catch(err => reject(err));
        });
    }

    getSessionContentsID(sessionid, cb) {
        this.database
            .collection("messageSession")
            .findOneAsync({
                _id: sessionid
            })
            .then(session => {
                cb(null, session.contents);
            })
            .catch(err => cb(err));
    }

    createSession(userid, targetid) {
        return new Promise((resolve, reject) => {
            this.database
                .collection("message")
                .insertOneAsync({
                    messages: []
                })
                .then(message => {
                    var newSession = {
                        users: [userid, targetid],
                        contents: message.insertedId,
                        lastmessage: {},
                        unread: {
                            [userid.toString()]: 0,
                            [targetid.toString(0)]: 0
                        }
                    };
                    return newSession;
                })
                .then(newSession => {
                    return new Promise((resolve, reject) => {
                        this.database
                            .collection("messageSession")
                            .insertOneAsync(newSession)
                            .then(messageSession => {
                                return this.database
                                    .collection("users")
                                    .updateManyAsync(
                                        {
                                            $or: [
                                                { _id: userid },
                                                { _id: targetid }
                                            ]
                                        },
                                        {
                                            $addToSet: {
                                                sessions:
                                                    messageSession.insertedId
                                            }
                                        }
                                    );
                            })
                            .then(() => {
                                resolve(newSession);
                            })
                            .catch(err => reject(err));
                    });
                })
                .then(sessionResult => {
                    resolve(sessionResult);
                })
                .catch(err => reject(err));
        });
    }
};
