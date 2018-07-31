let axios = require('axios');

export function likePost(feedItemId, user){
    return axios.put('/postItem/'+feedItemId+'/likelist/'+user);
}

export function unLikePost(feedItemId, user){
    return axios.delete('/postItem/'+feedItemId+'/likelist/'+user);
}

export function postComment(feedItemId, author, comment){
    return axios.post('/postItem/'+feedItemId+'/commentThread/comment',{
        author:author,
        text:comment
    });
}

export function postStatus(user, text, img){
    return axios.post('/postItem',{
        userId:user,
        text:text,
        img: img
    });
}

export function getAllPosts(time){
    return axios.get('/posts/'+time);
}
