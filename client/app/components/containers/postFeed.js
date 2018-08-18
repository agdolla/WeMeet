import React from 'react';
import {PostEntry} from '../presentations';
import {PostFeedItem} from '../presentations';
import {getAllPosts,postStatus} from '../../utils';
import {socket,isBottom} from '../../utils';
import CircularProgress from '@material-ui/core/CircularProgress';

// var debug = require('react-debug');


export default class PostFeed extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            contents: [],
            moreToLoad: true,
            loading: true
        }
    }

    handleLoad(init){
        document.removeEventListener('scroll', this.trackScrolling);
        this.setState({
            loading:init
        });
        var date = init || this.state.contents.length===0?(new Date()).getTime():
        this.state.contents[this.state.contents.length-1].contents.postDate;
        getAllPosts(date)
        .then(response=>{
            let postFeedData = response.data;
            if(postFeedData.length===0){
                return this.setState({
                    moreToLoad:false,
                    loading: false
                })
            }
            var newPostData = (init?[]:this.state.contents).concat(postFeedData);
            this.setState({
                contents:newPostData,
                moreToLoad: true,
                loading: false
            },() =>{
                document.addEventListener('scroll', this.trackScrolling);
            });
        });
    }

    onPost(text,img){
        postStatus(this.props.user._id, text, img)
        .then(()=>{
            socket.emit('newPost',{user:this.props.user._id});
            this.handleLoad(true);
        });
    }


    // componentDidUpdate(prevProps, prevState) {
    //     if(this.state.contents.count === prevState.count)
    //         this.handleLoadMore();
    // }
    

    trackScrolling = () => {
        let wrappedElement = document.getElementById('postFeed');
        if (wrappedElement!==null && isBottom(wrappedElement)) {
            this.handleLoad(false);
        }
    }

    componentDidMount(){
        this.handleLoad(true);
    }

    componentWillUnmount(){
        document.removeEventListener('scroll', this.trackScrolling);
    }

    render(){
        return (
            <div className="postFeedItem" id="postFeed">
                <PostEntry userData={this.props.user} onPost={(text,img)=>this.onPost(text,img)}/>
                {
                    this.state.loading? <div style={{textAlign:'center', color:'#61B4E4', marginTop:'30px', marginBottom:'30px'}}>
                    <CircularProgress size={30} />
                </div>:<div></div>
                }
                {
                    !this.state.loading&&this.state.contents.length===0?
                    <div className="alert alert-info" role="alert">
                        No one has posted anthing yet!
                    </div>
                    :this.state.contents.map((postFeedItem,i)=>{
                    return <PostFeedItem key={i} data={postFeedItem} currentUser={this.props.user._id}/>
                    })
                }
                {
                    !this.state.moreToLoad &&
                    <div style = {{marginTop: '30px', marginBottom: '30px', textAlign: 'center'}}>
                        Nothing more to load
                    </div>
                }
            </div>
        );
    }
}
