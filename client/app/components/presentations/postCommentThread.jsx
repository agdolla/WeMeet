import React from 'react';
import { PostCommentEntry } from '.';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';

// let debug = require('react-debug');

export default class PostCommentThread extends React.Component {
    render() {
        return (
            <div>
                <List>
                    {this.props.children}
                </List>
                {
                    <Button fullWidth disabled={!this.props.loadMore ||
                        this.props.commentsCount === 0 || this.props.children.length === this.props.commentsCount} onClick={() => this.props.loadCommentClick()}>
                        Load comments
                    </Button>
                }
                <PostCommentEntry onPostComment={this.props.onPostComment} />
            </div>
        );
    }
}
