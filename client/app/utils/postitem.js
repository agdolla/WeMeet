let axios = require('axios');

export function likePost(feedItemId, user, cb){
    axios.put('/postItem/'+feedItemId+'/likelist/'+user)
    .then(response=>cb(response.data));
}

export function unLikePost(feedItemId, user, cb){
    axios.delete('/postItem/'+feedItemId+'/likelist/'+user)
    .then(response=>cb(response.data));
}

export function postComment(feedItemId, author, comment, cb){
    axios.post('/postItem/'+feedItemId+'/commentThread/comment',{
        author:author,
        text:comment
    })
    .then(response=>cb(response.data))
    .catch(err=>{});
}

export function postStatus(user, text, img, cb){
    axios.post('/postItem',{
        userId:user,
        text:text,
        img: img
    })
    .then(response=>cb(response.data))
    .catch(err=>{});
}

export function getAllPosts(time,cb){
    axios.get('/posts/'+time)
    .then((response)=>cb(response.data));
}
