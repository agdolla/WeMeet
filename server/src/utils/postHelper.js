'use strict'
const Promise = require("bluebird");
const uuidV1 = require('uuid/v1');
const Jimp = require("jimp");
let ServerHelper = require('./serverHelper');


module.exports = class PostHelper {
    constructor(db) {
        this.database = db;
        this.serverHelper = new ServerHelper(db);
    }

    getAllPosts(time) {
        return new Promise((resolve, reject) => {
            this.database.collection('postFeedItems').findAsync({
                "contents.postDate": {
                    $lt: time
                }
            })
                .then((cursor) => {
                    return cursor.limit(5).sort({ "contents.postDate": -1 }).toArrayAsync();
                })
                .then((collection) => {

                    var processNextFeedItem = (i) => {
                        this.resolvePostItem(collection[i])
                            .then(postItem => {
                                resolvedPosts.push(postItem);
                                if (resolvedPosts.length === collection.length) {
                                    return resolve(resolvedPosts);
                                }
                                else {
                                    processNextFeedItem(i + 1);
                                }
                            })
                    }
                    var resolvedPosts = [];
                    if (collection.length === 0) {
                        return resolve(collection);
                    }
                    else {
                        processNextFeedItem(0);
                    }
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    resolvePostItem(postFeedItem) {
        return new Promise((resolve, reject) => {
            var userList = [postFeedItem.contents.author];
            userList = userList.concat(postFeedItem.likeCounter);

            this.serverHelper.resolveUserObjects(userList, (err, userMap) => {
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

    getPostFeedItem(feedItemId) {
        return new Promise((resolve, reject) => {
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
                .then(postItem => {
                    resolve(postItem);
                })
                .catch(err => { reject(err) })
        });
    }

    getPostComments(postFeedId, date) {
        return this.database.collection('postFeedComments').aggregateAsync([
            { $match: { _id: postFeedId } },
            { $unwind: '$comments' },
            { $match: { 'comments.postDate': { $lt: parseInt(date) } } },
            { $sort: { 'comments.postDate': -1 } },
            { $limit: 3 }
        ])
            .then(cursor => { return cursor.toArray() })
            .then((comments) => {
                let postComments = comments.map((comment) => {
                    return comment.comments
                });
                return this.serverHelper.resolveComments(postComments);
            })
    }

    getPostFeedData(user, count) {
        return new Promise((resolve, reject) => {
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
                .then((feedData) => {
                    if (feedData === null) {
                        return resolve(null);
                    }
                    var processNextFeedItem = (i) => {
                        if (i >= feedData.contents.length) {
                            feedData.contents = resolvedContents;
                            resolve(feedData);
                        }
                        this.getPostFeedItem(feedData.contents[i])
                            .then(feedItem => {
                                resolvedContents.push(feedItem);
                                if (resolvedContents.length === 3) {
                                    feedData.contents = resolvedContents;
                                    return resolve(feedData);
                                } else {
                                    processNextFeedItem(i + 1);
                                }
                            })
                    }

                    var resolvedContents = [];
                    if (feedData.contents.length === 0) {
                        feedData.contents = [];
                        return resolve(feedData);
                    }
                    else {
                        processNextFeedItem(count);
                    }
                })
                .catch(err => { reject(err) })
        });
    }

    postStatus(user, text, img) {
        return new Promise((resolve, reject) => {
            var time = new Date().getTime();
            //generate unique name
            var name = uuidV1();

            var imgPath = [];

            for (var i = 0; i < img.length; i++) {
                imgPath.push("img/status/" + name + i + ".jpg");
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
                .then((result) => {
                    post._id = result.insertedId;
                    return this.database.collection("users").findOneAsync({
                        _id: user
                    });
                })
                .then((userData) => {
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
                .then(() => {
                    resolve(post);
                    img.forEach((element, index) => {
                        var buffer = new Buffer.from(element.split(",")[1], 'base64');
                        Jimp.read(buffer)
                            .then(image => {
                                image.quality(40)
                                    .write("../client/build/" + imgPath[index]);
                            })

                    });
                })
                .catch(err => reject(err))
        });
    }
}