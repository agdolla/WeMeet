import React from 'react';
import {Link} from 'react-router-dom';
import Lightbox from 'react-images';
import {PostComment, PostCommentThread} from './';
import {likePost, unLikePost, postComment, didUserLike} from '../../utils';
import {RadioButton} from 'material-ui/RadioButton';
import FontIcon from 'material-ui/FontIcon';

var moment = require('moment');
// var debug = require('react-debug');

export default class PostFeedItem extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            data: props.data,
            isOpen:false,
            currentImage:0
        };
    }

    handlePostComment(comment){
        postComment(this.state.data._id, this.props.currentUser ,comment, (newFeedItem)=>{
            this.setState({
                data:newFeedItem
            });
        })
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
            var cb = (likeCounter) => {
                this.state.data.likeCounter = likeCounter;
                var newData = this.state.data;
                this.setState(
                    {
                        data:newData
                    }
                );
            };

            if(!didUserLike(this.state.data.likeCounter,this.props.currentUser)){
                likePost(this.state.data._id,this.props.currentUser,cb);
            }
            else{
                unLikePost(this.state.data._id,this.props.currentUser,cb);
            }
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            data: nextProps.data
        })
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
                                <RadioButton
                                style={{width:'50px'}}
                                iconStyle={{marginRight:'2px'}}
                                onClick={(e)=>this.handleLikeClick(e)}
                                checked={didUserLike(this.state.data.likeCounter,this.props.currentUser)}
                                label={data.likeCounter.length}
                                labelStyle = {{fontWeight: 'normal'}}
                                checkedIcon={<FontIcon className="material-icons" style={{color:'red',fontSize:'20px'}}>favorite</FontIcon>}
                                uncheckedIcon={<FontIcon className="material-icons" style={{fontSize:'20px'}}>favorite_border</FontIcon>}
                                />
                                <FontIcon className="material-icons" style={{fontSize:'20px'}}>insert_comment</FontIcon>
                                <div><span style={{marginLeft:'2px'}}>{data.comments.length}</span></div>
                            </div>
                            <PostCommentThread onPostComment={(comment)=>this.handlePostComment(comment)}>
                                {data.comments.map((comment,i)=>{
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
