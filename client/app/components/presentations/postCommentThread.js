import React from 'react';
import {PostCommentEntry} from './';
import FlatButton from 'material-ui/FlatButton';

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
                    this.props.loadMore &&
                    <FlatButton label="Load comments" fullWidth={true} onClick={()=>this.props.loadCommentClick()}/>
                }
                <PostCommentEntry onPostComment={this.props.onPostComment}/>
            </div>
        );
    }
}
