'use strict'
const Promise = require("bluebird");
const uuidV1 = require('uuid/v1');
const Jimp = require("jimp");
const ObjectID = require('mongodb').ObjectID;
let ServerHelper = require('./serverHelper');

module.exports = class ActivityHelper {

    constructor(db) {
        this.database = db;
        this.serverHelper = new ServerHelper(db);
    }

    getActivityFeedItem(activityId) {
        return new Promise((resolve, reject) => {
            this.database.collection('activityItems').findOneAsync({
                _id: activityId
            })
                .then(activityitem => {
                    return this.resolveActivityItem(activityitem)
                })
                .then(resolvedActivityItem => resolve(resolvedActivityItem))
                .catch(err => reject(err));
        })
    }

    resolveActivityItem(activityItem) {
        return new Promise((resolve, reject) => {
            var userList = [activityItem.author];
            activityItem.likeCounter.map((id) => userList.push(id));
            activityItem.participants.map((id) => userList.push(id));
            this.serverHelper.resolveUserObjects(userList, function (err, userMap) {
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
            { $match: { _id: activityItemId } },
            { $unwind: '$comments' },
            { $match: { 'comments.postDate': { $lt: parseInt(date) } } },
            { $sort: { 'comments.postDate': -1 } },
            { $limit: 3 }
        ])
            .then((cursor) => {
                return cursor.toArray()
            })
            .then((comments) => {
                let postComments = comments.map((comment) => {
                    return comment.comments
                });
                return this.serverHelper.resolveComments(postComments);
            });
    }

    getActivityChatMessages(activityItemId, date) {
        return this.database.collection('activityItemChatMessages').aggregateAsync([
            { $match: { _id: activityItemId } },
            { $unwind: '$messages' },
            { $match: { 'messages.postDate': { $lt: date } } },
            { $sort: { 'messages.postDate': -1 } },
            { $limit: 10 }
        ])
            .then(cursor => {
                return cursor.toArray()
            })
            .then(messages => {
                let chatMessages = messages.reverse().map(message => {
                    return message.messages
                });
                return this.serverHelper.resolveComments(chatMessages);
            });
    }

    saveActivityChatMessages(activityId, data) {
        return this.database.collection('activityItemChatMessages').findOneAndUpdateAsync({
            _id: activityId
        }, {
                $push: {
                    messages: data
                }
            }, {
                upsert: true
            });
    }

    getAllActivities(time) {
        return new Promise((resolve, reject) => {
            this.database.collection('activityItems').findAsync({
                postDate: {
                    $lt: time
                }
            })
                .then(cursor => {
                    return cursor.limit(5).sort({ postDate: -1 }).toArrayAsync();
                })
                .then(collection => {
                    var resolvedActivities = [];

                    var processNextFeedItem = (i) => {
                        // Asynchronously resolve a feed item.
                        this.resolveActivityItem(collection[i])
                            .then(activityItem => {
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
                            .catch(err => {
                                reject(err)
                            })
                    }

                    if (collection.length === 0) {
                        resolve(collection);
                    } else {
                        processNextFeedItem(0);
                    }
                })
                .catch((err) => { reject(err) });
        })
    }

    getActivityFeedData(userId, count) {
        return new Promise((resolve, reject) => {
            this.database.collection('users').findOneAsync({
                _id: userId
            })
                .then(userData => {
                    if (userData === null)
                        reject(null)
                    else {
                        return this.database.collection('activities').findOneAsync({
                            _id: userData.activity
                        })
                    }
                })
                .then((activity) => {
                    if (activity === null)
                        reject(null);

                    var resolvedContents = [];

                    var processNextFeedItem = (i) => {
                        if (i >= activity.contents.length) {
                            activity.contents = resolvedContents;
                            resolve(activity);
                        }
                        // Asynchronously resolve a feed item.
                        this.getActivityFeedItem(activity.contents[i])
                            .then(feedItem => {
                                // Success!
                                resolvedContents.push(feedItem);
                                if (resolvedContents.length === 3) {
                                    // I am the final feed item; all others are resolved.
                                    // Pass the resolved feed document back to the callback.
                                    activity.contents = resolvedContents;
                                    resolve(activity);
                                } else {
                                    // Process the next feed item.
                                    processNextFeedItem(i + 1);
                                }
                            })
                            .catch(err => reject(err))
                    }

                    if (activity.contents.length === 0) {
                        activity.contents = []
                        resolve(activity);
                    } else {
                        processNextFeedItem(count);
                    }
                })
                .catch(err => { reject(err) })
        })
    }

    createActivity(data, callback) {

        if (data.img !== "./img/default.png") {
            var name = uuidV1();
            var img = data.img;
            data.img = "img/activity/" + name + '.jpg';
            var buffer = new Buffer.from(img.split(",")[1], 'base64');
            Jimp.read(buffer)
                .then(image => {
                    image.quality(30)
                        .write("../client/build/img/activity/" + name + ".jpg");
                })
        }
        data.participants = [];
        data.likeCounter = [];
        data.commentsCount = 0;
        data.author = new ObjectID(data.author);
        delete data.cropperOpen;
        this.database.collection('activityItems').insertOneAsync(data)
            .then(result => {
                data._id = result.insertedId;
            })
            .then(() => {
                return this.database.collection('users').findOneAsync({ _id: new ObjectID(data.author) })
            })
            .then(userData => {
                this.database.collection('activities').updateOne({ _id: userData.activity }, {
                    $push: {
                        contents: {
                            $each: [data._id],
                            $position: 0
                        }
                    }
                });
            })
            .then(() => {
                callback(null, data);
            })
            .catch(err => { callback(err); })
    }
}