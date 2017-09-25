// Imports the express Node module.
var express = require('express');
var compression = require('compression');
// Creates an Express server.
var app = express();
var http = require('http');
// var https = require('https');
var bodyParser = require('body-parser');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs'));
var uuidV1 = require('uuid/v1');
var Jimp = require("jimp");
var MongoDB = Promise.promisifyAll(require('mongodb'));
var MongoClient = MongoDB.MongoClient;
var ObjectID = MongoDB.ObjectID;
var url = 'mongodb://localhost:27017/Upao';
var bcrypt = Promise.promisifyAll(require('bcryptjs'));
var jwt = require('jsonwebtoken');
var mcache = require('memory-cache');
var cookieSession = require('cookie-session')
var passport = require('passport');
var cookieParser = require('cookie-parser')
var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
// var privateKey = fs.readFileSync(path.join(__dirname, 'wemeet.key'));
// var certificate = fs.readFileSync(path.join(__dirname, 'wemeet.crt'));
var secretKey = `2f862fc1c64e437b86cef1373d3a3f8248ab4675220b3afab1c5ea97e
fda064351da14375118884b463b47a4c0699f67aed0094f339998f102d99bdfe479dbefae0
6933592c86abd20c5447a5f9af1b275c909de4108ae2256bcb0285daad0aa890171849fb3c
a332ca4da03fc80b9228f56cad935b6b9fd33ce6437a4b1f96648546a122a718720452b7cf
38acc120c64b4a1622399bd6984460e4f4387db1a164c6dd4c80993930c57444905f6b46e7
a7f1dba60f898302c4865cfee74b82517852e5bd5890a547d59071319b5dfc0faa92ce4f01
f090e49cab2422031b17ea54a7c4b660bf491d7b47343cdf6042918669d7df54e7d3a1be6e9a571be9aef`;
app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({limit: '2mb', extended: true}));
app.use(compression());
var cache = (duration) => {
    return (req, res, next) => {
        var key = '__express__' + req.originalUrl || req.url
        var cachedBody = mcache.get(key);
        if (cachedBody) {
            res.send(cachedBody);
            return;
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body);
            }
            next()
        }
    }
}

function isLoggedIn(req, res, next) {
    // console.log(req.isAuthenticated());
    if (req.isAuthenticated()){
        return next();
    }
    res.status(401).end();
}

