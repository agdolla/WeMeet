import React from 'react';


import {PostEntry} from '../presentations';
import {PostFeedItem} from '../presentations';
//request function
import {getAllPosts,postStatus} from '../../utils';
//credentials function
import {socket,isBottom} from '../../utils';

// var debug = require('react-debug');


export default class PostFeed extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            contents: [],
            moreToLoad: true,
            submitted:false
        }
    }


    getData(){
        getAllPosts((new Date()).getTime())
        .then(response=>{
            let postFeedData = response.data;
            this.setState({
                contents:postFeedData
            },()=>{
                document.addEventListener('scroll', this.trackScrolling);
            });
        });
    }

    handleLoadMore(){
        document.removeEventListener('scroll', this.trackScrolling);
        this.setState({
            submitted:true
        });
        var date = this.state.contents.length===0?(new Date()).getTime():
        this.state.contents[this.state.contents.length-1].contents.postDate;
        getAllPosts(date)
        .then(response=>{
            let postFeedData = response.data;
            if(postFeedData.length===0){
                return this.setState({
                    moreToLoad:false,
                    submitted:false
                })
            }
            var newPostData = this.state.contents.concat(postFeedData);
            this.setState({
                contents:newPostData,
                submitted:false
            },() =>{
                document.addEventListener('scroll', this.trackScrolling);
            });
        });
    }

    onPost(text,img){
        postStatus(this.props.user._id, text, img)
        .then(()=>{
            socket.emit('newPost',{user:this.props.user._id});
            this.getData();
        });
    }

    componentWillReceiveProps(){
        this.getData();
    }

    trackScrolling = () => {
        let wrappedElement = document.getElementById('postFeed');
        if (isBottom(wrappedElement)) {
            this.handleLoadMore();
        }
    };

    render(){
        if(this.state.contents.length === 0){
            return(
                <div>
                    <PostEntry userData={this.props.user} onPost={(text,img)=>this.onPost(text,img)}/>
                    <div className="alert alert-info" role="alert">
                        No one has posted anthing yet!
                    </div>
                </div>
            );
        }
        return (
            <div className="postFeedItem" id="postFeed">
                <PostEntry userData={this.props.user} onPost={(text,img)=>this.onPost(text,img)}/>
                {this.state.contents.map((postFeedItem,i)=>{
                    return <PostFeedItem key={i} data={postFeedItem} currentUser={this.props.user._id}/>
                })}
                {
                    !this.state.moreToLoad &&
                    <div style = {{marginTop: '30px', marginBottom: '30px', textAlign: 'center'}}>
                        Nothing more to load
                    </div>
                }
            </div>
        );
    }

    componentDidMount(){
        document.addEventListener('scroll', this.trackScrolling);
        this.getData();
    }

    componentWillUnmount(){
        document.removeEventListener('scroll', this.trackScrolling);
    }
}
