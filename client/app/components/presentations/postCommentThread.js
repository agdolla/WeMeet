import React from 'react';
import {PostCommentEntry} from './';
import Button from '@material-ui/core/Button';

// let debug = require('react-debug');

export default class PostCommentThread extends React.Component{
    render(){
        return(
            <div>
                <ul className="media-list comments" style={{'marginTop':'30px'}}>
                    {React.Children.map(this.props.children,function(child){
                        return (
                            <li className="media">
                            {child}
                            </li>
                        );
                    })}
                </ul>
                {
                    <Button fullWidth disabled={!this.props.loadMore || 
                    this.props.commentsCount===0 || this.props.children.length === this.props.commentsCount} onClick={()=>this.props.loadCommentClick()}>
                        Load comments
                    </Button>
                }
                <PostCommentEntry onPostComment={this.props.onPostComment}/>
            </div>
        );
    }
}