MongoClient.connect(url, function(err, db) {
    if(err){
        console.log("mongodb err: "+err)
    }
    app.use(bodyParser.json());
    app.use(bodyParser.text());
    app.use(cookieParser());
    app.use(express.static('../client/build'));
    app.use(cookieSession({
        name: 'session',
        keys: [secretKey],
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    //schemas
    var statusUpdateSchema = require('./schemas/statusUpdate.json');
    var commentSchema = require('./schemas/comment.json');
    var userInfoSchema = require('./schemas/userInfo.json');
    var emailChangeSchema = require('./schemas/emailChange.json');
    var activitySchema = require('./schemas/activity.json');
    var userSchema = require('./schemas/user.json');
    var loginSchema = require('./schemas/login.json');
    var validate = require('express-jsonschema').validate;

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        db.collection('users').findOneAsync(new ObjectID(id))
        .then(user=>{
            done(null, user);
        })
        .catch(err=>{
            done(err);
        });
    });

    passport.use('signup', new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback : true
    },function(req, username, password, done) {
        process.nextTick(function() {
            var user = req.body;
            var password = user.password;
            var email = user.email.trim().toLowerCase();
            if(!validateEmail(email)){
                return done(null,false);
            }
            user.email = email;
            bcrypt.hashAsync(password,10)
            .then(hash=>{
                user.password = hash;
                user.nickname = "";
                user.avatar = "img/user.png";
                user.description = "";
                user.location = null;
                user.friends = [new ObjectID("000000000000000000000001")];
                user.sessions = [];
                user.birthday = 147812931;
                user.online = false;
                return user;
            })
            .then(user=>{
                Promise.join(
                    db.collection('users').insertOneAsync(user),
                    db.collection('postFeeds').insertOneAsync({contents:[]}),
                    db.collection('notifications').insertOneAsync({contents:[]}),
                    db.collection('activities').insertOneAsync({contents:[]}),
                    function(user,post,noti,act){
                        db.collection('users').updateOneAsync({_id:new ObjectID("000000000000000000000001")},{
                            $addToSet:{
                                friends:user.insertedId
                            }
                        });
                        db.collection('users').updateOneAsync({_id:user.insertedId},{
                            $set: {
                                activity:act.insertedId,
                                notification: noti.insertedId,
                                post:post.insertedId
                            }
                        });
                        return done(null,user.insertedId);
                    })
                })
                .catch(err=>{done(err)})
            });
        })
    );

    passport.use('login',new localStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },function(req,email,password,done){
        email.trim().toLowerCase();
        db.collection('users').findOneAsync({email:email})
        .then(user=>{
            if(user===null){
                return done(null,false);
            }
            else{
                bcrypt.compareAsync(password,user.password)
                .then(success=>{
                    if(success){
                        jwt.sign({
                            id:user._id
                        },secretKey,{expiresIn:'1 day'},function(token){
                            var newUserObj = {}
                            newUserObj._id = user._id;
                            newUserObj.avatar = user.avatar;
                            newUserObj.fullname = user.fullname;
                            newUserObj.friends = user.friends;
                            return done(null,newUserObj,{
                                user:newUserObj,
                                token:token
                            })
                        });
                    }
                    else{
                        return done(null,false);
                    }
                })
            }
        })
        .catch(err=>{done(err)})
    }));

    passport.use('facebook', new facebookStrategy(
        {
            clientID        : '228542127549383',
            clientSecret    : 'de414785354473b5715fa05dab6dae86',
            callbackURL     : 'http://localhost:3000/auth/facebook/callback',
            profileFields: ['id', 'displayName', 'link', 'photos', 'emails']
        }
        ,function(token, refreshToken, profile, done){
            db.collection('users').findOneAsync({facebookID: profile.id})
            .then(user=>{
                if(user===null){
                    user = {};
                    user.fullname = profile.displayName;
                    user.email = profile.emails===undefined?"":profile.emails[0].value;
                    user.nickname = "";
                    user.avatar = "https://graph.facebook.com/"+profile.id+"/picture?type=large";
                    user.description = "";
                    user.location = null;
                    user.friends = [new ObjectID("000000000000000000000001")];
                    user.sessions = [];
                    user.birthday = 147812931;
                    user.online = false;
                    user.facebookID = profile.id;
                    Promise.join(
                        db.collection('users').insertOneAsync(user),
                        db.collection('postFeeds').insertOneAsync({contents:[]}),
                        db.collection('notifications').insertOneAsync({contents:[]}),
                        db.collection('activities').insertOneAsync({contents:[]}),
                        function(userAsync,post,noti,act){
                            db.collection('users').updateOneAsync({_id:new ObjectID("000000000000000000000001")},{
                                $addToSet:{
                                    friends:userAsync.insertedId
                                }
                            });
                            db.collection('users').updateOneAsync({_id:userAsync.insertedId},{
                                $set: {
                                    activity:act.insertedId,
                                    notification: noti.insertedId,
                                    post:post.insertedId
                                }
                            });
                            jwt.sign({
                                id:userAsync.insertedId
                            },secretKey,{expiresIn:'1 day'},function(token){
                                var newUserObj = {}
                                newUserObj._id = userAsync.insertedId;
                                newUserObj.avatar = encodeURIComponent(user.avatar);
                                newUserObj.fullname = user.fullname;
                                newUserObj.friends = user.friends;
                                return done(null,newUserObj,{
                                    user:newUserObj,
                                    token:token
                                });
                            });
                        });
                    }
                    else{
                        jwt.sign({
                            id:user._id
                        },secretKey,{expiresIn:'1 day'},function(token){
                            var newUserObj = {}
                            newUserObj._id = user._id;
                            newUserObj.fullname = user.fullname;
                            newUserObj.avatar = encodeURIComponent(user.avatar);
                            newUserObj.friends = user.friends;
                            return done(null,newUserObj,{
                                user:newUserObj,
                                token:token
                            });
                        });
                    }
                })
                .catch(err=>{done(err)});
            }
        )
    )

    function getAllPosts(time){
        return new Promise((resolve,reject)=>{
            db.collection('postFeedItems').findAsync({
                "contents.postDate":{
                    $lt:time
                }
            })
            .then(function(cursor){
                return cursor.limit(5).sort({"contents.postDate":-1}).toArrayAsync();
            })
            .then(function(collection){

                var resolvedPosts = [];
                if (collection.length === 0) {
                    return resolve(collection);
                }
                else{
                    processNextFeedItem(0);
                }
                function processNextFeedItem(i) {
                    resolvePostItem(collection[i])
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
            })
            .catch(err => {
                reject(err);
            })
        })
    }


    //get post feed data
    function getPostFeedItem(feedItemId) {
        return new Promise(function(resolve, reject) {
            db.collection('postFeedItems').findOneAsync({
                _id: feedItemId
            })
            .then(postFeedItem => {
                if (postFeedItem === null) {
                    resolve(null);
                } else {
                    return resolvePostItem(postFeedItem)
                }
            })
            .then(postItem =>{
                resolve(postItem);
            })
            .catch(err => {reject(err)})
        });
    }

    function getPostFeedData(user) {
        return new Promise(function(resolve, reject) {
            db.collection('users').findOneAsync({
                _id: user
            })
            .then(userData => {
                if (userData === null) {
                    return resolve(null);
                }
                return db.collection('postFeeds').findOneAsync({
                    _id: userData.post
                })
            })
            .then((feedData)=>{
                if (feedData === null) {
                    return resolve(null);
                }

                var resolvedContents = [];
                if (feedData.contents.length === 0) {
                    return resolve(feedData);
                }
                else{
                    processNextFeedItem(0);
                }
                function processNextFeedItem(i) {
                    getPostFeedItem(feedData.contents[i])
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
            })
            .catch(err => {reject(err)})
        });
    }

    app.get('/user/:userId/feed',cache(10),isLoggedIn,function(req, res) {
        var userId = req.params.userId;
        getPostFeedData(new ObjectID(userId))
        .then(feedData => {
            if (feedData === null) {
                res.status(400);
                res.send("Could not look up feed for user " + userId);
            } else {
                res.send(feedData);
            }
        })
        .catch(err => {sendDatabaseError(res,err)})

    });

    function postStatus(user, text, location, img) {
        return new Promise(function(resolve,reject){
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
                    "img": imgPath,
                    "location": location
                },
                "comments": []
            };

            db.collection('postFeedItems').insertOneAsync(post, {
                ordered: true
            })
            .then(function(result) {
                post._id = result.insertedId;
                return db.collection("users").findOneAsync({
                    _id: user
                });
            })
            .then(function(userData) {
                return db.collection('postFeeds').updateOneAsync({
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
            .then(function(){
                resolve(post);
                img.forEach(function(element, index) {
                    var buffer = new Buffer(element.split(",")[1], 'base64');
                    Jimp.read(buffer)
                    .then(image =>{
                        image.quality(30)
                        .write("../client/build/"+imgPath[index]);
                    })

                });
            })
            .catch(function(err){
                reject(err);
            })
        });
    }
    //create post
    app.post('/postItem', validate({body: statusUpdateSchema}), isLoggedIn,function(req, res) {
        var body = req.body;
        if(body.userId.str!==req.user._id.str) return res.status(401).end();
        postStatus(new ObjectID(body.userId), body.text, body.location, body.img)
        .then(function(newPost){
            res.status(201);
            res.send(newPost);
        })
        .catch(err => {
            sendDatabaseError(res, err);
        })
    });

    //like post
    app.put('/postItem/:postItemId/likelist/:userId', isLoggedIn,function(req, res) {
        var postItemId = req.params.postItemId;
        var userId = req.params.userId;
        db.collection('postFeedItems').updateOneAsync({
            _id: new ObjectID(postItemId)
        }, {
            $addToSet: {
                likeCounter: new ObjectID(userId)
            }
        })
        .then(function(){
            return getPostFeedItem(new ObjectID(postItemId))
        })
        .then(postItem => {
            res.send(postItem.likeCounter);
        })
        .catch(function(err){
            sendDatabaseError(res, err);
        })
    });

    //unlike post
    app.delete('/postItem/:postItemId/likelist/:userId', isLoggedIn,function(req, res) {
        var postItemId = req.params.postItemId;
        var userId = req.params.userId;
        db.collection('postFeedItems').updateOneAsync({
            _id: new ObjectID(postItemId)
        }, {
            $pull: {
                likeCounter: new ObjectID(userId)
            }
        })
        .then(function(){
            return getPostFeedItem(new ObjectID(postItemId))
        })
        .then(postItem => {
            res.send(postItem.likeCounter);
        })
        .catch(function(err){
            sendDatabaseError(res, err);
        })
    });

    function resolveUserObjects(userList, callback) {
        // Special case: userList is empty.
        // It would be invalid to query the database with a logical OR
        // query with an empty array.
        if (userList.length === 0) {
            callback(null, {});
        }
        else {
            // Build up a MongoDB "OR" query to resolve all of the user objects
            // in the userList.
            var query = {
                $or: userList.map((id) => {
                    return {_id: id}
                })
            };
            // Resolve 'like' counter
            db.collection('users').findAsync(query)
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
                    delete user.location;
                    userMap[user._id] = user;
                });
                callback(null, userMap);
            })
            .catch(err => callback(err))
        }
    }

    function resolveSessionObject(sessionList) {
        return new Promise(function(resolve, reject) {
            if (sessionList.length === 0) {
                resolve({});
            } else {
                var query = {
                    $or: sessionList.map((id) => {
                        return {_id: id}
                    })
                };
                // Resolve 'like' counter
                db.collection('messageSession').findAsync(query)
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

    /**
    * Helper function: Sends back HTTP response with error code 500 due to
    * a database error.
    */
    function sendDatabaseError(res, err) {
        res.status(500).send("A database error occurred: " + err);
    }

    function getUserData(userId, callback) {
        db.collection('users').findOneAsync({
            _id: userId
        })
        .then(userData => {
            if(userData===null){
                callback(null,userData)
            }
            else {
                resolveUserObjects(userData.friends, function(err, userMap) {
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

    function getSessions(userId) {
        return new Promise(function(resolve,reject){
            db.collection('users').findOneAsync({
                _id: userId
            })
            .then(userData => {
                if(userData===null){
                    resolve(null)
                }
                else {
                    resolveSessionObject(userData.sessions)
                    .then(sessionMap => {
                        var sessions = userData.sessions.map((id) => sessionMap[id]);
                        resolve(sessions);
                    })
                }
            })
            .catch(err => {reject(err)})
        })
    }

    app.get('/user/:userId/sessions',isLoggedIn, function(req,res){
        if(req.params.userId.str!==req.user._id.str) return res.status(401).end();
        var userId = new ObjectID(req.params.userId);
        getSessions(userId)
        .then(sessions=>{
            res.send(sessions);
        })
        .catch(err=>sendDatabaseError(res,err));
    });

    app.get('/chatNotification/:userid',isLoggedIn,function(req,res){
        if(req.params.userId.str!==req.user._id.str) return res.status(401).end();
        var userid = req.params.userid;
        getUserData(new ObjectID(userid),function(err,userdata){
            if(err)
            sendDatabaseError(res,err);
            else {

                res.send(userdata.sessions);
            }
        })
    })

    //get user data
    app.get('/user/:userId',isLoggedIn,cache(10),function(req, res) {
        var userId = req.params.userId;
        getUserData(new ObjectID(userId), function(err, userData) {
            if (err)
            return sendDatabaseError(res, err);
            res.send(userData);
        });
    });

    //post comments
    app.post('/postItem/:postItemId/commentThread/comment', validate({body: commentSchema}), isLoggedIn,function(req, res) {
        var body = req.body;
        var postItemId = req.params.postItemId;
        var userId = body.author;
        if(userId.str!==req.user._id.str) return res.status(401).end();
        db.collection('postFeedItems').updateOneAsync({
            _id: new ObjectID(postItemId)
        }, {
            $push: {
                comments: {
                    "author": new ObjectID(userId),
                    "text": body.text,
                    "postDate": (new Date()).getTime()
                }
            }
        })
        .then(() => {
            getPostFeedItem(new ObjectID(postItemId))
            .then(postItem => {
                res.send(postItem);
            })
        })
        .catch(err => {sendDatabaseError(res,err)})
    });

    //change user info
    app.put('/settings/user/:userId', validate({body: userInfoSchema}), isLoggedIn, function(req, res) {
        var data = req.body;
        var moment = require('moment');
        if(req.params.userId.str!==req.user._id.str) return res.status(401).end();
        var userId = new ObjectID(req.params.userId);
        db.collection('users').updateOneAsync({
            _id: userId
        }, {
            $set: {
                fullname:data.fullname,
                nickname: data.nickname,
                description: data.description,
                location: data.location,
                birthday: moment(data.birthday).valueOf()
            }
        })
        .then(()=>{
            getUserData(userId, function(err, userData) {
                if (err)
                return sendDatabaseError(res, err);
                res.send(userData);
            });
        })
        .catch(err=>sendDatabaseError(res,err));
    });

    function getActivityFeedItem(activityId, callback) {
        db.collection('activityItems').findOneAsync({
            _id: activityId
        })
        .then(activityitem=>{
            if(activityitem===null){
                return callback(null,activityitem)
            }
            resolveActivityItem(activityitem,callback);
        })
        .catch(err=>callback(err));
    }

    function resolveActivityItem(activityItem,callback){
        var userList = [activityItem.author];
        activityItem.comments.forEach((comment) => {
            userList.push(comment.author);
        });
        activityItem.likeCounter.map((id) => userList.push(id));
        activityItem.participants.map((id) => userList.push(id));
        resolveUserObjects(userList, function(err, userMap) {
            if (err)
            return callback(err);

            activityItem.author = userMap[activityItem.author];
            activityItem.participants = activityItem.participants.map((id) => userMap[id]);
            activityItem.likeCounter = activityItem.likeCounter.map((id) => userMap[id]);
            activityItem.comments.forEach((comment) => {
                comment.author = userMap[comment.author];
            });

            callback(null, activityItem);
        });
    }

    function resolvePostItem(postFeedItem){
        return new Promise(function(resolve, reject) {
            var userList = [postFeedItem.contents.author];
            postFeedItem.comments.forEach((comment) => {
                userList.push(comment.author);
            });
            userList = userList.concat(postFeedItem.likeCounter);

            resolveUserObjects(userList, function(err, userMap) {
                if (err)
                reject(err);
                else {
                    postFeedItem.likeCounter = postFeedItem.likeCounter.map((id) => userMap[id]);
                    postFeedItem.contents.author = userMap[postFeedItem.contents.author];
                    postFeedItem.comments.forEach((comment) => {
                        comment.author = userMap[comment.author];
                    });
                    resolve(postFeedItem);
                }
            });
        });
    }

    function getAllActivities(time,callback){
        db.collection('activityItems').findAsync({
            postDate:{
                $lt:time
            }
        })
        .then(cursor =>{
            return cursor.limit(5).sort({postDate:-1}).toArrayAsync();
        })
        .then(collection => {
            var resolvedActivities = [];

            function processNextFeedItem(i) {
                // Asynchronously resolve a feed item.
                resolveActivityItem(collection[i], function(err, activityItem) {
                    resolvedActivities.push(activityItem);
                    if (resolvedActivities.length === collection.length) {
                        // I am the final feed item; all others are resolved.
                        // Pass the resolved feed document back to the callback.
                        callback(null, collection);
                    } else {
                        // Process the next feed item.
                        processNextFeedItem(i + 1);
                    }
                });
            }

            if (collection.length === 0) {
                callback(null, collection);
            } else {
                processNextFeedItem(0);
            }
        })
        .catch((err)=>{callback(err)});
    }

    app.get('/activities/:time',isLoggedIn,cache(10),function(req,res){
        var time = parseInt(req.params.time);
        getAllActivities(time,function(err, activityData) {
            if (err)
            sendDatabaseError(res, err);
            else {
                res.send(activityData);
            }
        });
    });

    app.get('/posts/:time',cache(10),isLoggedIn,function(req,res){
        var time = parseInt(req.params.time);
        getAllPosts(time)
        .then((postData)=>{
            res.send(postData);
        })
        .catch(err => {
            sendDatabaseError(res, err);
        })
    });

    function getActivityFeedData(userId, callback) {
        db.collection('users').findOneAsync({
            _id: userId
        })
        .then(userData =>{
            if (userData === null)
            return callback(null, null);
            else {
                return db.collection('activities').findOneAsync({
                    _id: userData.activity
                })
            }
        })
        .then(function(activity) {
            if (activity === null)
            return callback(null, null);

            var resolvedContents = [];

            function processNextFeedItem(i) {
                // Asynchronously resolve a feed item.
                getActivityFeedItem(activity.contents[i], function(err, feedItem) {
                    if (err) {
                        // Pass an error to the callback.
                        callback(err);
                    } else {
                        // Success!
                        resolvedContents.push(feedItem);
                        if (resolvedContents.length === activity.contents.length) {
                            // I am the final feed item; all others are resolved.
                            // Pass the resolved feed document back to the callback.
                            activity.contents = resolvedContents;
                            callback(null, activity);
                        } else {
                            // Process the next feed item.
                            processNextFeedItem(i + 1);
                        }
                    }
                });
            }

            if (activity.contents.length === 0) {
                callback(null, activity);
            } else {
                processNextFeedItem(0);
            }
        })
        .catch(err => {callback(err)})
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    app.put('/settings/emailChange/user/:userId', validate({body: emailChangeSchema}), isLoggedIn, function(req, res) {
        var data = req.body;
        if(req.params.userId.str!==req.user._id.str) return res.status(401).end();
        var userId = new ObjectID(req.params.userId);
        getUserData(userId, function(err, userData) {
            if (err)
            return sendDatabaseError(res, err);
            else if (userData.email === data.oldEmail && validateEmail(data.newEmail)) {
                db.collection('users').updateOneAsync({
                    _id: userId
                }, {
                    $set: {
                        email: data.newEmail
                    }
                })
                .then(()=>{
                    return res.send(false);
                })
                .catch(err=>sendDatabaseError(res,err));
            } else {
                res.send(true);
            }
        });
    });

    app.put('/settings/avatar/user/:userId', isLoggedIn, function(req, res) {
        if(req.params.userId.str!==req.user._id.str) return res.status(401).end();
        var userId = new ObjectID(req.params.userId);
        var body = req.body;
        db.collection('users').findAndModifyAsync({
            _id: userId
        }, [
            ['_id', 'asc']
        ], {
            $set: {
                avatar: "img/avatar/"+userId+".jpg"
            }
        }, {
            "new": true
        })
        .then(result => {
            delete result.value.password;
            delete result.value.notification;
            delete result.value.post;
            delete result.value.activity;
            delete result.value.sessions;
            res.send(result.value);
            var buffer = new Buffer(body.img.split(',')[1], 'base64');
            Jimp.read(buffer)
            .then(image => {
                image.quality(10)
                .cover(512,512,Jimp.HORIZONTAL_ALIGN_CENTER,Jimp.VERTICAL_ALIGN_MIDDLE)
                .write("../client/build/img/avatar/" + userId + ".jpg");
            })
        })
        .catch(err=>{throw(err)})
    });

    app.put('/settings/location/user/:userId', isLoggedIn,function(req, res) {
        if(req.params.userId.str!==req.user._id.str) return res.status(401).end();
        var userId = req.params.userId;
        var body = req.body;
        db.collection('users').updateOne({
            _id: new ObjectID(userId)
        }, {
            $set: {
                location: body
            }
        }, function(err) {
            if (err)
            return sendDatabaseError(res, err);
            else {
                res.send(true);
            }
        });
    });

    // get activity Feed data
    app.get('/user/:userid/activity',cache(30), isLoggedIn,function(req, res) {
        var userId = new ObjectID(req.params.userid);
        getActivityFeedData(userId, function(err, activityData) {
            if (err)
            sendDatabaseError(res, err);
            else {
                res.send(activityData);
            }
        });
    });

    function postActivity(data,callback) {

        if(data.img!=="./img/default.png"){
            var name = uuidV1();
            var img = data.img;
            data.img = "img/activity/"+name+'.jpg';
            var buffer = new Buffer(img.split(",")[1], 'base64');
            Jimp.read(buffer)
            .then(image => {
                image.quality(30)
                .write("../client/build/img/activity/" + name + ".jpg");
            })
        }
        data.participants=[];
        data.likeCounter=[];
        data.comments=[];
        data.author = new ObjectID(data.author);
        delete data.cropperOpen;
        db.collection('activityItems').insertOneAsync(data)
        .then(result=>{
            data._id=result.insertedId;
        })
        .then(()=>{
            return db.collection('users').findOneAsync({_id:new ObjectID(data.author)})
        })
        .then(userData=>{
            db.collection('activities').updateOne({_id:userData.activity},{
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
    //post activity
    app.post('/postActivity', validate({body: activitySchema}), isLoggedIn,function(req, res) {
        var body = req.body;
        if(body.author.str!==req.user._id.str) return res.status(401).end();
        postActivity(body,function(err,activityData){
            if(err)
            return sendDatabaseError(res,err);
            else{
                res.send(activityData);
            }
        });
    });

    //get activity detail
    app.get('/activityItem/:activityId',cache(60), isLoggedIn, function(req, res) {
        var activityId = new ObjectID(req.params.activityId);
        getActivityFeedItem(activityId, function(err, activityData) {
            res.status(201);
            res.send(activityData);
        });
    });

    //like activity
    app.put('/activityItem/:activityId/likelist/:userId', isLoggedIn, function(req, res) {
        var activityId = new ObjectID(req.params.activityId);
        var userId = req.params.userId;
        var update = {
            $addToSet: {}
        };
        update.$addToSet["likeCounter"] = new ObjectID(userId);
        db.collection('activityItems').findAndModifyAsync({
            _id: activityId
        }, [
            ['_id', 'asc']
        ], update, {
            "new": true
        })
        .then(result=>{
            if (result.value === null) {
                res.status(400).end();
            } else {
                resolveUserObjects(result.value.likeCounter, function(err, userMap) {
                    if (err) {
                        sendDatabaseError(res, err);
                    } else {
                        result.value.likeCounter = result.value.likeCounter.map((id) => userMap[id]);
                        res.send(result.value.likeCounter);
                    }
                });
            }
        })
        .catch(err=>sendDatabaseError(res,err));
    });

    //unlike activity
    app.delete('/activityItem/:activityId/likelist/:userId', isLoggedIn,function(req, res) {
        var activityId = new ObjectID(req.params.activityId);
        var userId = req.params.userId;
        var update = {
            $pull: {}
        };
        update.$pull["likeCounter"] = new ObjectID(userId);
        db.collection('activityItems').findAndModifyAsync({
            _id: activityId
        }, [
            ['_id', 'asc']
        ], update, {
            "new": true
        })
        .then(result=>{
            if (result.value === null) {
                res.status(400).end();
            } else {
                resolveUserObjects(result.value.likeCounter, function(err, userMap) {
                    if (err) {
                        sendDatabaseError(res, err);
                    } else {
                        result.value.likeCounter = result.value.likeCounter.map((id) => userMap[id]);
                        res.send(result.value.likeCounter);
                    }
                });
            }
        })
        .catch(err=>sendDatabaseError(res,err));
    });

    //post ADcomments
    app.post('/activityItem/:activityId/commentThread/comment', validate({body: commentSchema}), isLoggedIn,function(req, res) {
        var body = req.body;
        var activityItemId = new ObjectID(req.params.activityId);
        var userId = body.author;
        if(userId.str!==req.user._id.str) return res.status(401).end();
        db.collection('activityItems').updateOneAsync({
            _id: activityItemId
        }, {
            $push: {
                comments: {
                    "author": new ObjectID(userId),
                    "postDate": (new Date()).getTime(),
                    "text": body.text
                }
            }
        })
        .then(()=>{
            getActivityFeedItem(activityItemId, function(err, activityData) {
                if (err) {
                    sendDatabaseError(res, err);
                } else {
                    res.send(activityData);
                }
            });
        })
        .catch(err=>sendDatabaseError(res,err));
    });

    function getNotificationItem(notificationId, callback) {
        db.collection('notificationItems').findOneAsync({
            _id: notificationId
        })
        .then(notification=>{
            if (notification === null)
            return callback(null, null);
            else {
                var userList = [notification.sender,notification.target];
                resolveUserObjects(userList,function(err,userMap){
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

    function getNotificationData(notificationId, callback) {
        db.collection('notifications').findOneAsync({
            _id: notificationId
        })
        .then(notifications=>{
            if (notifications === null) {
                return callback(null, null);
            }
            var resolvedContents = [];

            function processNextFeedItem(i) {
                // Asynchronously resolve a feed item.
                getNotificationItem(notifications.contents[i], function(err, notification) {
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

    //get notification
    app.get('/user/:userId/notification', isLoggedIn,function(req, res) {
        if(req.params.userId.str!==req.user._id.str) return res.status(401).end();
        var userId = new ObjectID(req.params.userId);
        db.collection('users').findOneAsync({
            _id: userId
        })
        .then(userData=>{
            if (userData === null)
            return res.status(400).end();
            else {
                getNotificationData(userData.notification, function(err, notificationData) {
                    if (err)
                    return sendDatabaseError(res, err);
                    res.send(notificationData);
                });
            }
        })
        .catch(err=>sendDatabaseError(res,err));
    });

    function deleteNotification(notificationId, userId, callback) {
        db.collection('users').findOneAsync({
            _id: userId
        })
        .then(userData=>{
            if (userData === null)
            return callback(null, null);
            else {
                db.collection('notifications').updateOneAsync({
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
            db.collection('notificationItems').removeAsync({
                _id: notificationId
            });
            return userData;
        })
        .then(userData=>{
            getNotificationData(userData.notification, function(err, notificationData) {
                if (err)
                return callback(err);
                else {
                    return callback(null, notificationData);
                }
            });
        })
        .catch(err=>callback(err));
    }

    //acceptRequest friend request
    app.put('/notification/:notificationId/:userId', isLoggedIn,function(req, res) {
        if(req.params.userId.str!==req.user._id.str) return res.status(401).end();
        var userId = new ObjectID(req.params.userId);
        var notificationId = new ObjectID(req.params.notificationId);
        getNotificationItem(notificationId, function(err, notification) {
            if (err)
            return sendDatabaseError(res, err);
            else {
                db.collection('users').updateOneAsync({_id: userId},{
                    $addToSet: {
                        friends: notification.sender._id
                    }
                })
                .then(()=>{
                    db.collection('users').updateOneAsync({_id: notification.sender._id}, {
                        $addToSet: {
                            friends: userId
                        }
                    })
                })
                .then(()=>{
                    deleteNotification(notificationId, userId, function(err, notificationData) {
                        if (err)
                        sendDatabaseError(res, err);
                        else {
                            res.send(notificationData);
                        }
                    });
                })
            }
        });
    });

    //deleteNotification
    app.delete('/notification/:notificationId/:userId', isLoggedIn,function(req, res) {
        if(req.params.userId.str!==req.user._id.str) return res.status(401).end();
        var userId = new ObjectID(req.params.userId);
        var notificationId = new ObjectID(req.params.notificationId);
        deleteNotification(notificationId, userId, function(err, notificationData) {
            if (err)
            sendDatabaseError(res, err);
            else {
                res.send(notificationData);
            }
        });
    });

    //accept activity request
    app.put('/acceptactivity/:notificationId/:fromuser',isLoggedIn,function(req,res){
        if(req.params.fromuser.str!==req.user._id.str) return res.status(401).end();
        var user = new ObjectID(req.params.fromuser);
        var notificationId = new ObjectID(req.params.notificationId);
        getNotificationItem(notificationId,function(err,notification){
            if(err)
            return sendDatabaseError(res, err);
            else{
                var userToAdd;
                if(notification.RequestOrInvite==="request"){
                    userToAdd = notification.sender._id
                }
                else{
                    userToAdd = notification.target._id
                }

                db.collection('activityItems').updateOne({
                    _id:notification.activityid
                },{
                    $addToSet:{
                        participants:userToAdd
                    }
                },function(err){
                    if(err){
                        return sendDatabaseError(res,err);
                    }
                    deleteNotification(notificationId,user,function(err,notificationData){

                        if(err)
                        sendDatabaseError(res,err);
                        else{
                            res.status(201);
                            res.send(notificationData);
                        }
                    })
                })
            }
        });
    });

    //getMessage
    app.get('/user/:userId/chatsession/:id/:time', isLoggedIn,function(req, res) {
        if(req.params.userId.str!==req.user._id.str) return res.status(401).end();
        var id = req.params.id;
        var userid = req.params.userId;
        var time = req.params.time;
        db.collection('messageSession').findOneAsync({
            _id: new ObjectID(id)
        })
        .then(message=>{
            if(message == null){
                res.status(400);
                res.send();
            }
            else {
                if(message.lastmessage===undefined?false: (message.lastmessage.target===undefined?"": message.lastmessage.target.str===userid.str)){
                    db.collection('messageSession').updateOneAsync({_id:new ObjectID(id)},{
                        $set:{
                            "lastmessage.isread":true
                        }
                    })
                    .then(()=>{
                        getMessage(time+1, message.contents, function(err, messages) {
                            if (err)
                            sendDatabaseError(res, err);
                            else {
                                res.status(201);
                                res.send(messages);
                            }
                        });
                    })
                    .catch(err=>sendDatabaseError(res,err));
                }
                else getMessage(time+1,message.contents, function(err, messages) {
                    if (err)
                    sendDatabaseError(res, err);
                    else {
                        res.status(201);
                        res.send(messages);
                    }
                });
            }
        })
        .catch(err=>sendDatabaseError(res,err))
    });

    //post message
    app.post('/chatsession/:id', isLoggedIn,function(req, res) {
        var id = req.params.id;
        var body = req.body;
        var time = (new Date()).getTime();
        var senderid = body.sender;
        if(senderid.str!==req.user._id.str) return res.status(401).end();
        var targetid = body.target;
        var text = body.text;
        var lastmessage = {
            "sender": new ObjectID(senderid),
            "target": new ObjectID(targetid),
            "date": time,
            "text": text
        }
        getSessionContentsID(new ObjectID(id), function(err, contentsid) {
            if (err)
            sendDatabaseError(res, err);
            else {
                db.collection('message').updateOneAsync({
                    _id: new ObjectID(contentsid)
                }, {
                    $push: {
                        messages: lastmessage
                    }
                })
                .then(()=>{
                    getMessage(time+1,contentsid, function(err, messages) {
                        if (err)
                        sendDatabaseError(res, err);
                        else {
                            //seting lastmessage;
                            lastmessage.isread = false;
                            db.collection("messageSession").updateOneAsync({
                                _id: new ObjectID(id)
                            }, {
                                $set: {
                                    "lastmessage": lastmessage
                                }
                            })
                            .then(()=>{
                                res.send(messages);
                            })
                            .catch(err=>sendDatabaseError(res,err))
                        }
                    });
                })
                .catch(err=>sendDatabaseError(res,err))
            }
        });
    });

    function getMessage(time,sessionId, cb) {
        db.collection('message').aggregate([
            {$match: { _id: sessionId}},
            {$unwind: "$messages"},
            {$match:{"messages.date":{$lt:parseInt(time)}}},
            {$sort:{"messages.date":-1}},
            {$limit:10}
        ],function(err,messages){
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
                    resolveUserObjects(userList, function(err, userMap) {
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

    app.get('/getsession/:userid/:targetid', cache(600), isLoggedIn,function(req, res) {
        var userid = req.params.userid;
        if(userid.str!==req.user._id.str) return res.status(401).end();
        var targetid = req.params.targetid;
        getSession(new ObjectID(userid), new ObjectID(targetid))
        .then(session=>{
            if(session===null){
                createSession(new ObjectID(userid), new ObjectID(targetid),function(err,newSession){
                    if(err)
                    sendDatabaseError(res,err);
                    else{
                        res.status(201);
                        res.send(newSession);
                    }
                })
            }
            else {
                res.status(201);
                res.send(session);
            }
        })
        .catch(err=>sendDatabaseError(res,err));
    });

    function getSession(userid, targetid) {
        return new Promise(function(resolve,reject){
            db.collection("messageSession").findOneAsync({
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

    function getSessionContentsID(sessionid, cb) {
        db.collection("messageSession").findOneAsync({
            _id: sessionid
        })
        .then(session=>{
            cb(null, session.contents);
        })
        .catch(err=>cb(err));
    }

    function createSession(userid, targetid, cb){
        db.collection("message").insertOneAsync({
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
            db.collection("messageSession").insertOneAsync(newSession)
            .then(messageSession=>{
                db.collection("users").updateMany({
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

    /**
    * Translate JSON Schema Validation failures into error 400s.
    */
    app.use(function(err, req, res, next) {
        if (err.name === 'JsonSchemaValidation') {
            // Set a bad request http response status
            res.status(400).end();
        } else {
            // It's some other sort of error; pass it to next error middleware handler
            console.log(err.stack);
            res.status(500).send({"Error" : err.stack});
            next(err);
        }
    });

    // get search result.
    app.get('/search/:querytext',cache(10),isLoggedIn,function(req,res){
        var querytext = req.params.querytext.toLowerCase();
        var users = db.collection('users').findAsync({
            $or:
            [
                {fullname:{$regex:querytext,$options:'i'}}
            ]
        })
        .then(cursor => {
            return cursor.toArrayAsync();
        });

        var activityitems = db.collection('activityItems').findAsync({
            description:{$regex:querytext,$options:'i'}
        })
        .then(cursor => {
            return cursor.toArrayAsync();
        });

        var postItems = db.collection('postFeedItems').findAsync({
            ['contents.text']:{$regex:querytext,$options:'i'}
        })
        .then(cursor => {
            return cursor.toArrayAsync();
        });

        Promise.join(users,activityitems,postItems,function(u,a,p){
            return new Promise(function(resolve, reject){
                var data = {};
                data["users"] = u;
                data["posts"] = p;
                if(a.length===0){
                    data["activities"] = [];
                    return resolve(data);
                }
                var resolvedActivities = [];
                a.forEach((element)=>{
                    getUserData(new ObjectID(element.author),(err,userObj)=>{
                        element.author = userObj;
                        resolvedActivities.push(element);
                        if(err){
                            return reject(err);
                        }
                        if(resolvedActivities.length===a.length){
                            data["activities"] = resolvedActivities;
                            resolve(data);
                        }
                    })
                });
            })
        })
        .then(data=>{
            var resolvedPosts = [];
            var p = data["posts"];
            if (p.length === 0) {
                return res.send(data);
            }
            p.forEach((c) => {
                resolvePostItem(c)
                .then(postItem => {
                    resolvedPosts.push(postItem);
                    if (resolvedPosts.length === p.length) {
                        data["posts"] = resolvedPosts;
                        return res.send(data);
                    }
                })
                .catch(err => {sendDatabaseError(res,err)})
            })
        })
        .catch(err=>sendDatabaseError(res,err));
    });

    app.post('/signup',validate({body:userSchema}),function(req,res,next){
        passport.authenticate('signup', function(err, user) {
            if (err) { return sendDatabaseError(res,err); }
            if (!user) { return res.status(400).end(); }
            return res.send();
        })(req,res,next);
    })


    app.post('/login',validate({body:loginSchema}),function(req,res,next){
        passport.authenticate('login', function(err, user, info) {
            if (err) { return sendDatabaseError(res,err); }
            if (!user) { return res.status(401).end(); }
            req.login(user,()=>{
                res.send(info);
            })
        })(req,res,next);
    });

    app.get('/auth/facebook', passport.authenticate('facebook',{ scope: ['email']}));
    app.get('/auth/facebook/callback',function(req,res,next){
        passport.authenticate('facebook', { scope: ['email']},function(err, user, info) {
            if (err) { return sendDatabaseError(res,err); }
            if (!user) { return res.status(400).end(); }
            req.login(user,()=>{
                res.redirect('/#/activity/?data='+JSON.stringify(info));
            })
        })(req,res,next);
    })

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    app.get('/activityNotification',isLoggedIn,function(req,res){
        db.collection('activityItems').count(function(err,count){
            res.send({result:count});
        });
    });

    app.get('/postNotification',isLoggedIn,function(req,res){
        db.collection('postFeedItems').count(function(err,count){
            res.send({result:count});
        });
    });

    app.post('/friendRequest/:sender/:target',isLoggedIn,function(req,res){
        var sender = req.params.sender;
        if(sender.str!==req.user._id.str) return res.status(401).end();
        var target = req.params.target;
        db.collection('notificationItems').insertOne({
            sender: new ObjectID(sender),
            target: new ObjectID(target),
            type:"FR"
        },function(err,result){
            if(err)
            sendDatabaseError(res,err);
            else{
                db.collection('users').findOneAsync({_id:new ObjectID(target)})
                .then(userData=>{
                    db.collection('notifications').updateOne({_id:userData.notification},{
                        $addToSet:{
                            contents: result.insertedId
                        }
                    },function(err){
                        if(err)
                        sendDatabaseError(res,err);
                        else {
                            res.send();
                        }
                    });
                })
                .catch(err=>sendDatabaseError(res,err));
            }
        });
    });

    app.post('/activityJoinRequest/:sender/:target/:activityid',isLoggedIn,function(req,res){
        var sender = req.params.sender;
        if(sender.str!==req.user._id.str) return res.status(401).end();
        var target = req.params.target;
        var activityid = req.params.activityid;
        db.collection('notificationItems').insertOne({
            sender: new ObjectID(sender),
            target: new ObjectID(target),
            type:"AN",
            RequestOrInvite:"request",
            activityid: new ObjectID(activityid)
        },function(err,result){
            if(err){
                sendDatabaseError(res,err);
            }
            else{
                db.collection('users').findOneAsync({_id:new ObjectID(target)})
                .then(userData=>{
                    db.collection('notifications').updateOne({_id:userData.notification},{
                        $addToSet:{
                            contents: result.insertedId
                        }
                    },function(err){
                        if(err){
                            sendDatabaseError(res,err);
                        }
                        else{
                            res.send();
                        }
                    });
                })
                .catch(err=>sendDatabaseError(res,err));
            }
        });
    });

    app.post('/activityInviteRequest/:sender/:target/:activityid',isLoggedIn,function(req,res){
        var sender = req.params.sender;
        if(sender.str!==req.user._id.str) return res.status(401).end();
        var target = req.params.target;
        var activityid = req.params.activityid;
        db.collection('notificationItems').insertOne({
            sender: new ObjectID(sender),
            target: new ObjectID(target),
            type:"AN",
            RequestOrInvite:"invite",
            activityid: new ObjectID(activityid)
        },function(err,result){
            if(err){
                sendDatabaseError(res,err);
            }
            else{
                db.collection('users').findOneAsync({_id:new ObjectID(target)})
                .then(userData=>{
                    db.collection('notifications').updateOne({_id:userData.notification},{
                        $addToSet:{
                            contents: result.insertedId
                        }
                    },function(err){
                        if(err){
                            sendDatabaseError(res,err);
                        }
                        else{
                            res.send();
                        }
                    });
                })
                .catch(err=>sendDatabaseError(res,err));
            }
        });
    });


    //  var server = http.createServer(function (req, res) {
    //      res.writeHead(301, { "Location": "https://www.w1meet.com:443/"});
    //      res.end();
    //  },app);
    // var httpsServer = https.createServer({key: privateKey, cert: certificate, requestCert: true, rejectUnauthorized: false},
    //                     app);
    var server = http.createServer(app);

    var io = require('socket.io')(server);
    io.on('connection', function(socket){

        socket.on('disconnect', function () {
            db.collection('userSocketIds').findOne({socketId:socket.id},function(err,socketData){
                if(socketData!==null){
                    db.collection('users').updateOneAsync({_id:socketData.userId},{
                        $set:{
                            online:false
                        }
                    })
                    .then(()=>{
                        var data = {
                            user: socketData.userId,
                            online: false
                        }
                        socket.broadcast.emit('online',data);
                    })
                }
            });
            db.collection('userSocketIds').remove({socketId:socket.id});
        });

        socket.on('logout',function(user){
            db.collection('users').updateOneAsync({_id:new ObjectID(user)},{
                $set:{
                    online:false
                }
            })
            .then(()=>{
                var data = {
                    user: user,
                    online: false
                }
                socket.broadcast.emit('online',data);
            })
            db.collection('userSocketIds').remove({socketId:socket.id});
        });

        socket.on('user',function(user){

            db.collection('users').updateOneAsync({_id:new ObjectID(user)},{
                $set:{
                    online:true
                }
            })
            .then(()=>{
                var data = {
                    user: user,
                    online: true
                }
                socket.broadcast.emit('online',data);
            })
            db.collection('userSocketIds').updateOne({userId:new ObjectID(user)},{
                $set:{
                    socketId:socket.id
                }
            },{upsert: true});


        });

        socket.on('chat',function(data){
            db.collection('userSocketIds').findOne({userId:new ObjectID(data.friend)},function(err,socketData){
                if(err)
                io.emit('chat',err);
                else if(socketData!==null && io.sockets.connected[socketData.socketId]!==undefined){
                    io.sockets.connected[socketData.socketId].emit('chat');
                }
            });
        });

        socket.on('newPost',function(data){
            if(data.authorization!==undefined&&data.authorization!==null){
                var tokenObj = jwt.verify(data.authorization, secretKey);
                var id = tokenObj['id'];
                if(id===data.user){
                    socket.broadcast.emit('newPost');
                }
            }
        });

        socket.on('newActivity',function(data){
            if(data.authorization!==undefined&&data.authorization!==null){
                var tokenObj = jwt.verify(data.authorization, secretKey);
                var id = tokenObj['id'];
                if(id===data.user){
                    socket.broadcast.emit('newActivity');
                }
            }
        });

        socket.on('notification',function(data){
            if(data.authorization!==undefined&&data.authorization!==null){
                var tokenObj = jwt.verify(data.authorization, secretKey);
                var id = tokenObj['id'];
                if(id===data.sender){
                    db.collection('userSocketIds').findOne({userId:new ObjectID(data.target)},function(err,socketData){
                        if(err)
                        io.emit('notification',err);
                        else if(socketData!==null && io.sockets.connected[socketData.socketId]!==undefined){
                            io.sockets.connected[socketData.socketId].emit('notification');
                        }
                    });
                }
            }
        });

        socket.on('friend request accepted',function(data){
            if(data.authorization!==undefined&&data.authorization!==null){
                var tokenObj = jwt.verify(data.authorization, secretKey);
                var id = tokenObj['id'];
                if(id===data.sender){
                    db.collection('userSocketIds').findOne({userId:new ObjectID(data.target)},function(err,socketData){
                        if(err)
                        io.emit('friend request accepted',err);
                        else if(socketData!==null && io.sockets.connected[socketData.socketId]!==undefined){
                            db.collection('users').findOne({_id:new ObjectID(data.sender)},function(err,userData){
                                if(err)
                                io.emit('friend request accepted',err);
                                else{
                                    io.sockets.connected[socketData.socketId].emit('friend request accepted',{sender:userData.fullname});
                                }
                            });
                        }
                    });
                }
            }
        });

    });

    server.listen(3000, function() {
        console.log('app listening on port 3000!');
    });
    // httpsServer.listen(443,function(){
    // console.log('https on port 443');
    // });
    //
    // server.listen(80, function() {
    //     console.log('http on port 80');
    // });
});
