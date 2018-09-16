import React from 'react';
import { PostEntry } from '../presentations';
import { PostFeedItem } from '../presentations';
import { getAllPosts, postStatus } from '../../utils';
import { socket, isBottom } from '../../utils';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

// var debug = require('react-debug');

export default class PostFeed extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            contents: [],
            moreToLoad: true,
            loading: true,
            new: false
        }
    }

    handleLoad(init) {
        document.removeEventListener('scroll', this.trackScrolling);
        if (init) {
            this.setState({
                new: false,
                loading: true
            })
        } else {
            this.setState({
                loading: false,
            });
        }
        var date = init || this.state.contents.length === 0 ? (new Date()).getTime() :
            this.state.contents[this.state.contents.length - 1].contents.postDate;
        getAllPosts(date)
            .then(response => {
                let postFeedData = response.data;
                if (postFeedData.length === 0) {
                    return this.setState({
                        moreToLoad: false,
                        loading: false
                    })
                }
                var newPostData = (init ? [] : this.state.contents).concat(postFeedData);
                this.setState({
                    contents: newPostData,
                    moreToLoad: true,
                    loading: false
                }, () => {
                    document.addEventListener('scroll', this.trackScrolling);
                });
            });
    }

    onPost(text, img) {
        this.setState({
            loading: true
        });
        postStatus(this.props.user._id, text, img)
            .then(() => {
                socket.emit('newPost');
                this.handleLoad(true);
            });
    }


    // componentDidUpdate(prevProps, prevState) {
    //     if(this.state.contents.count === prevState.count)
    //         this.handleLoadMore();
    // }


    trackScrolling = () => {
        let wrappedElement = document.getElementById('postFeed');
        if (wrappedElement !== null && isBottom(wrappedElement)) {
            this.handleLoad(false);
        }
    }

    componentDidMount() {
        this.handleLoad(true);
        socket.on('newPost', this.onNewPost);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
        socket.removeEventListener('newPost', this.onNewPost);
    }

    onNewPost = () => {
        this.setState({
            new: true
        });
    }

    handleNew = () => {
        this.handleLoad(true);
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <div className="postFeedItem" id="postFeed">
                {this.state.new &&
                    <Button variant="extendedFab" color="primary" style={{
                        position: 'fixed',
                        zIndex: 100,
                        left: '45%'
                    }} onClick={this.handleNew}>
                        <Icon style={{ marginRight: '5px' }} className="fas fa-arrow-alt-circle-up" />
                        new posts
                    </Button>
                }
                <PostEntry userData={this.props.user} onPost={(text, img) => this.onPost(text, img)} />
                {
                    this.state.loading ? <div style={{ textAlign: 'center', color: '#61B4E4', marginTop: '30px', marginBottom: '30px' }}>
                        <CircularProgress size={30} />
                    </div> : <div></div>
                }
                {
                    !this.state.loading && this.state.contents.length === 0 ?
                        <div className="alert alert-info" role="alert">
                            No one has posted anthing yet!
                    </div>
                        : this.state.contents.map((postFeedItem, i) => {
                            return <PostFeedItem key={i} data={postFeedItem} currentUser={this.props.user._id} />
                        })
                }
                {
                    !this.state.moreToLoad &&
                    <div style={{ marginTop: '30px', marginBottom: '30px', textAlign: 'center' }}>
                        Nothing more to load
                    </div>
                }
            </div>
        );
    }
}
