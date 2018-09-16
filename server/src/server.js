let PROD = process.argv.length>=3 && process.argv[2]==='-p';
let express = require('express');
let compression = require('compression');
let app = express();
let http = require('http');
let bodyParser = require('body-parser');
let Promise = require("bluebird");
let dbName = 'wemeet';
let MongoDB = Promise.promisifyAll(require('mongodb'));
let MongoClient = MongoDB.MongoClient;
let ObjectID = MongoDB.ObjectID;
let url = 'mongodb://localhost:27017/'+dbName+', localhost:27018';
let bcrypt = Promise.promisifyAll(require('bcryptjs'));
let mcache = require('memory-cache');
let passport = require('passport');
let cookieParser = require('cookie-parser');
let localStrategy = require('passport-local').Strategy;
let facebookStrategy = require('passport-facebook').Strategy;
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let helmet = require('helmet');
let ServerHelper = require('./utils/serverHelper');
let ActivityHelper = require('./utils/activityHelper');
let PostHelper = require('./utils/postHelper');
let ChatHelper = require('./utils/chatHelper');
let NotificationHelper = require('./utils/notificationHelper');
let Jimp = require("jimp");
let zxcvbn = require('zxcvbn');

if(PROD){
    var https = require('https');
    var path = require('path');
    var fs = Promise.promisifyAll(require('fs'));
    var privateKey = fs.readFileSync(path.join(__dirname, 'private.key'));
    var certificate = fs.readFileSync(path.join(__dirname, 'wemeet.crt'));
    var ca = fs.readFileSync(path.join(__dirname, 'wemeet.ca-bundle'));
}

let secretKey = `2f862fc1c64e437b86cef1373d3a3f8248ab4675220b3afab1c5ea97e
fda064351da14375118884b463b47a4c0699f67aed0094f339998f102d99bdfe479dbefae0
6933592c86abd20c5447a5f9af1b275c909de4108ae2256bcb0285daad0aa890171849fb3c
a332ca4da03fc80b9228f56cad935b6b9fd33ce6437a4b1f96648546a122a718720452b7cf
38acc120c64b4a1622399bd6984460e4f4387db1a164c6dd4c80993930c57444905f6b46e7
a7f1dba60f898302c4865cfee74b82517852e5bd5890a547d59071319b5dfc0faa92ce4f01
f090e49cab2422031b17ea54a7c4b660bf491d7b47343cdf6042918669d7df54e7d3a1be6e9a571be9aef`;

let cache = (duration) => {
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
            next();
        }
    }
}



app.use(helmet());
app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({limit: '2mb', extended: true}));
app.use(compression());
app.disable('x-powered-by');



