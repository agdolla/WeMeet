'use strict'
const Promise = require("bluebird");
let ServerHelper = require('./serverHelper');

module.exports = class ChatHelper {
    constructor(db) {
        this.database = db;
        this.serverHelper = new ServerHelper(db);
    }

    getSessions(userId) {
        return new Promise((resolve,reject)=>{
            this.database.collection('users').findOneAsync({
                _id: userId
            })
            .then(userData => {
                if(userData===null){
                    resolve(null)
                }
                else {
                    this.resolveSessionObject(userData.sessions)
                    .then(sessionMap => {
                        var sessions = userData.sessions.map((id) => sessionMap[id]);
                        resolve(sessions);
                    })
                }
            })
            .catch(err => {reject(err)})
        })
    }

    resolveSessionObject(sessionList) {
        return new Promise((resolve, reject) =>  {
            if (sessionList.length === 0) {
                resolve({});
            } else {
                var query = {
                    $or: sessionList.map((id) => {
                        return {_id: id}
                    })
                };
                // Resolve 'like' counter
                this.database.collection('messageSession').findAsync(query)
                .then(cursor => {
                    return cursor.toArrayAsync();
                })
                .then(sessions => {
                    var sessionMap = {};
                    sessions.forEach((session) => {
                        sessionMap[session._id] = session;
                    });
                    resolve(sessionMap);
                })
                .catch(err => {reject(err)});
            }
        });
    }

    getMessage(time, sessionId, cb) {
        this.database.collection('message').aggregate([
            {$match: { _id: sessionId}},
            {$unwind: "$messages"},
            {$match:{"messages.date":{$lt:parseInt(time)}}},
            {$sort:{"messages.date":-1}},
            {$limit:10}
        ],(err,messages)=>{
            if (err) {
                return cb(err);
            } else {
                if(messages.length===0){
                    cb(null,messages);
                }
                else{
                    var resultMsgs = messages.map((message)=>{
                        return message.messages;
                    })
                    resultMsgs = resultMsgs.reverse();
                    var userList = [resultMsgs[0].sender, resultMsgs[0].target];
                    this.serverHelper.resolveUserObjects(userList, function(err, userMap) {
                        if (err)
                            return cb(err);
                        resultMsgs.forEach((message) => {
                            message.target = userMap[message.target];
                            message.sender = userMap[message.sender];
                        });
                        cb(null, resultMsgs);
                    })
                }
            }
        });
    }

    getSession(userid, targetid) {
        return new Promise((resolve,reject)=>{
            this.database.collection("messageSession").findOneAsync({
                users: {
                    $all: [userid, targetid]
                }
            })
            .then(session=>{
                resolve(session);
            })
            .catch(err=>reject(err));
        })
    }

    getSessionContentsID(sessionid, cb) {
        this.database.collection("messageSession").findOneAsync({
            _id: sessionid
        })
        .then(session=>{
            cb(null, session.contents);
        })
        .catch(err=>cb(err));
    }

    createSession(userid, targetid, cb){
        this.database.collection("message").insertOneAsync({
            messages:[]
        })
        .then(message=>{
            var newSession = {
                users : [userid, targetid],
                contents: message.insertedId,
                lastmessage : {}
            };
            return newSession;
        })
        .then(newSession=>{
            this.database.collection("messageSession").insertOneAsync(newSession)
            .then(messageSession=>{
                this.database.collection("users").updateMany({
                    $or:[
                        {_id:userid},
                        {_id:targetid}
                    ]
                },{$addToSet:{
                    sessions: messageSession.insertedId
                }},function(err){
                    if(err)
                    cb(err)
                    else{
                        cb(null,newSession);
                    }
                })
            })
            .catch(err=>cb(err));
        })
        .catch(err=>cb(err));
    }
}