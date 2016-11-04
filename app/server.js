import {readDocument, writeDocument, addDocument} from './database.js';

/**
 * Emulates how a REST call is *asynchronous* -- it calls your function back
 * some time in the future with data.
 */
function emulateServerReturn(data, cb) {
  setTimeout(() => {
    cb(data);
  }, 4);
}

export function likePost(feedItemId, user, cb){
  var postFeedItem = readDocument('postFeedItems',feedItemId);
  postFeedItem.likeCounter.push(user);

  writeDocument('postFeedItems',postFeedItem);

  emulateServerReturn(postFeedItem.likeCounter.map((id)=>readDocument('users',id)), cb);
}

export function unLikePost(feedItemId, user, cb){
  var postFeedItem = readDocument('postFeedItems',feedItemId);
  var userindex = postFeedItem.likeCounter.indexOf(user);

  if(userindex !== -1){
    postFeedItem.likeCounter.splice(userindex,1);
    writeDocument('postFeedItems', postFeedItem);
  }

  emulateServerReturn(postFeedItem.likeCounter.map((id)=>readDocument('users',id)), cb);
}


export function postComment(feedItemId, author, comment, cb){
  var postFeedItem = readDocument('postFeedItems',feedItemId);
  postFeedItem.comments.push({
    "author": author,
    "text": comment,
    "postDate": (new Date()).getTime()
  });

  writeDocument('postFeedItems',postFeedItem);

  emulateServerReturn(getPostFeedItemSync(feedItemId),cb);
}

export function postStatus(user, text, cb){
  var time = new Date().getTime();

  var post = {
    "likeCounter":[],
    "type": "general",
    "contents": {
      "author": user,
      "postDate": time,
      "text": text,
      "img": null
    },
    "comments":[]
  };

  post = addDocument('postFeedItems',post);

  var userData = readDocument('users',user);
  var postFeedData = readDocument('postFeeds',userData.post);

  postFeedData.contents.unshift(post._id);

  writeDocument('postFeeds', postFeedData);

  emulateServerReturn(post,cb);
}

function getPostFeedItemSync(feedItemId){
  var postFeedItem = readDocument("postFeedItems",feedItemId);
  postFeedItem.likeCounter = postFeedItem.likeCounter.map((id)=>readDocument('users', id));
  postFeedItem.contents.author = readDocument('users', postFeedItem.contents.author);

  postFeedItem.comments.forEach((comment)=>{
    comment.author = readDocument('users', comment.author);
  });

  return postFeedItem;
}


export function getPostFeedData(user, cb){
  var userData = readDocument('users',user);
  var feedData = readDocument('postFeeds',userData.post);

  feedData.contents = feedData.contents.map(getPostFeedItemSync);

  emulateServerReturn(feedData,cb);
}

function getActivityFeedItemSync(feedItemId){
  var activityFeedItem = readDocument('activityItems',feedItemId);

  activityFeedItem.participants = activityFeedItem.participants.map((id)=>readDocument('users',id));
  activityFeedItem.likeCounter = activityFeedItem.likeCounter.map((id)=>readDocument('users',id));
  activityFeedItem.comments.forEach((comment)=>{
    comment.author = readDocument('users',comment.author);
  });

  return activityFeedItem;
}

export function getActivityFeedData(user,cb){
  var userData = readDocument('users',user);
  var activityData = readDocument('activities',userData.activity);

  activityData.contents = activityData.contents.map(getActivityFeedItemSync);

  emulateServerReturn(activityData,cb);
}

export function getUserData(user,cb){
  var userData = readDocument('users',user);
  emulateServerReturn(userData,cb);
}
