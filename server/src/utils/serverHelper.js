'use strict';
const Promise = require("bluebird");

module.exports = class ServerHelper {
    
    constructor(db) {
        this.database = db;
    }

    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()){
            return next();
        }
        res.status(401).end();
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

    sendDatabaseError(res, err) {
        console.log(err);
        res.status(500).send("A database error occurred: " + err);
    }

    getUserData(userId) {
        return new Promise((resolve, reject)=>{
            this.database.collection('users').findOneAsync({
                _id: userId
            })
            .then(userData => {
                if(userData===null){
                    resolve(null)
                }
                else {
                    this.resolveUserObjects(userData.friends, (err, userMap) => {
                        if(err) reject(err);
                        userData.friends = userData.friends.map((id) => userMap[id]);
                        delete userData.password;
                        delete userData.notification;
                        delete userData.post;
                        delete userData.activity;
                        delete userData.sessions;
                        resolve(userData);
                    });
                }
            })
            .catch(err => {reject(err)})
        })
    }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

}