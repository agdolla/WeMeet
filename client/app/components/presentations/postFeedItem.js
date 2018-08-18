import React from 'react';
import {Link} from 'react-router-dom';
import Lightbox from 'react-images';
import {PostComment, PostCommentThread} from './';
import {likePost, unLikePost, postComment, didUserLike, getPostComments} from '../../utils';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Icon from '@material-ui/core/Icon';

var moment = require('moment');

export default class PostFeedItem extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            data: props.data,
            comments:[],
            isOpen:false,
            currentImage:0,
            loadMore: true
        };
    }

    handlePostComment(comment){
        postComment(this.state.data._id, this.props.currentUser, comment)
        .then(response=>{
            let newFeedItem = response.data;
            this.setState({
                data:newFeedItem
            },()=>{
                this.loadComments(true);
            });
        });
    }

    handleImgClick(index,e){
        e.preventDefault();
        this.setState({
            currentImage:index,
            isOpen:true
        });
    }
    closeLightbox(e){
        e.preventDefault();
        this.setState({
            isOpen:false
        })
    }

    handleLikeClick(e){
        e.preventDefault();

        if(e.button === 0){
            var handler = (likeCounter) => {
                this.state.data.likeCounter = likeCounter;
                var newData = this.state.data;
                this.setState(
                    {
                        data:newData
                    }
                );
            };

            if(!didUserLike(this.state.data.likeCounter,this.props.currentUser)){
                likePost(this.state.data._id,this.props.currentUser)
                .then(response=>handler(response.data));
            }
            else{
                unLikePost(this.state.data._id,this.props.currentUser)
                .then(response=>handler(response.data));
            }
        }
    }

    loadComments(justPosted) {
        let date = justPosted || this.state.comments.length == 0 ? (new Date()).getTime() :
        this.state.comments[this.state.comments.length-1].postDate;

        getPostComments(this.state.data._id, date)
        .then(response=>{
            let load = response.data.length > 0;
            let postComments = justPosted? response.data : this.state.comments.concat(response.data);
            this.setState({
                loadMore: load,
                comments: postComments
            })
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if(JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data)) {
            this.setState({
                data: this.props.data,
                comments: []
            })
        }
    }
    
    render(){
        var data = this.state.data;
        var contents;
        switch(data.type){
            case "general":
            contents = data.contents;
            break;
            default:
            throw new Error("Unknown FeedItem: " + data.type);
        }

        var imgs = [];
        var images = [];
        imgs = contents.img;
        var display = [];
        imgs.map((obj,i)=>{
            display.push(
                <a onClick={(e)=>this.handleImgClick(i,e)} key={i} style={{"width":"calc("+(100/(imgs.length>2?2:imgs.length))+"% - 4px)"}}>
                    <img src={obj} style={{'width':"100%"}}/>
                </a>
            );
            images.push({
                src: obj,
                caption: contents.text
            })
        });
        var time = moment(contents.postDate).calendar();

        if((new Date().getTime()) - contents.postDate <= 86400000)
            time = moment(contents.postDate).fromNow();

        return(
            <div className="panel panel-default">
                <div className="panel-heading">
                    <div className="media">
                        <div className="media-left">
                            <Link to={"/profile/"+contents.author._id}>
                                <img className="media-object" src={contents.author.avatar} height="50px" alt="..."></img>
                            </Link>
                        </div>
                        <div className="media-body">
                            <h4 className="media-heading">{contents.author.fullname} </h4>
                            <span style={{"fontSize":"12px"}}>{time}</span>
                        </div>
                    </div>
                </div>
                <div className="panel-body">
                    <p>
                        {contents.text}
                    </p>
                    {
                        <Lightbox
                        images={images}
                        isOpen={this.state.isOpen}
                        currentImage={this.state.currentImage}
                        onClose={(e)=>this.closeLightbox(e)}
                        showThumbnails={true}
                        onClickThumbnail={(index)=>{
                            this.setState({
                                currentImage: index
                            })
                        }}
                        onClickPrev={()=>{
                            this.setState({
                                currentImage: (this.state.currentImage+images.length-1)%images.length
                            })
                        }}
                        onClickNext={()=>{
                            this.setState({
                                currentImage: (this.state.currentImage+1)%images.length
                            })
                        }}
                        />
                    }
                    <div className="postImg">
                        {display}
                    </div>
                </div>
                <div className="panel-footer">
                    <div className="row">
                        <div className="col-md-12">
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <FormControlLabel
                                style={{marginTop:'-3px', marginLeft: '-10px'}}
                                control={
                                    <Checkbox onClick={(e)=>this.handleLikeClick(e)}
                                    style={{width: '30px', height: '30px'}}
                                    checked={didUserLike(this.state.data.likeCounter,this.props.currentUser)}
                                    icon={<Icon style={{fontSize:'20px'}} className="far fa-heart"/>} 
                                    checkedIcon={<Icon className="fas fa-heart" style={{color:'red',fontSize:'20px'}}/>}/>
                                }
                                label={data.likeCounter.length}
                                />
                                <Icon className="fas fa-comments" style={{marginTop:'1px', fontSize:'20px', width:'25px'}}/>
                                <div style={{marginTop:'2px'}}><span style={{marginLeft:'5px'}}>{this.state.data.commentsCount}</span></div>
                            </div>
                            <PostCommentThread onPostComment={(comment)=>this.handlePostComment(comment)} 
                            loadCommentClick={()=>this.loadComments(false)} loadMore={this.state.loadMore}
                            commentsCount={this.state.data.commentsCount}>
                                {this.state.comments.map((comment,i)=>{
                                    return (
                                    <PostComment key={i} data={comment} />
                                    )
                                })}
                            </PostCommentThread>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