MongoClient.connect(url, { 
    useNewUrlParser: true,
    replicaSet: 'rs0'
}, function(err, client) {
    let db = client.db(dbName);
    let sessionStore = new MongoStore({db: db});
    //initialize helper class
    let serverHelper = new ServerHelper(db);
    let activityHelper = new ActivityHelper(db);
    let postHelper = new PostHelper(db);
    let chatHelper = new ChatHelper(db);
    let notificationHelper = new NotificationHelper(db);

    if(err){
        console.log("mongodb err: "+err)
    }

    app.use(bodyParser.json());
    app.use(bodyParser.text());
    app.use(cookieParser());
    app.use(express.static('../client/build',{
        maxAge: 2592000000
    }));
    app.set('trust proxy', 1);
    app.use(session({
        name: 'wemeetSessionId',
        secret: secretKey,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie : {
            secure: false, //try true in production
            maxAge : 24 * 60 * 60 * 1000 // 1 day
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    //schemas
    let statusUpdateSchema = require('./schemas/statusUpdate.json');
    let commentSchema = require('./schemas/comment.json');
    let userInfoSchema = require('./schemas/userInfo.json');
    let emailChangeSchema = require('./schemas/emailChange.json');
    let activitySchema = require('./schemas/activity.json');
    let userSchema = require('./schemas/user.json');
    let loginSchema = require('./schemas/login.json');
    let passSchema = require('./schemas/passChange.json');
    let validate = require('express-jsonschema').validate;

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
            if(!serverHelper.validateEmail(email)){
                return done(null,false);
            }
            user.email = email;
            bcrypt.hashAsync(password,10)
            .then(hash=>{
                user.password = hash;
                user.nickname = "";
                user.avatar = "img/user.png";
                user.description = "";
                user.friends = [new ObjectID("000000000000000000000001")];
                user.sessions = [];
                user.birthday = 147812931;
                user.online = false;
                return user;
            })
            .then(user=>{
                return Promise.join(
                    db.collection('users').insertOneAsync(user),
                    db.collection('postFeeds').insertOneAsync({contents:[]}),
                    db.collection('notifications').insertOneAsync({contents:[]}),
                    db.collection('activities').insertOneAsync({contents:[]}),
                    (user,post,noti,act)=>{
                        db.collection('users').updateOneAsync({_id:new ObjectID("000000000000000000000001")},{
                            $addToSet:{
                                friends:user.insertedId
                            }
                        })
                        .catch(err=>{done(err)});
                        db.collection('users').updateOneAsync({_id:user.insertedId},{
                            $set: {
                                activity:act.insertedId,
                                notification: noti.insertedId,
                                post:post.insertedId
                            }
                        })
                        .catch(err=>{done(err)});
                        chatHelper.createSession(new ObjectID("000000000000000000000001"), user.insertedId)
                        .catch(err=>{done(err)});
                        return done(null,user.insertedId);
                    })
                })
                .catch(err=>{done(err)});
            });
        })
    );

    passport.use('login',new localStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },function(req,email,password,done){
        email = email.trim().toLowerCase();
        db.collection('users').findOneAsync({email:email})
        .then(user=>{
            if(user===null){
                return done(null,false);
            }
            else{
                bcrypt.compareAsync(password,user.password)
                .then(success=>{
                    if(success){
                        var newUserObj = {}
                        newUserObj._id = user._id;
                        newUserObj.avatar = user.avatar;
                        newUserObj.fullname = user.fullname;
                        newUserObj.friends = user.friends;
                        return done(null,newUserObj,{
                            user:newUserObj
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
            clientID        : PROD?'228378300899099':'228542127549383',
            clientSecret    : PROD?'f3e7619971ab2fc9bb8eba4969b606f4':'de414785354473b5715fa05dab6dae86',
            callbackURL     : PROD?'/auth/facebook/callback':'http://localhost:3000/auth/facebook/callback',
            profileFields: ['id', 'displayName']
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
                        (user,post,noti,act)=>{
                            db.collection('users').updateOneAsync({_id:new ObjectID("000000000000000000000001")},{
                                $addToSet:{
                                    friends:user.insertedId
                                }
                            })
                            .catch(err=>done(err));
                            db.collection('users').updateOneAsync({_id:user.insertedId},{
                                $set: {
                                    activity:act.insertedId,
                                    notification: noti.insertedId,
                                    post:post.insertedId
                                }
                            })
                            .catch(err=>done(err));
                            chatHelper.createSession(new ObjectID("000000000000000000000001"), user.insertedId)
                            .catch(err=>done(err));
                            var newUserObj = {}
                            newUserObj._id = user.insertedId;
                            newUserObj.avatar = encodeURIComponent(user.avatar);
                            newUserObj.fullname = user.fullname;
                            newUserObj.friends = user.friends;
                            return done(null,newUserObj,{
                                user:newUserObj
                            });
                        })
                        .catch(err=>done(err));
                    }
                    else{
                        var newUserObj = {}
                        newUserObj._id = user._id;
                        newUserObj.fullname = user.fullname;
                        newUserObj.avatar = encodeURIComponent(user.avatar);
                        newUserObj.friends = user.friends;
                        return done(null,newUserObj,{
                            user:newUserObj
                        });
                    }
                })
                .catch(err=>{done(err)});
            }
        )
    )

    app.get('/user/:userId/feed/:count',cache(10),serverHelper.isLoggedIn,(req, res) => {
        let userId = req.params.userId;
        let count = parseInt(req.params.count);
        postHelper.getPostFeedData(new ObjectID(userId),count)
        .then(feedData => {
            if (feedData === null) {
                res.status(400);
                res.send("Could not look up feed for user " + userId);
            } else {
                res.send(feedData);
            }
        })
        .catch(err => {serverHelper.sendDatabaseError(res,err)})

    });

    //create post
    app.post('/postItem', validate({body: statusUpdateSchema}), serverHelper.isLoggedIn,(req, res) => {
        var body = req.body;
        if(body.userId.str!==req.user._id.str) return res.status(401).end();
        postHelper.postStatus(new ObjectID(body.userId), body.text, body.img)
        .then(function(newPost){
            res.status(201);
            res.send(newPost);
        })
        .catch(err => {
            console.log(err);
            serverHelper.sendDatabaseError(res, err);
        })
    });

    //like post
    app.put('/postItem/:postItemId/likelist/:userId', serverHelper.isLoggedIn,(req, res) => {
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
            return postHelper.getPostFeedItem(new ObjectID(postItemId))
        })
        .then(postItem => {
            res.send(postItem.likeCounter);
        })
        .catch(function(err){
            serverHelper.sendDatabaseError(res, err);
        })
    });

    //unlike post
    app.delete('/postItem/:postItemId/likelist/:userId', serverHelper.isLoggedIn,(req, res) => {
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
            return postHelper.getPostFeedItem(new ObjectID(postItemId))
        })
        .then(postItem => {
            res.send(postItem.likeCounter);
        })
        .catch(function(err){
            serverHelper.sendDatabaseError(res, err);
        })
    });

    app.get('/user/:userId/sessions',serverHelper.isLoggedIn, (req, res) =>{
        if(req.params.userId.str!==req.user._id.str) return res.status(401).end();
        var userId = new ObjectID(req.params.userId);
        chatHelper.getSessions(userId)
        .then(sessions=>{
            res.send(sessions);
        })
        .catch(err=>serverHelper.sendDatabaseError(res,err));
    });

    app.get('/chatNotification/:userid',serverHelper.isLoggedIn,(req, res) =>{
        if(req.params.userid.str!==req.user._id.str) return res.status(401).end();
        var userid = req.params.userid;
        serverHelper.getUserData(new ObjectID(userid))
        .then(userdata=>{
            res.send(userdata.sessions);
        })
        .catch(err=>serverHelper.sendDatabaseError(res,err));
    })

    app.get('/newNotification/:userId', serverHelper.isLoggedIn, (req, res)=>{
        if(req.params.userId.str!==req.user._id.str) return res.status(401).end();
        var userId = req.params.userId;
        notificationHelper.hasNewNotification(new ObjectID(userId))
        .then(result=>{
            res.send({
                count:result
            });
        })
        .catch(err=>serverHelper.sendDatabaseError(res, err));
    })

    //get user data
    app.get('/user/:userId',serverHelper.isLoggedIn,cache(10),(req, res) => {
        var userId = req.params.userId;
        serverHelper.getUserData(new ObjectID(userId))
        .then((userData) => {
            res.send(userData);
        })
        .catch(err=>serverHelper.sendDatabaseError(res, err));
    });


    //TODO: update the counter and get postcomments again=
    //post comments
    app.post('/postItem/:postItemId/commentThread/comment', validate({body: commentSchema}), serverHelper.isLoggedIn,(req, res) => {
        var body = req.body;
        var postItemId = req.params.postItemId;
        var userId = body.author;
        if(userId.str!==req.user._id.str) return res.status(401).end();
        
        db.collection('postFeedComments').findOneAndUpdateAsync({
            _id: new ObjectID(postItemId)
        }, {
            $push: {
                comments: {
                    "author": new ObjectID(userId),
                    "text": body.text,
                    "postDate": (new Date()).getTime()
                }
            }
        },{
            upsert: true
        })
        .then(()=>{
            return db.collection('postFeedItems').findAndModifyAsync({
                _id: new ObjectID(postItemId)
            },[],{
                $inc: {commentsCount: 1}
            },{
                new: true
            })
        })
        .then((updatedPostItem)=>{
            updatedPostItem = updatedPostItem.value;
            return postHelper.resolvePostItem(updatedPostItem);
        })
        .then(resolvedPostItem=>{
            res.send(resolvedPostItem);
        })
        .catch(err => {serverHelper.sendDatabaseError(res,err)});
    });

    app.get('/postItem/:postItemId/comment/:date', serverHelper.isLoggedIn, (req, res)=>{
        let postFeedId = req.params.postItemId;
        let date = req.params.date
        postHelper.getPostComments(new ObjectID(postFeedId),date)
        .then((postComments)=>{
            res.send(postComments);
        })
        .catch(err=>{
            serverHelper.sendDatabaseError(res, err);
        });
    });

    //change user info
    app.put('/settings/user/:userId', validate({body: userInfoSchema}), serverHelper.isLoggedIn, (req, res) => {
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
                birthday: moment(data.birthday).valueOf()
            }
        })
        .then(()=>{
            serverHelper.getUserData(userId)
            .then(userData=>{
                res.send(userData);
            })
            .catch(err=>serverHelper.sendDatabaseError(res, err))
        })
        .catch(err=>serverHelper.sendDatabaseError(res,err));
    });

    app.get('/activities/:time',serverHelper.isLoggedIn,cache(10),(req, res) =>{
        var time = parseInt(req.params.time);
        activityHelper.getAllActivities(time)
        .then(activityData=>res.send(activityData))
        .catch(err=>{
            serverHelper.sendDatabaseError(res, err)
        });
    });

    app.get('/posts/:time',cache(10),serverHelper.isLoggedIn,(req, res) =>{
        var time = parseInt(req.params.time);
        postHelper.getAllPosts(time)
        .then((postData)=>{
            res.send(postData);
        })
        .catch(err => {
            console.log(err);
            serverHelper.sendDatabaseError(res, err);
        })
    });

    app.put('/settings/emailChange/user/:userId', validate({body: emailChangeSchema}), serverHelper.isLoggedIn, (req, res) => {
        var data = req.body;
        if(req.params.userId.str!==req.user._id.str) return res.status(401).end();
        var userId = new ObjectID(req.params.userId);
        serverHelper.getUserData(userId)
        .then(userData=>{
            if (userData.email === data.oldEmail && serverHelper.validateEmail(data.newEmail)) {
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
                .catch(err=>serverHelper.sendDatabaseError(res,err));
            } else {
                res.send(true);
            }
        })
        .catch(err=>serverHelper.sendDatabaseError(res,err));
    });

    app.put('/settings/passChange/user/:userId', validate({body: passSchema}), serverHelper.isLoggedIn, (req, res)=>{
        if(req.params.userId.str!==req.user._id.str) return res.status(401).end();
        let data = req.body;
        let oldPass = data.oldPass;
        let newPass = data.newPass;
        let userId = new ObjectID(req.params.userId);
        db.collection('users').findOneAsync({
            _id: userId
        })
        .then(userData=>{
            bcrypt.compareAsync(oldPass, userData.password)
            .then(success=>{
                if(!success || zxcvbn(newPass).score < 2){
                    return 'error';
                }
                return bcrypt.hashAsync(newPass,10);
            })
            .then(hash=>{
                if(hash === 'error'){
                    return 'error';
                }
                return db.collection('users').updateOneAsync({
                    _id: userId
                },{
                    $set: {
                        password: hash
                    }
                })
            })
            .then((result)=>{
                if(result === 'error')
                    res.send(true);
                else res.send(false);
            })
            .catch(err=>serverHelper.sendDatabaseError(res,err));
        })
    });

    app.put('/settings/avatar/user/:userId', serverHelper.isLoggedIn, (req, res) => {
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
            let buffer = new Buffer.from(body.img.split(',')[1], 'base64');
            Jimp.read(buffer)
            .then(image => {
                image.quality(10)
                .cover(512,512,Jimp.HORIZONTAL_ALIGN_CENTER,Jimp.VERTICAL_ALIGN_MIDDLE)
                .write("../client/build/img/avatar/" + userId + ".jpg");
            })
        })
        .catch(err=>{throw(err)})
    });

    // get activity Feed data
    app.get('/user/:userid/activity/:count',cache(30), serverHelper.isLoggedIn,(req, res) => {
        let userId = new ObjectID(req.params.userid);
        let count = parseInt(req.params.count);
        activityHelper.getActivityFeedData(userId, count)
        .then(activityData=>res.send(activityData))
        .catch(err=>{
            console.log(err);
            serverHelper.sendDatabaseError(res, err)
        });
    });

    //post activity
    app.post('/createActivity', validate({body: activitySchema}), serverHelper.isLoggedIn,(req, res) => {
        var body = req.body;
        if(body.author.str!==req.user._id.str) return res.status(401).end();
        activityHelper.createActivity(body,function(err,activityData){
            if(err)
            return serverHelper.sendDatabaseError(res,err);
            else{
                res.send(activityData);
            }
        });
    });

    //get activity detail
    app.get('/activityItem/:activityId', serverHelper.isLoggedIn, (req, res) => {
        var activityId = new ObjectID(req.params.activityId);
        activityHelper.getActivityFeedItem(activityId)
        .then(activityData=>res.send(activityData))
        .catch(err=>{
            serverHelper.sendDatabaseError(res,err)
        })
    });

    //get activity chat messages
    app.get('/activityItem/:activityId/messages/:date', serverHelper.isLoggedIn, (req, res)=>{
        let activityId = new ObjectID(req.params.activityId);
        let date = parseInt(req.params.date);
        activityHelper.getActivityChatMessages(activityId, date)
        .then(messages=>{
            res.send(messages);
        })
        .catch(err=>serverHelper.sendDatabaseError(res,err));
    });

    //like activity
    app.put('/activityItem/:activityId/likelist/:userId', serverHelper.isLoggedIn, (req, res) => {
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
                serverHelper.resolveUserObjects(result.value.likeCounter, function(err, userMap) {
                    if (err) {
                        serverHelper.sendDatabaseError(res, err);
                    } else {
                        result.value.likeCounter = result.value.likeCounter.map((id) => userMap[id]);
                        res.send(result.value.likeCounter);
                    }
                });
            }
        })
        .catch(err=>serverHelper.sendDatabaseError(res,err));
    });

    //unlike activity
    app.delete('/activityItem/:activityId/likelist/:userId', serverHelper.isLoggedIn,(req, res) => {
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
                serverHelper.resolveUserObjects(result.value.likeCounter, function(err, userMap) {
                    if (err) {
                        serverHelper.sendDatabaseError(res, err);
                    } else {
                        result.value.likeCounter = result.value.likeCounter.map((id) => userMap[id]);
                        res.send(result.value.likeCounter);
                    }
                });
            }
        })
        .catch(err=>serverHelper.sendDatabaseError(res,err));
    });

    //post ADcomments
    app.post('/activityItem/:activityId/commentThread/comment', validate({body: commentSchema}), serverHelper.isLoggedIn,(req, res) => {
        var body = req.body;
        var activityItemId = new ObjectID(req.params.activityId);
        var userId = body.author;
        if(userId.str!==req.user._id.str) return res.status(401).end();

        db.collection('activityItemComments').findOneAndUpdateAsync({
            _id: activityItemId
        },{
            $push: {
                comments: {
                    "author": new ObjectID(userId),
                    "postDate": (new Date()).getTime(),
                    "text": body.text
                }
            }
        },{
            upsert: true
        })
        .then(()=>{
            return db.collection('activityItems').findAndModifyAsync({
                _id: activityItemId
            },[],{
                $inc: {commentsCount:1}
            },{
                new: true
            })
        })
        .then((activityItem)=>{
            activityItem = activityItem.value;
            return activityHelper.resolveActivityItem(activityItem);
        })
        .then(resolvedActivityItem=>res.send(resolvedActivityItem))
        .catch(err=>serverHelper.sendDatabaseError(res, err));
    });

    app.get('/activityItem/:activityItemId/comment/:date', serverHelper.isLoggedIn, (req, res)=>{
        let activityItemId = req.params.activityItemId;
        let date = req.params.date;
        activityHelper.getActivityItemComments(new ObjectID(activityItemId), date)
        .then(comments=>res.send(comments))
        .catch(err=>serverHelper.sendDatabaseError(res, err));
    });

    //get notification
    app.get('/user/:userId/notification', serverHelper.isLoggedIn,(req, res) => {
        if(req.params.userId.str!==req.user._id.str) return res.status(401).end();
        var userId = new ObjectID(req.params.userId);
        db.collection('users').findOneAsync({
            _id: userId
        })
        .then(userData=>{
            if (userData === null)
            return res.status(400).end();
            else {
                notificationHelper.getNotificationData(userData.notification)
                .then(notificationData => {
                    res.send(notificationData);
                })
                .catch(err=>serverHelper.sendDatabaseError(res, err));
            }
        })
        .catch(err=>serverHelper.sendDatabaseError(res,err));
    });

    //acceptRequest friend request
    app.put('/notification/:notificationId/:userId', serverHelper.isLoggedIn,(req, res) => {
        if(req.params.userId.str!==req.user._id.str) return res.status(401).end();
        var userId = new ObjectID(req.params.userId);
        var notificationId = new ObjectID(req.params.notificationId);
        notificationHelper.getNotificationItem(notificationId)
        .then(notification => {
            db.collection('users').updateOneAsync({_id: userId},{
                $addToSet: {
                    friends: notification.sender._id
                }
            });
            db.collection('users').updateOneAsync({_id: notification.sender._id}, {
                $addToSet: {
                    friends: userId
                }
            });
            chatHelper.createSession(notification.sender._id, userId);
            notificationHelper.friendReuqest(userId, notification.sender._id, true);
            return notificationHelper.deleteNotification(notificationId, userId);
        })
        .then(notificationData=>{
            res.send(notificationData);
        })
        .catch(err=>serverHelper.sendDatabaseError(res,err));
    });

    //notificationHelper.deleteNotification
    app.delete('/notification/:notificationId/:userId', serverHelper.isLoggedIn,(req, res) => {
        if(req.params.userId.str!==req.user._id.str) return res.status(401).end();
        var userId = new ObjectID(req.params.userId);
        var notificationId = new ObjectID(req.params.notificationId);
        notificationHelper.deleteNotification(notificationId, userId)
        .then(notificationData => {
            res.send(notificationData);
        })
        .catch(err=>serverHelper.sendDatabaseError(res, err));
    });

    //accept activity request
    app.put('/acceptactivity/:notificationId/:fromuser',serverHelper.isLoggedIn,(req, res) =>{
        if(req.params.fromuser.str!==req.user._id.str) return res.status(401).end();
        var user = new ObjectID(req.params.fromuser);
        var notificationId = new ObjectID(req.params.notificationId);
        notificationHelper.getNotificationItem(notificationId)
        .then(notification=>{
            var userToAdd;
            if(notification.RequestOrInvite==="request"){
                userToAdd = notification.sender._id
            }
            else{
                userToAdd = notification.target._id
            }

            db.collection('activityItems').updateOneAsync({
                _id:notification.activityid
            },{
                $addToSet:{
                    participants:userToAdd
                }
            })
            .then(()=>{
                notificationHelper.activityNotification(notification.target._id, 
                    notification.sender._id, notification.activityid, 
                    notification.RequestOrInvite, true);
                return notificationHelper.deleteNotification(notificationId,user)
            })
            .then(notificationData=>{
                res.send(notificationData);
            })
            .catch(err=>{
                return serverHelper.sendDatabaseError(res,err);
            });
        })
        .catch(err=>serverHelper.sendDatabaseError(res,err));
    });

    //chatHelper.getMessage
    app.get('/user/:userId/chatsession/:id/:time', serverHelper.isLoggedIn,(req, res) => {
        if(req.params.userId.str!==req.user._id.str) return res.status(401).end();
        var id = req.params.id;
        var userid = req.params.userId;
        var time = parseInt(req.params.time);
        db.collection('messageSession').findOneAsync({
            _id: new ObjectID(id)
        })
        .then(message=>{
            if(message == null){
                res.status(400);
                res.send();
            }
            else {
                db.collection('messageSession').updateOneAsync({_id:new ObjectID(id)},{
                    $set:{
                        ["unread."+userid]: 0
                    }
                })
                .then(()=>{
                    return chatHelper.getMessage(time, message.contents);
                })
                .then((messages)=>{
                    res.status(201);
                    res.send(messages);
                })
                .catch(err=>serverHelper.sendDatabaseError(res,err));
            }
        })
        .catch(err=>serverHelper.sendDatabaseError(res,err))
    });

    app.get('/getsession/:userid/:targetid', cache(600), serverHelper.isLoggedIn,(req, res) => {
        var userid = req.params.userid;
        if(userid.str!==req.user._id.str) return res.status(401).end();
        var targetid = req.params.targetid;
        chatHelper.getSession(new ObjectID(userid), new ObjectID(targetid))
        .then(session=>{
            res.status(201);
            res.send(session);
        })
        .catch(err=>serverHelper.sendDatabaseError(res,err));
    });

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
    app.get('/search/:querytext',cache(10),serverHelper.isLoggedIn,(req, res) =>{
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
            return new Promise((resolve, reject) => {
                var data = {};
                data["users"] = u;
                data["posts"] = p;
                if(a.length===0){
                    data["activities"] = [];
                    return resolve(data);
                }
                var resolvedActivities = [];
                a.forEach((element)=>{
                    serverHelper.getUserData(new ObjectID(element.author))
                    .then((userObj)=>{
                        element.author = userObj;
                        resolvedActivities.push(element);
                        if(resolvedActivities.length===a.length){
                            data["activities"] = resolvedActivities;
                            resolve(data);
                        }
                    })
                    .catch(err=>reject(err));
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
                postHelper.resolvePostItem(c)
                .then(postItem => {
                    resolvedPosts.push(postItem);
                    if (resolvedPosts.length === p.length) {
                        data["posts"] = resolvedPosts;
                        return res.send(data);
                    }
                })
                .catch(err => {serverHelper.sendDatabaseError(res,err)})
            })
        })
        .catch(err=>serverHelper.sendDatabaseError(res,err));
    });

    app.post('/signup',validate({body:userSchema}),(req,res,next) =>{
        passport.authenticate('signup', function(err, user) {
            if (err) { return serverHelper.sendDatabaseError(res,err); }
            if (!user) { return res.status(400).end(); }
            return res.send();
        })(req,res,next);
    })


    app.post('/login',validate({body:loginSchema}),(req,res,next) =>{
        passport.authenticate('login', function(err, user, info) {
            if (err) { return serverHelper.sendDatabaseError(res,err); }
            if (!user) { return res.status(401).end(); }
            req.login(user,()=>{
                res.send(info);
            })
        })(req,res,next);
    });

    app.get('/auth/facebook', passport.authenticate('facebook',{ scope: ['email']}));
    app.get('/auth/facebook/callback',(req,res,next) =>{
        passport.authenticate('facebook', { scope: ['email']},function(err, user, info) {
            if (err) { return serverHelper.sendDatabaseError(res,err); }
            if (!user) { return res.status(400).end(); }
            req.login(user,()=>{
                res.redirect('/#/activity/?data='+JSON.stringify(info));
            })
        })(req,res,next);
    })

    app.get('/logout', (req, res) =>{
        req.logout();
        res.redirect('/');
    });

    var server, httpsServer;

    if(PROD){
        server = http.createServer(function (req, res) {
             res.writeHead(301, { "Location": "https://www.w1meet.com:443/"});
             res.end();
        },app);
        httpsServer = https.createServer({
            key: privateKey, 
            cert: certificate, 
            ca: ca, 
            requestCert: true, 
            rejectUnauthorized: false},app);
    }
    else{
        server = http.createServer(app);
    }

    var io = require('socket.io')(PROD? httpsServer:server);
    var passportSocketIo = require("passport.socketio");
    io.set('authorization', passportSocketIo.authorize({
        key: 'wemeetSessionId',
        cookieParser: cookieParser,
        secret: secretKey,
        store: sessionStore,
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail
    }));

    function onAuthorizeSuccess(data, accept) {
        console.log('successful connection to socket.io');
        accept(null, true);
    }

    function onAuthorizeFail(data, message, error, accept) {
        if(error)
            console.log('failed connection to socket.io:', message);
        accept(null, false);
    }

    var socketUserMap = {};

    io.on('connection', (socket)=>{
        //disconnect is called when user closes browser or refresh the page
        socket.on('disconnect', function () {
            db.collection('userSocketIds').findOne({socketId:socket.id},function(err,socketData){
                if(socketData!==null){
                    db.collection('users').findAndModifyAsync(
                        {_id: socketData.userId},
                        [],
                        {$set: {online: false}},
                        {new: true}
                    )
                    .then(res=>{
                        let userData = res.value;
                        //join to all the chat sessions
                        userData.sessions.forEach(session=>{
                            socket.leave('chat/'+session)
                        });
        
                        socket.broadcast.emit('online',{
                            user: socketData.userId.toString(),
                            online: false
                        });
                    });
                }
            });
        });

        //when user clicks the logout button
        socket.on('logout',function(userId){

            socket.leave('user/'+userId);
            db.collection('users').findAndModifyAsync(
                {_id: new ObjectID(userId)},
                [],
                {$set: {online: false}},
                {new: true}
            )
            .then(res=>{
                let userData = res.value;
                //join to all the chat sessions
                userData.sessions.forEach(session=>{
                    socket.leave('chat/'+session)
                });

                socket.broadcast.emit('online',{
                    user: userId,
                    online: false
                });
            });
        });

        
        socket.on('user',function(userId){
            // join to it's own user id
            socket.join('user/'+userId);

            //put socketId -> userId to the map
            socketUserMap[socket.id] = userId;

            db.collection('users').findAndModifyAsync(
                {_id: new ObjectID(userId)},
                [],
                {$set: {online: true}},
                {new: true}
            )
            .then(res=>{
                let userData = res.value;
                //join to all the chat sessions
                userData.sessions.forEach(session=>{
                    socket.join('chat/'+session)
                });

                socket.broadcast.emit('online',{
                    user: userId,
                    online: true
                })
            });

            //update socketid
            db.collection('userSocketIds').updateOne({userId:new ObjectID(userId)},{
                $set:{
                    socketId:socket.id
                }
            },{upsert: true});

        });

        socket.on('chat',function(data){
            chatHelper.postMessage(new ObjectID(data.sender), new ObjectID(data.target), 
                new ObjectID(data.sessionId), data.date, data.message, data.imgs)
            .then((updatedSession)=>{
                io.to('chat/'+data.sessionId).emit('chat',{
                    sender: data.sender,
                    sessionData: updatedSession,
                    date: data.date,
                    message: data.message,
                    imgs: data.imgs
                });
            })
            .catch(err=>{
                console.log(err);
            });
        });

        /*This part is fine*/
        socket.on('newPost',()=>{
            socket.broadcast.emit('newPost');
        });

        socket.on('newActivity',()=>{
            socket.broadcast.emit('newActivity');
        });

        socket.on('activity notification',(data)=>{
            // io.to('user/'+data.sender).emit('activity notification', {error: false});
            notificationHelper.activityNotification(new ObjectID(data.sender),
            new ObjectID(data.target), new ObjectID(data.activityId), data.type, false)
            .then(()=>{
                io.to('user/'+data.target).emit('notification');
                io.to('user/'+data.sender).emit('activity notification', {error: false});
            })
            .catch(err=>{
                console.log(err);
                io.to('user/'+data.sender).emit('activity notification', {error: true});
            });
        });

        socket.on('friend notification',(data)=>{
            // io.to('user/'+data.sender).emit('friend notification',{error: true});
            notificationHelper.friendReuqest(new ObjectID(data.sender), new ObjectID(data.target), false)
            .then(()=>{
                io.to('user/'+data.target).emit('notification');
                io.to('user/'+data.sender).emit('friend notification',{error: false});
            })
            .catch(err=>{
                console.log(err);
                io.to('user/'+data.sender).emit('friend notification',{error: true});
            });
        });

        socket.on('accept notification',function(data){
            io.to('user/'+data.target).emit('notification');
        });

        socket.on('join activity chat room',(data)=>{
            socket.join('activity/'+data.activityId);

            let users = io.sockets.adapter.rooms['activity/'+data.activityId];
            serverHelper.getUserData(new ObjectID(data.user))
            .then(userData=>{
                io.to('activity/'+data.activityId).emit('user joined',{
                    numberOfUsers: users === undefined ? 0:users.length,
                    user: userData
                })
            })
            .catch(err=>{
                console.log(err);
            })
        });

        socket.on('leave activity chat room',(data)=>{
            socket.join('activity/'+data.activityId);
            serverHelper.getUserData(new ObjectID(data.user))
            .then(userData=>{
                let users = io.sockets.adapter.rooms['activity/'+data.activityId];
                if(users !== undefined) {
                    io.to('activity/'+data.activityId).emit('user left',{
                        numberOfUsers: users.length,
                        user: userData
                    })
                }
            })
            .catch(err=>{
                console.log(err);
            })
        });

        socket.on('activity chat message', (data)=>{
            let activityId = new ObjectID(data.activityId);
            
            let chatData = {
                author: new ObjectID(data.author),
                postDate: (new Date()).getTime(),
                text: data.text
            }
            //save data
            activityHelper.saveActivityChatMessages(activityId, chatData)
            .then(()=>{
                return serverHelper.getUserData(new ObjectID(chatData.author));
            })
            .then(userData=>{
                chatData.author = userData
                io.to('activity/'+activityId).emit('new activity chat message', chatData);
            })
            .catch(err=>{
                console.log(err);
            });
        });

    });

    
    if(PROD){
        httpsServer.listen(443,function(){
            console.log('https on port 443');
        });
        
        server.listen(80, function() {
            console.log('http on port 80');
        });
    }
    else{
        server.listen(3000, function() {
            console.log('app listening on port 3000!');
        });
    }
});
