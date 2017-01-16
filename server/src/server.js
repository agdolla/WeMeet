// Imports the express Node module.
var express = require('express');
var compression = require('compression');
// Creates an Express server.
var app = express();
var http = require('http');
// var https = require('https');
var bodyParser = require('body-parser');
// Support receiving JSON in HTTP request bodies
var mongo_express = require('mongo-express/lib/middleware');
// Import the default Mongo Express configuration
var mongo_express_config = require('mongo-express/config.default.js');
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
    var cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
      return next();
    }
    res.status(401).end();
}

MongoClient.connect(url, function(err, db) {
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
	app.use('/mongo_express', mongo_express(mongo_express_config));

	if (err)
			console.log(err);
	else {
			console.log("connected to database")
	}

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
    done(null, user);
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
    },
    function(req, username, password, done) {
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
   }));

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
							},secretKey,{expiresIn:'7 days'},function(token){
								delete user.password;
								return done(null,user._id,{
									user:user,
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
					var regex = /^data:.+\/(.+);base64,(.*)$/;
					var matches = element.match(regex);
					var data = matches[2];
					var buffer = new Buffer(data, 'base64');
					
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
			// var fromUser = getUserIdFromToken(req.get('Authorization'));
			// if (fromUser === body.userId) {
				postStatus(new ObjectID(body.userId), body.text, body.location, body.img)
				.then(function(newPost){
					res.status(201);
					res.send(newPost);
				})
				.catch(err => {
					sendDatabaseError(res, err);
				})
			// } else {
					// res.status(401).end();
			// }
	});

	//like post
	app.put('/postItem/:postItemId/likelist/:userId', isLoggedIn,function(req, res) {
			// var fromUser = getUserIdFromToken(req.get('Authorization'));
			var postItemId = req.params.postItemId;
			var userId = req.params.userId;

			// if (userId === fromUser) {
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
			// } else {
					// res.status(401).end();
			// }
	});

	//unlike post
	app.delete('/postItem/:postItemId/likelist/:userId', isLoggedIn,function(req, res) {
			// var fromUser = getUserIdFromToken(req.get('Authorization'));
			var postItemId = req.params.postItemId;
			var userId = req.params.userId;
			// if (userId === fromUser) {
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
			// } else {
					// res.status(401).end();
			// }
	});

	function resolveUserObjects(userList, callback) {
			// Special case: userList is empty.
			// It would be invalid to query the database with a logical OR
			// query with an empty array.
			if (userList.length === 0) {
					callback(null, {});
			} else {
					// Build up a MongoDB "OR" query to resolve all of the user objects
					// in the userList.
					var query = {
							$or: userList.map((id) => {
									return {_id: id}
							})
					};
					// Resolve 'like' counter
					db.collection('users').find(query).toArray(function(err, users) {
							if (err) {
									return callback(err);
							}
							// Build a map from ID to user object.
							// (so userMap["4"] will give the user with ID 4)
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
					});
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
						resolveSessionObject(userData.sessions)
						.then(sessionMap => {
							userData.sessions = userData.sessions.map((id) => sessionMap[id]);
							delete userData.password;
							callback(null, userData);
						})
					});
				}
			})
			.catch(err => {callback(err)})
	}

	app.get('/chatNotification/:userid',isLoggedIn,function(req,res){
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
	app.get('/user/:userId',cache(100),isLoggedIn,function(req, res) {
			var userId = req.params.userId;
			getUserData(new ObjectID(userId), function(err, userData) {
					if (err)
							return sendDatabaseError(res, err);
					res.send(userData);
			});
	});

	//post comments
	app.post('/postItem/:postItemId/commentThread/comment', validate({body: commentSchema}), isLoggedIn,function(req, res) {
			// var fromUser = getUserIdFromToken(req.get('Authorization'));
			var body = req.body;
			var postItemId = req.params.postItemId;
			var userId = body.author;
			// if (fromUser === userId) {
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
			// } else {
					// res.status(401).end();
			// }
	});

	//change user info
	app.put('/settings/user/:userId', validate({body: userInfoSchema}), isLoggedIn, function(req, res) {
			var data = req.body;
			var moment = require('moment');
			var userId = new ObjectID(req.params.userId);
			// var fromUser = new ObjectID(getUserIdFromToken(req.get('Authorization')));
			// if (fromUser.str === userId.str) {
					db.collection('users').updateOne({
							_id: userId
					}, {
							$set: {
									fullname:data.fullname,
									nickname: data.nickname,
									description: data.description,
									location: data.location,
									birthday: moment(data.birthday).valueOf()
							}
					}, function(err) {
							if (err)
									return sendDatabaseError(res, err);
							getUserData(userId, function(err, userData) {
									if (err)
											return sendDatabaseError(res, err);
									res.send(userData);
							});
					});
			// } else {
					// res.status(401).end();
			// }
	});

	function getActivityFeedItem(activityId, callback) {
			db.collection('activityItems').findOne({
					_id: activityId
			}, function(err, activityItem) {
				if(activityItem===null){
					callback(null,activityItem)
				}
					if (err)
							return callback(err);

					resolveActivityItem(activityItem,callback);

			});
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

	function getAllActivities(callback){
		db.collection('activityItems').findAsync()
		.then(cursor =>{
			return cursor.toArrayAsync();
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
						collection = resolvedActivities.reverse();
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

	app.get('/user/:userId/activities',cache(10),isLoggedIn,function(req,res){
		var userId = req.params.userId;
		// var fromUser = getUserIdFromToken(req.get('Authorization'));
		// if(userId === fromUser){
			getAllActivities(function(err, activityData) {
				if (err)
				sendDatabaseError(res, err);
				else {
					res.send(activityData);
				}
			});
		// }
		// else{
			// res.status(401).end();
		// }
	});

	app.get('/user/:userId/posts/:time',cache(10),isLoggedIn,function(req,res){
		var userId = req.params.userId;
		var time = parseInt(req.params.time);
		var fromUser = getUserIdFromToken(req.get('Authorization'));
		if(userId === fromUser){
			getAllPosts(time)
			.then((postData)=>{
				res.send(postData);
			})
			.catch(err => {
				sendDatabaseError(res, err);
			})
		}
		else{
			res.status(401).end();
		}
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

	app.put('/settings/emailChange/user/:userId', validate({body: emailChangeSchema}), isLoggedIn,function(req, res) {
			var data = req.body;
			var userId = new ObjectID(req.params.userId);
			// var fromUser = new ObjectID(getUserIdFromToken(req.get('Authorization')));
			// if (fromUser.str === userId.str) {
					getUserData(userId, function(err, userData) {
							if (err)
									return sendDatabaseError(res, err);
							else if (userData.email === data.oldEmail && validateEmail(data.newEmail)) {
									db.collection('users').updateOne({
											_id: userId
									}, {
											$set: {
													email: data.newEmail
											}
									}, function(err) {
											if (err)
													return sendDatabaseError(res, err);
											else {
													res.send(false);
											}
									});
							} else {
									res.send(true);
							}
					});
			// } else {
					// res.statsus(401).end();
			// }
	});

	app.put('/settings/avatar/user/:userId', isLoggedIn, function(req, res) {
			var userId = new ObjectID(req.params.userId);
			// var fromUser = new ObjectID(getUserIdFromToken(req.get('Authorization')));
			var body = req.body;
			// if (fromUser.str === userId.str) {
				var regex = /^data:.+\/(.+);base64,(.*)$/;
				var matches = body.img.match(regex);
				var data = matches[2];
				var buffer = new Buffer(data, 'base64');

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
							res.send(result.value);
							Jimp.read(buffer)
							.then(image => {
							image.quality(10)
							.cover(512,512,Jimp.HORIZONTAL_ALIGN_CENTER,Jimp.VERTICAL_ALIGN_MIDDLE)
							.write("../client/build/img/avatar/" + userId + ".jpg");
						})
					})
					.catch(err=>{throw(err)})
			// } else {
					// res.status(401).end();
			// }
	});

	app.put('/settings/location/user/:userId', isLoggedIn,function(req, res) {
			var userId = req.params.userId;
			// var fromUser = getUserIdFromToken(req.get('Authorization'));
			var body = req.body;
			// if (fromUser === userId) {
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
			// }
	});

	// get activity Feed data
	app.get('/user/:userid/activity',cache(10), isLoggedIn,function(req, res) {
			var userId = new ObjectID(req.params.userid);
			// var fromUser = getUserIdFromToken(req.get('Authorization'));
			// if(userId === fromUser){
			getActivityFeedData(userId, function(err, activityData) {
					if (err)
							sendDatabaseError(res, err);
					else {
							res.send(activityData);
					}
			});
			// }
			// else{
			// res.status(401).end();
			// }
	});

	function postActivity(data,callback) {
			data.participants=[];
			data.likeCounter=[];
			data.comments=[];
			data.author = new ObjectID(data.author);
			delete data.cropperOpen;
			db.collection('activityItems').insertOne(data,function(err,result){
				if(err)
					return callback(err);
				else{
					data._id=result.insertedId;
					db.collection('users').findOne({_id:new ObjectID(data.author)},function(err,userData){
						if(err)
							return callback(err);
						else{
							db.collection('activities').updateOne({_id:userData.activity},{
								$push: {
									contents: {
										$each: [data._id],
										$position: 0
									}
								}
							},function(err){
								if(err)
								callback(err);
								else{
									callback(null,data);
								}
							});
						}
					});
				}
			});
	}
	//post activity
	app.post('/postActivity', validate({body: activitySchema}), isLoggedIn,function(req, res) {
			var body = req.body;
			// var fromUser = getUserIdFromToken(req.get('Authorization'));
			// if (fromUser === body.author) {
				postActivity(body,function(err,activityData){
					if(err)
						return sendDatabaseError(res,err);
					else{
						res.send(activityData);
					}
				});
			// } else {
					// res.status(401).end();
			// }
	});

	//get activity detail
	app.get('/activityItem/:activityId',cache(100), isLoggedIn, function(req, res) {
			var activityId = new ObjectID(req.params.activityId);
			getActivityFeedItem(activityId, function(err, activityData) {
					res.status(201);
					res.send(activityData);
			});
	});

	//like activity
	app.put('/activityItem/:activityId/likelist/:userId', isLoggedIn, function(req, res) {
			// var fromUser = getUserIdFromToken(req.get('Authorization'));
			var activityId = new ObjectID(req.params.activityId);
			var userId = req.params.userId;
			// if (userId === fromUser) {
					var update = {
							$addToSet: {}
					};
					update.$addToSet["likeCounter"] = new ObjectID(userId);
					db.collection('activityItems').findAndModify({
							_id: activityId
					}, [
							['_id', 'asc']
					], update, {
							"new": true
					}, function(err, result) {
							if (err) {
									return sendDatabaseError(res, err);
							} else if (result.value === null) {
									// Filter didn't match anything: Bad request.
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
					});
			// } else {
			//     // Unauthorized.
			//     res.status(401).end();
			// }
	});

	//unlike activity
	app.delete('/activityItem/:activityId/likelist/:userId', isLoggedIn,function(req, res) {
			// var fromUser = getUserIdFromToken(req.get('Authorization'));
			var activityId = new ObjectID(req.params.activityId);
			var userId = req.params.userId;
			// if (userId === fromUser) {
					var update = {
							$pull: {}
					};
					update.$pull["likeCounter"] = new ObjectID(userId);
					db.collection('activityItems').findAndModify({
							_id: activityId
					}, [
							['_id', 'asc']
					], update, {
							"new": true
					}, function(err, result) {
							if (err) {
									return sendDatabaseError(res, err);
							} else if (result.value === null) {
									// Filter didn't match anything: Bad request.
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
					});
			// } else {
			//     // Unauthorized.
			//     res.status(401).end();
			// }
	});

	//post ADcomments
	app.post('/activityItem/:activityId/commentThread/comment', validate({body: commentSchema}), isLoggedIn,function(req, res) {
			var fromUser = getUserIdFromToken(req.get('Authorization'));
			var body = req.body;
			// var activityItemId = new ObjectID(req.params.activityId);
			var userId = body.author;
			// if (fromUser === userId) {
					db.collection('activityItems').updateOne({
							_id: activityItemId
					}, {
							$push: {
									comments: {
											"author": new ObjectID(userId),
											"postDate": (new Date()).getTime(),
											"text": body.text
									}
							}
					}, function(err) {
							if (err) {
									sendDatabaseError(res.err);
							} else {
									getActivityFeedItem(activityItemId, function(err, activityData) {
											if (err) {
													sendDatabaseError(res, err);
											} else {
													res.send(activityData);
											}
									});
							}
					});
			// } else {
					// res.status(401).end();
			// }
	});

	function getNotificationItem(notificationId, callback) {
			db.collection('notificationItems').findOne({
					_id: notificationId
			},   function(err, notification) {
					if (err)
							return callback(err);
					else if (notification === null)
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
			});
	}

	function getNotificationData(notificationId, callback) {
			db.collection('notifications').findOne({
					_id: notificationId
			}, function(err, notifications) {
					if (err)
							return callback(err);
							else if (notifications === null) {
									callback(null, null);
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
			});
	}

	//get notification
	app.get('/user/:userId/notification', isLoggedIn,function(req, res) {
			// var fromUser = new ObjectID(getUserIdFromToken(req.get('Authorization')));
			var userId = new ObjectID(req.params.userId);
			// if (fromUser.str === userId.str) {
					db.collection('users').findOne({
							_id: userId
					}, function(err, userData) {
							if (err)
									return sendDatabaseError(res, err);
							else if (userData === null)
									return res.status(400).end();
							else {
									getNotificationData(userData.notification, function(err, notificationData) {
											if (err)
													return sendDatabaseError(res, err);
											res.send(notificationData);
									});
							}
					});
			// } else {
					// res.status(401).end();
			// }
	});

	function deleteNotification(notificationId, userId, callback) {
			db.collection('users').findOne({
					_id: userId
			}, function(err, userData) {
					if (err)
							callback(err);
					else if (userData === null)
							callback(null, null);
					else {
							db.collection('notifications').updateOne({
									_id: userData.notification
							}, {
									$pull: {
											contents: notificationId
									}
							}, function(err) {
									if (err)
											return callback(err);
									else {
											db.collection('notificationItems').remove({
													_id: notificationId
											}, function(err) {
													if (err)
															return callback(err);
													else {
															getNotificationData(userData.notification, function(err, notificationData) {
																	if (err)
																			return callback(err);
																	else {
																			callback(null, notificationData);
																	}
															});
													}
											});
									}
							});
					}
			});
	}

	//acceptRequest friend request
	app.put('/notification/:notificationId/:userId', isLoggedIn,function(req, res) {
			// var fromUser = new ObjectID(getUserIdFromToken(req.get('Authorization')));
			var userId = new ObjectID(req.params.userId);
			var notificationId = new ObjectID(req.params.notificationId);
			// if (fromUser.str === userId.str) {
					getNotificationItem(notificationId, function(err, notification) {
							if (err)
									return sendDatabaseError(res, err);
							else {
									db.collection('users').updateOne({
											_id: userId
									}, {
											$addToSet: {
													friends: notification.sender._id
											}
									}, function(err) {
											if (err)
													return sendDatabaseError(res, err);
											else {
												db.collection('users').updateOne({
														_id: notification.sender._id
												}, {
														$addToSet: {
																friends: userId
														}
												}, function(err) {
													if(err)
														return sendDatabaseError(res,err);

													deleteNotification(notificationId, userId, function(err, notificationData) {
														if (err)
														sendDatabaseError(res, err);
														else {
															res.send(notificationData);
														}
													});
												});
											}
									})
							}
					});
			// } else {
					// res.status(401).end();
			// }
	});

	//deleteNotification
	app.delete('/notification/:notificationId/:userId', isLoggedIn,function(req, res) {
			// var fromUser = new ObjectID(getUserIdFromToken(req.get('Authorization')));
			var userId = new ObjectID(req.params.userId);
			var notificationId = new ObjectID(req.params.notificationId);
			// if (fromUser.str === userId.str) {
					deleteNotification(notificationId, userId, function(err, notificationData) {
							if (err)
									sendDatabaseError(res, err);
							else {
									res.send(notificationData);
							}
					});
			// } else {
					// res.status(401).end();
			// }
	});

	//accept activity request
	app.put('/acceptactivity/:notificationId/:fromuser',isLoggedIn,function(req,res){
		// var fromUser = new ObjectID(getUserIdFromToken(req.get('Authorization')));
		var user = new ObjectID(req.params.fromuser);
		var notificationId = new ObjectID(req.params.notificationId);
		// if(fromUser.str === user.str){
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
								console.log(user)
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
							}
						)
				}
			});

	// }
	// else {
			// res.status(401).end();
	// }

});

	//getMessage
	app.get('/user/:userId/chatsession/:id/:time', isLoggedIn,function(req, res) {
			// var fromUser = getUserIdFromToken(req.get('Authorization'));
			var id = req.params.id;
			var userid = req.params.userId;
			var time = req.params.time;
			// if (userid == fromUser) {
					db.collection('messageSession').findOne({
							_id: new ObjectID(id)
					}, function(err, message) {
							if (err)
									sendDatabaseError(res, err);
							else if(message == null){
								res.status(400);
								res.send();
							}
							else {
								if(message.lastmessage===undefined?false:
									(message.lastmessage.target===undefined?"":message.lastmessage.target.str===userid.str)){
									db.collection('messageSession').updateOne({_id:new ObjectID(id)},{
										$set:{
											"lastmessage.isread":true
										}
									},function(err){
										if(err)
											return sendDatabaseError(res,err);
											getMessage(time, message.contents, function(err, messages) {
												if (err)
													sendDatabaseError(res, err);
												else {
													res.status(201);
													res.send(messages);
												}
											});
									})
								}
								else getMessage(time,message.contents, function(err, messages) {
									if (err)
									sendDatabaseError(res, err);
									else {
										res.status(201);
										res.send(messages);
									}
								});

							}
					})
			// }
	});

	//post message
	app.post('/user/:userid/chatsession/:id', isLoggedIn,function(req, res) {
		// var fromUser = getUserIdFromToken(req.get('Authorization'));
		var id = req.params.id;
		var userid = req.params.userid;
		var body = req.body;
		var time = (new Date()).getTime();
		// if (userid === fromUser) {
			var senderid = body.sender;
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
							db.collection('message').updateOne({
									_id: new ObjectID(contentsid)
							}, {
									$push: {
											messages: lastmessage
									}
							}, function(err) {
									if (err)
											sendDatabaseError(res.err);
									else {
											getMessage(time+1,contentsid, function(err, messages) {
													if (err)
															sendDatabaseError(res, err);
													else {
															//seting lastmessage;
															lastmessage.isread = false;
															db.collection("messageSession").updateOne({
																	_id: new ObjectID(id)
															}, {
																	$set: {
																			"lastmessage": lastmessage
																	}
															}, function(err) {
																	if (err)
																			sendDatabaseError(res, err);

																	else res.send(messages);
															});
													}
											});
									}
							})

					}
			});
		// } else {
				// res.status(401).end();
		// }
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

	app.get('/getsession/:userid/:targetid', cache(30), isLoggedIn,function(req, res) {
			// var fromUser = getUserIdFromToken(req.get('Authorization'));
			var userid = req.params.userid;
			// if (userid == fromUser) {
					var targetid = req.params.targetid;
					getSession(new ObjectID(userid), new ObjectID(targetid), function(err, session) {
							if (err)
									sendDatabaseError(res, err);
							else if(session===null){
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
					});
			// } else {
					// res.status(401).end();
			// }
	});

	function getSession(userid, targetid, cb) {
			db.collection("messageSession").findOne({
					users: {
							$all: [userid, targetid]
					}
			}, function(err, session) {
					if (err)
							return cb(err);
					cb(null, session);
			})
	}

	function getSessionContentsID(sessionid, cb) {

			db.collection("messageSession").findOne({
							_id: sessionid
			}, function(err, session) {

					if (err){
							return cb(err);
						}
					cb(null, session.contents);
			})
	}

	function createSession(userid, targetid, cb){
		db.collection("message").insertOne({
			messages:[]
		},function(err,message){
			if(err)
				cb(err);
			else{
				var newSession = {
					users : [userid, targetid],
					contents: message.insertedId,
					lastmessage : {}
				};
				db.collection("messageSession").insertOne(newSession,
					function(err,messageSession){
					if(err)
						cb(err)
					else{
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
					}
				})
			}
		})
	}

	/**
	 * Get the user ID from a token. Returns -1 (an invalid ID)
	 * if it fails.
	 */
		function getUserIdFromToken(authorizationLine) {
			try {
				// Cut off "Bearer " from the header value.
				var token = authorizationLine.slice(7);
				// Verify the token. Throws if the token is invalid or expired.
				var tokenObj = jwt.verify(token, secretKey);
				var id = tokenObj['id'];
				// Check that id is a string.
				if (typeof id === 'string') {
				return id;
				} else {
				// Not a string. Return "", an invalid ID.
				// This should technically be impossible unless
				// the server accidentally
				// generates a token with a number for an id!
				return "";
			}
		} catch (e) {
			// Return an invalid ID.
			return "";
		}
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
	app.get('/search/userid/:userid/querytext/:querytext',cache(10),isLoggedIn,function(req,res){
		// var fromUser = getUserIdFromToken(req.get('Authorization'));
		var querytext = req.params.querytext.toLowerCase();
		var userid = req.params.userid
		var data={};
		// if(userid === fromUser){
			db.collection('users').findAsync({
				$or:
					[
						{fullname:{$regex:querytext,$options:'i'}}
					]
			})
			.then(cursor => {
				return cursor.toArrayAsync();
			})
			.then(items => {
				data["users"]=items;

				db.collection('activityItems').find({
					description:{$regex:querytext,$options:'i'}
				}).toArray(function(err, activityitems) {
					if (err) {
						return sendDatabaseError(res, err);
					}
					data["activities"]=activityitems;

					db.collection('postFeedItems').find({
						['contents.text']:{$regex:querytext,$options:'i'}
					}).toArray(function(err, postitems) {
						if (err) {
							return sendDatabaseError(res, err);
						}

						var resolvedPosts = [];

						if (postitems.length === 0) {
							return res.send(data);
						}
						postitems.forEach((c) => {
							resolvePostItem(c)
							.then(postItem => {
								resolvedPosts.push(postItem);
								if (resolvedPosts.length === postitems.length) {
									data["posts"] = resolvedPosts;
									return res.send(data);
								}
							})
							.catch(err => {sendDatabaseError(res,err)})
						})

					})

				})
			})
			.catch(err => {sendDatabaseError(res,err)});
		// }
		// else{
			// res.status(401).end();
		// }
	});

	app.post('/signup',validate({body:userSchema}),function(req,res,next){
		passport.authenticate('signup', function(err, user, info) {
    if (err) { return sendDatabaseError(res,err); }
    if (!user) { return res.status(400).end(); }
    return res.send();
		})(req,res,next);
	})
	

	app.post('/login',validate({body:loginSchema}),function(req,res,next){
		passport.authenticate('login', function(err, user, info) {
    if (err) { return sendDatabaseError(res,err); }
    if (!user) { return res.status(400).end(); }
			req.login(user,()=>{
				res.send(info);
			})
		})(req,res,next);
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
		// var fromUser = getUserIdFromToken(req.get('Authorization'));
		var sender = req.params.sender;
		var target = req.params.target;
		// if(fromUser === sender){
			db.collection('notificationItems').insertOne({
				sender: new ObjectID(sender),
				target: new ObjectID(target),
				type:"FR"
			},function(err,result){
				if(err)
					sendDatabaseError(res,err);
				else{
					getUserData(new ObjectID(target),function(err,userData){
						if(err)
							sendDatabaseError(res,err);
						else{
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
						}
					});

				}
			});
		// }
		// else{
			// res.status(401).end();
		// }
	});

	app.post('/activityJoinRequest/:sender/:target/:activityid',isLoggedIn,function(req,res){
		// var fromUser = getUserIdFromToken(req.get('Authorization'));
		var sender = req.params.sender;
		var target = req.params.target;
		var activityid = req.params.activityid;
		// if(fromUser === sender){
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
					getUserData(new ObjectID(target),function(err,userData){
						if(err){
							sendDatabaseError(res,err);
						}
						else{
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
						}
					});
				}
			});
		// }
		// else{
			// res.status(401).end();
		// }
	});

	app.post('/activityInviteRequest/:sender/:target/:activityid',isLoggedIn,function(req,res){
		// var fromUser = getUserIdFromToken(req.get('Authorization'));
		var sender = req.params.sender;
		var target = req.params.target;
		var activityid = req.params.activityid;
		// if(fromUser === sender){
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
					getUserData(new ObjectID(target),function(err,userData){
						if(err){
							sendDatabaseError(res,err);
						}
						else{
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
						}
					});
				}
			});
		// }
		// else{
			// res.status(401).end();
		// }
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
					db.collection('users').updateOne({_id:socketData.userId},{
						$set:{
							online:false
						}
					});
					socket.broadcast.emit('online',socketData.userId);
				}
			});

			db.collection('userSocketIds').remove({socketId:socket.id});
		});

		socket.on('logout',function(user){
			db.collection('users').updateOne({_id:new ObjectID(user)},{
				$set:{
					online:false
				}
			});
			socket.broadcast.emit('online',user);
		});

		socket.on('user',function(user){

			db.collection('users').updateOne({_id:new ObjectID(user)},{
				$set:{
					online:true
				}
			});
			socket.broadcast.emit('online',user);
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
