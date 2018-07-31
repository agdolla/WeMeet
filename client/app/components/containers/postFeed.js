import React from 'react';


import {PostEntry} from '../presentations';
import {PostFeedItem} from '../presentations';
//request function
import {getAllPosts,postStatus} from '../../utils';
//credentials function
import {socket,getToken} from '../../utils';

// var debug = require('react-debug');


import RaisedButton from 'material-ui/RaisedButton';

export default class PostFeed extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            contents: [],
            loadBtnText:"load more",
            submitted:false
        }
    }


    getData(){
        getAllPosts((new Date()).getTime())
        .then(response=>{
            let postFeedData = response.data;
            this.setState({
                contents:postFeedData
            });
        });
    }

    handleLoadMore(e){
        e.preventDefault();
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
                    loadBtnText:"nothing more to load",
                    submitted:false
                })
            }
            var newPostData = this.state.contents.concat(postFeedData);
            this.setState({
                contents:newPostData,
                submitted:false
            });
        });
    }

    onPost(text,img){
        postStatus(this.props.user._id, text, img,)
        .then(()=>{
            socket.emit('newPost',{authorization:getToken(),user:this.props.user._id});
            this.setState({
                loadBtnText:"load more"
            },()=>{
                this.getData();
            });
        });
    }

    componentWillReceiveProps(){
        this.getData();
    }

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
            <div>
                <PostEntry userData={this.props.user} onPost={(text,img)=>this.onPost(text,img)}/>
                {this.state.contents.map((postFeedItem,i)=>{
                    return <PostFeedItem key={i} data={postFeedItem} currentUser={this.props.user._id}/>
                })}
                <RaisedButton label={this.state.loadBtnText} fullWidth={true} onClick={(e)=>this.handleLoadMore(e)}
                disabled={this.state.loadBtnText==="nothing more to load"||this.state.submitted} style={{marginBottom:'30px'}}/>
            </div>
        );
    }

    componentDidMount(){
        this.getData();
    }
}
