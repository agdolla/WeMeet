'use strict';
let ServerHelper = require('./serverHelper');
let Promise = require('bluebird');

module.exports = class NotificationHelper {
    constructor(db) {
        this.database = db;
        this.serverHelper = new ServerHelper(db);
    }

    getNotificationItem(notificationId) {
        return new Promise((resolve, reject)=>{
            this.database.collection('notificationItems').findOneAsync({
                _id: notificationId
            })
            .then(notification=>{
                if (notification === null)
                    return resolve(null);
                else {
                    var userList = [notification.sender,notification.target];
                    this.serverHelper.resolveUserObjects(userList,function(err,userMap){
                        if(err)
                            reject(err);
                        else{
                            notification.sender = userMap[notification.sender];
                            notification.target = userMap[notification.target];
                            resolve(notification)
                        }
                    });
                }
            })
            .catch(err=>reject(err));
        })
    }

    getNotificationData(notificationId) {
        return new Promise((resolve, reject)=>{
            this.database.collection('notifications').findOneAsync({
                _id: notificationId
            })
            .then(notifications=>{
                if (notifications === null) {
                    return resolve(null)
                }
                var resolvedContents = [];
                if (notifications.contents.length === 0) {
                    resolve(notifications);
                } else {
                    this.processNextFeedItem(resolvedContents, notifications, resolve, reject, 0);
                }
            })
            .catch(err=>reject(err));
        })
    }

    deleteNotification(notificationId, userId) {
        return new Promise((resolve, reject)=>{
            //remove item from notification items
            this.database.collection('notificationItems').removeAsync({
                _id: notificationId
            });
            // find and modify notifications of the user
            this.database.collection('users').findOneAsync({
                _id: userId
            })
            .then(userData=>{
                if (userData === null)
                    return resolve(null);
                return this.database.collection('notifications').findAndModifyAsync({
                    _id: userData.notification
                },[],{
                    $pull: {
                        contents: notificationId
                    }
                },{
                    new: true
                });
            })
            .then(updatedNotificationData=>{
                let notifications = updatedNotificationData.value;
                var resolvedContents = [];
                if (notifications.contents.length === 0) {
                    resolve(notifications);
                } else {
                    this.processNextFeedItem(resolvedContents, notifications, resolve, reject , 0);
                }
            })
            .catch(err=>reject(err));
        })
    }

    processNextFeedItem(resolvedContents, notifications, resolve, reject, i){
        if(notifications === undefined){
            return
        }
        this.getNotificationItem(notifications.contents[i])
        .then(notification => {
            resolvedContents.push(notification);
            if (resolvedContents.length === notifications.contents.length) {
                notifications.contents = resolvedContents;
                return resolve(notifications);
            } else {
                this.processNextFeedItem(resolvedContents, notifications, resolve, reject, i + 1);
            }
        })
        .catch(err=>{
            reject(err);
        });
    }

    hasNewNotification(userId){
        return new Promise((resolve, reject)=>{
            this.database.collection('users').findOneAsync({
                _id: userId
            })
            .then(userData=>{
                return this.database.collection('notifications').findOneAsync({
                    _id: userData.notification
                })
            })
            .then(notifications=>{
                if(notifications === null){
                    return resolve(0)
                }
                resolve(notifications.contents.length);
            })
            .catch(err=>{reject(err)});
        });
    }
}