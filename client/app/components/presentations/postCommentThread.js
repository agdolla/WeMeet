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
                    this.props.loadMore &&
                    <Button fullWidth onClick={()=>this.props.loadCommentClick()}>
                        Load comments
                    </Button>
                }
                <PostCommentEntry onPostComment={this.props.onPostComment}/>
            </div>
        );
    }
}
