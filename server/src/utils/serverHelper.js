'use strict';
const Promise = require("bluebird");
const uuidV1 = require('uuid/v1');
const Jimp = require("jimp");
const ObjectID = require('mongodb').ObjectID;

module.exports = class ServerHelper {
    
    constructor(db) {
        this.database = db;
    }

    isLoggedIn(req, res, next) {
        // console.log(req.isAuthenticated());
        if (req.isAuthenticated()){
            return next();
        }
        res.status(401).end();
    }


    getAllPosts(time){
        return new Promise((resolve,reject)=>{
            this.database.collection('postFeedItems').findAsync({
                "contents.postDate":{
                    $lt:time
                }
            })
            .then((cursor)=>{
                return cursor.limit(5).sort({"contents.postDate":-1}).toArrayAsync();
            })
            .then((collection)=>{

                var processNextFeedItem = (i)=>{
                    this.resolvePostItem(collection[i])
                    .then(postItem => {
                        resolvedPosts.push(postItem);
                        if (resolvedPosts.length === collection.length) {
                            return resolve(resolvedPosts);
                        }
                        else{
                            processNextFeedItem(i + 1);
                        }
                    })
                }
                var resolvedPosts = [];
                if (collection.length === 0) {
                    return resolve(collection);
                }
                else{
                    processNextFeedItem(0);
                }
            })
            .catch(err => {
                reject(err);
            })
        })
    }

    resolvePostItem(postFeedItem){
        return new Promise((resolve, reject) =>  {
            var userList = [postFeedItem.contents.author];
            userList = userList.concat(postFeedItem.likeCounter);

            this.resolveUserObjects(userList, (err, userMap)=>{
                if (err)
                    reject(err);
                else {
                    postFeedItem.likeCounter = postFeedItem.likeCounter.map((id) => userMap[id]);
                    postFeedItem.contents.author = userMap[postFeedItem.contents.author];
                    resolve(postFeedItem);
                }
            });
        });
    }

    resolveUserObjects(userList, callback) {
        // Special case: userList is empty.
        // It would be invalid to query the database with a logical OR
        // query with an empty array.
        if (userList.length === 0) {
            callback(null, {});
        }
        else {
            // Build up a Mongothis.database "OR" query to resolve all of the user objects
            // in the userList.
            var query = {
                $or: userList.map((id) => {
                    return {_id: id}
                })
            };
            // Resolve 'like' counter
            this.database.collection('users').findAsync(query)
            .then(cursor=>{
                return cursor.toArrayAsync();
            })
            .then(users=>{
                var userMap = {};
                users.forEach((user) => {
                    delete user.password;
                    delete user.sessions;
                    delete user.friends;
                    delete user.post;
                    delete user.notification;
                    delete user.activity;
                    userMap[user._id] = user;
                });
                callback(null, userMap);
            })
            .catch(err => callback(err))
        }
    }

    getPostFeedItem(feedItemId) {
        return new Promise((resolve, reject) =>  {
            this.database.collection('postFeedItems').findOneAsync({
                _id: feedItemId
            })
            .then(postFeedItem => {
                if (postFeedItem === null) {
                    resolve(null);
                } else {
                    return this.resolvePostItem(postFeedItem)
                }
            })
            .then(postItem =>{
                resolve(postItem);
            })
            .catch(err => {reject(err)})
        });
    }

    getPostComments(postFeedId, date) {
        return this.database.collection('postFeedComments').aggregateAsync([
            {$match: {_id: postFeedId}},
            {$unwind: '$comments'},
            {$match: {'comments.postDate':{$lt:parseInt(date)}}},
            {$sort: {'comments.postDate':-1}},
            {$limit: 3}
        ])
        .then((comments)=>{
            let postComments = comments.map((comment)=>{
                return comment.comments
            });
            return this.resolveComments(postComments);
        })
    }

    resolveComments(comments) {
        return new Promise((resolve, reject)=>{
            var userList = [];
            comments.forEach((comment)=>{
                userList.push(comment.author);
            });

            this.resolveUserObjects(userList, (err, userMap)=>{
                if(err)
                    reject(err);
                else{
                    comments.forEach((comment)=> {
                        comment.author = userMap[comment.author];
                    });
                    resolve(comments);
                }
            });
        })
    }

    getPostFeedData(user) {
        return new Promise((resolve, reject) =>  {
            this.database.collection('users').findOneAsync({
                _id: user
            })
            .then(userData => {
                if (userData === null) {
                    return resolve(null);
                }
                return this.database.collection('postFeeds').findOneAsync({
                    _id: userData.post
                })
            })
            .then((feedData)=>{
                if (feedData === null) {
                    return resolve(null);
                }
                var processNextFeedItem = (i) => {
                    this.getPostFeedItem(feedData.contents[i])
                    .then(feedItem => {
                        resolvedContents.push(feedItem);
                        if (resolvedContents.length === feedData.contents.length) {
                            feedData.contents = resolvedContents;
                            return resolve(feedData);
                        } else {
                            processNextFeedItem(i + 1);
                        }
                    })
                }

                var resolvedContents = [];
                if (feedData.contents.length === 0) {
                    return resolve(feedData);
                }
                else{
                    processNextFeedItem(0);
                }
            })
            .catch(err => {reject(err)})
        });
    }

    postStatus(user, text, img) {
        return new Promise((resolve,reject)=>{
            var time = new Date().getTime();
            //generate unique name
            var name = uuidV1();

            var imgPath = [];

            for (var i = 0; i < img.length; i++) {
                imgPath.push("img/status/"+name+i+".jpg");
            }

            var post = {
                "likeCounter": [],
                "type": "general",
                "contents": {
                    "author": user,
                    "postDate": time,
                    "text": text,
                    "img": imgPath
                },
                "commentsCount": 0
            };

            this.database.collection('postFeedItems').insertOneAsync(post, {
                ordered: true
            })
            .then((result)=>{
                post._id = result.insertedId;
                return this.database.collection("users").findOneAsync({
                    _id: user
                });
            })
            .then((userData)=>{
                return this.database.collection('postFeeds').updateOneAsync({
                    _id: userData.post
                }, {
                    $push: {
                        contents: {
                            $each: [post._id],
                            $position: 0
                        }
                    }
                })
            })
            .then(()=>{
                resolve(post);
                img.forEach((element, index)=>{
                    var buffer = new Buffer.from(element.split(",")[1], 'base64');
                    Jimp.read(buffer)
                    .then(image =>{
                        image.quality(40)
                        .write("../client/build/"+imgPath[index]);
                    })

                });
            })
            .catch(err=>reject(err))
        });
    }

    sendDatabaseError(res, err) {
        res.status(500).send("A database error occurred: " + err);
    }

    getUserData(userId, callback) {
        this.database.collection('users').findOneAsync({
            _id: userId
        })
        .then(userData => {
            if(userData===null){
                callback(null,userData)
            }
            else {
                this.resolveUserObjects(userData.friends, (err, userMap) => {
                    userData.friends = userData.friends.map((id) => userMap[id]);
                    delete userData.password;
                    delete userData.notification;
                    delete userData.post;
                    delete userData.activity;
                    delete userData.sessions;
                    callback(null, userData);
                });
            }
        })
        .catch(err => {callback(err)})
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

    getActivityFeedItem(activityId) {
        return new Promise((resolve, reject)=>{
            this.database.collection('activityItems').findOneAsync({
                _id: activityId
            })
            .then(activityitem=>{
                return this.resolveActivityItem(activityitem)
            })
            .then(resolvedActivityItem=>resolve(resolvedActivityItem))
            .catch(err=>reject(err));
        })
    }

    resolveActivityItem(activityItem){
        return new Promise((resolve, reject)=>{
            var userList = [activityItem.author];
            activityItem.likeCounter.map((id) => userList.push(id));
            activityItem.participants.map((id) => userList.push(id));
            this.resolveUserObjects(userList, function(err, userMap) {
                if (err)
                    reject(err);
    
                activityItem.author = userMap[activityItem.author];
                activityItem.participants = activityItem.participants.map((id) => userMap[id]);
                activityItem.likeCounter = activityItem.likeCounter.map((id) => userMap[id]);
    
                resolve(activityItem);
            });
        })
    }

    getActivityItemComments(activityItemId, date) {
        return this.database.collection('activityItemComments').aggregateAsync([
            {$match: {_id: activityItemId}},
            {$unwind: '$comments'},
            {$match: {'comments.postDate':{$lt:parseInt(date)}}},
            {$sort: {'comments.postDate':-1}},
            {$limit: 3}
        ])
        .then((comments)=>{
            let postComments = comments.map((comment)=>{
                return comment.comments
            });
            return this.resolveComments(postComments);
        })
    }

    getAllActivities(time){
        return new Promise((resolve, reject)=>{
            this.database.collection('activityItems').findAsync({
                postDate:{
                    $lt:time
                }
            })
            .then(cursor =>{
                return cursor.limit(5).sort({postDate:-1}).toArrayAsync();
            })
            .then(collection => {
                var resolvedActivities = [];
    
                var processNextFeedItem = (i) => {
                    // Asynchronously resolve a feed item.
                    this.resolveActivityItem(collection[i])
                    .then(activityItem=>{
                        resolvedActivities.push(activityItem);
                        if (resolvedActivities.length === collection.length) {
                            // I am the final feed item; all others are resolved.
                            // Pass the resolved feed document back to the callback.
                            resolve(collection);
                        } else {
                            // Process the next feed item.
                            processNextFeedItem(i + 1);
                        }
                    })
                    .catch(err=>{
                        reject(err)
                    })
                }
    
                if (collection.length === 0) {
                    resolve(collection);
                } else {
                    processNextFeedItem(0);
                }
            })
            .catch((err)=>{reject(err)});
        })
    }

    getActivityFeedData(userId) {
        return new Promise((resolve, reject)=> {
            this.database.collection('users').findOneAsync({
                _id: userId
            })
            .then(userData =>{
                if (userData === null)
                    reject(null)
                else {
                    return this.database.collection('activities').findOneAsync({
                        _id: userData.activity
                    })
                }
            })
            .then((activity)=>{
                if (activity === null)
                    reject(null);
    
                var resolvedContents = [];
    
                var processNextFeedItem = (i) => {
                    // Asynchronously resolve a feed item.
                    this.getActivityFeedItem(activity.contents[i])
                    .then(feedItem=>{
                        // Success!
                        resolvedContents.push(feedItem);
                        if (resolvedContents.length === activity.contents.length) {
                            // I am the final feed item; all others are resolved.
                            // Pass the resolved feed document back to the callback.
                            activity.contents = resolvedContents;
                            resolve(activity);
                        } else {
                            // Process the next feed item.
                            processNextFeedItem(i + 1);
                        }
                    })
                    .catch(err=>reject(err))
                }
    
                if (activity.contents.length === 0) {
                    resolve(activity);
                } else {
                    processNextFeedItem(0);
                }
            })
            .catch(err => {reject(err)})
        })
    }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    createActivity(data,callback) {

        if(data.img!=="./img/default.png"){
            var name = uuidV1();
            var img = data.img;
            data.img = "img/activity/"+name+'.jpg';
            var buffer = new Buffer.from(img.split(",")[1], 'base64');
            Jimp.read(buffer)
            .then(image => {
                image.quality(30)
                .write("../client/build/img/activity/" + name + ".jpg");
            })
        }
        data.participants=[];
        data.likeCounter=[];
        data.commentsCount = 0;
        data.author = new ObjectID(data.author);
        delete data.cropperOpen;
        this.database.collection('activityItems').insertOneAsync(data)
        .then(result=>{
            data._id=result.insertedId;
        })
        .then(()=>{
            return this.database.collection('users').findOneAsync({_id:new ObjectID(data.author)})
        })
        .then(userData=>{
            this.database.collection('activities').updateOne({_id:userData.activity},{
                $push: {
                    contents: {
                        $each: [data._id],
                        $position: 0
                    }
                }
            });
        })
        .then(()=>{
            callback(null,data);
        })
        .catch(err=>{callback(err);})
    }

    getNotificationItem(notificationId, callback) {
        this.database.collection('notificationItems').findOneAsync({
            _id: notificationId
        })
        .then(notification=>{
            if (notification === null)
            return callback(null, null);
            else {
                var userList = [notification.sender,notification.target];
                this.resolveUserObjects(userList,function(err,userMap){
                    if(err)
                        callback(err);
                    else{
                        notification.sender = userMap[notification.sender];
                        notification.target = userMap[notification.target];
                        callback(null,notification)
                    }
                });
            }
        })
        .catch(err=>callback(err));
    }

    getNotificationData(notificationId, callback) {
        this.database.collection('notifications').findOneAsync({
            _id: notificationId
        })
        .then(notifications=>{
            if (notifications === null) {
                return callback(null, null);
            }
            var resolvedContents = [];

            var processNextFeedItem = (i)=>{
                // Asynchronously resolve a feed item.
                this.getNotificationItem(notifications.contents[i], function(err, notification) {
                    if (err) {
                        // Pass an error to the callback.
                        callback(err);
                    } else {
                        // Success!
                        resolvedContents.push(notification);
                        if (resolvedContents.length === notifications.contents.length) {
                            // I am the final feed item; all others are resolved.
                            // Pass the resolved feed document back to the callback.
                            notifications.contents = resolvedContents;
                            callback(null, notifications);
                        } else {
                            // Process the next feed item.
                            processNextFeedItem(i + 1);
                        }
                    }
                });
            }

            if (notifications.contents.length === 0) {
                callback(null, notifications);
            } else {
                processNextFeedItem(0);
            }
        })
        .catch(err=>callback(err));
    }

    deleteNotification(notificationId, userId, callback) {
        this.database.collection('users').findOneAsync({
            _id: userId
        })
        .then(userData=>{
            if (userData === null)
            return callback(null, null);
            else {
                this.database.collection('notifications').updateOneAsync({
                    _id: userData.notification
                }, {
                    $pull: {
                        contents: notificationId
                    }
                });
                return userData;
            }
        })
        .then((userData)=>{
            this.database.collection('notificationItems').removeAsync({
                _id: notificationId
            });
            return userData;
        })
        .then(userData=>{
            this.getNotificationData(userData.notification, (err, notificationData) => {
                if (err)
                    return callback(err);
                else {
                    return callback(null, notificationData);
                }
            });
        })
        .catch(err=>callback(err));
    }

    getMessage(time,sessionId, cb) {
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
                    this.resolveUserObjects(userList, function(err, userMap) {
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