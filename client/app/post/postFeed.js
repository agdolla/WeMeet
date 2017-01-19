import React from 'react';
import PostEntry from './postEntry';
import PostFeedItem from './postFeedItem';
import {getAllPosts,postStatus} from '../server';
import {socket,getToken} from '../credentials';
import {disabledElement} from '../util';
// var debug = require('react-debug');

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
    getAllPosts((new Date()).getTime(), (postFeedData)=>{
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
    getAllPosts(date, (postFeedData)=>{
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
    postStatus(this.props.user._id, text, img,()=>{
      socket.emit('newPost',{authorization:getToken(),user:this.props.user._id});
      this.setState({
        loadBtnText:"load more"
      },()=>{
        this.getData();
      })
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
        <div className="btn-group btn-group-justified" role="group" aria-label="...">
          <div className="btn-group" role="group">
            <button className={"btn btn-default loadbtn "+disabledElement(this.state.loadBtnText==="nothing more to load"||this.state.submitted)} onClick={(e)=>this.handleLoadMore(e)}>
              {this.state.loadBtnText}
            </button>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount(){
    this.getData();
  }
}
