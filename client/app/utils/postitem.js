let axiosHelper = require('./axiosHelper');

export function likePost(feedItemId, user) {
    return axiosHelper.put('/postItem/' + feedItemId + '/likelist/' + user);
}

export function unLikePost(feedItemId, user) {
    return axiosHelper.delete('/postItem/' + feedItemId + '/likelist/' + user);
}

export function postComment(feedItemId, author, comment) {
    return axiosHelper.post('/postItem/' + feedItemId + '/commentThread/comment', {
        author: author,
        text: comment
    });
}

export function postStatus(user, text, img) {
    return axiosHelper.post('/postItem', {
        userId: user,
        text: text,
        img: img
    });
}

export function getAllPosts(time) {
    return axiosHelper.get('/posts/' + time);
}

export function getPostComments(postFeedId, date) {
    return axiosHelper.get('/postItem/' + postFeedId + '/comment/' + date);
}
