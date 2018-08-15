'use strict';
let ServerHelper = require('./serverHelper');
let Promise = require('bluebird');

module.exports = class NotificationHelper {
    constructor(db) {
        this.database = db;
        this.serverHelper = new ServerHelper(db);
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
                this.serverHelper.resolveUserObjects(userList,function(err,userMap){
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

    hasNewNotification(userId){
        return new Promise((resolve, reject)=>{
            this.database.collection('notifications').findOneAsync({
                _id: userId
            })
            .then(notifications=>{
                if(notifications === null){
                    return resolve(0)
                }
                resolve(notifications.contents.length);
            })
            .catch(err=>reject(err));
        });
    }
}