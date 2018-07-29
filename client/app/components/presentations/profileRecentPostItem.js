import React from 'react';
import Lightbox from 'react-images';
var moment = require('moment');

//request function
import {likePost, unLikePost} from '../../utils';

export default class ProfileRecentPostItem extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            data: props.data,
            isOpen:false,
            currentImage:0
        };
    }

    handleLikeClick(e){
        e.preventDefault();

        if(e.button === 0){
            var cb = (likeCounter) => {
                var newData = this.state.data;
                newData.likeCounter = likeCounter;
                this.setState({data:newData});
            };

            if(!this.didUserLike(this.props.currentUser)){
                likePost(this.state.data._id,this.props.currentUser,cb);
            }
            else{
                unLikePost(this.state.data._id,this.props.currentUser,cb);
            }
        }

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

    didUserLike(userId) {
        let likeCounter = this.state.data.likeCounter;
        return likeCounter.filter(counter => counter._id === userId).length > 0;
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
        let imgs = contents.img;
        var images = [];
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
            });
        });

        var time = moment(contents.postDate).calendar();

        if((new Date().getTime()) - contents.postDate <= 86400000)
            time = moment(contents.postDate).fromNow();

        return(
            <div className="panel panel-default">
                <div className="panel-body">
                    <div className="row">
                        <div className="col-md-2">
                            <img src={contents.author.avatar} height="50px" alt="" />
                        </div>
                        <div className="col-md-10">
                            <div className="media">
                                {contents.author.fullname}
                                <br />
                                {time}
                            </div>
                        </div>
                    </div>
                    <div className="row content">
                        <div className="panel-body">
                            <div className="media">
                                <div className="media-body">
                                    <p>
                                        {contents.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="panel-body">
                            <div className="postImg">
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
                                {display}
                            </div>
                        </div>
                        <div className="panel-footer">
                            <div className="row">
                                <div className="col-md-12">
                                    <a href="#" onClick={(e)=>this.handleLikeClick(e)}><span className="glyphicon glyphicon-heart"></span>{data.likeCounter.length}</a>
                                    <span className="glyphicon glyphicon-comment"></span>{data.comments.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
