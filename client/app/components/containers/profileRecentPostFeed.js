import React from 'react';

//request function
import {getPostFeedData} from '../../utils';

import {PostFeedItem} from '../presentations';

export default class ProfileRecentPostFeed extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            "contents": []
        };
    }

    getData(user){
        getPostFeedData(user)
        .then(response=>{
            let post = response.data;
            this.setState(post);
        });
    }

    componentDidMount(){
        this.getData(this.props.user);
    }
    componentWillReceiveProps(newProps){
        this.getData(newProps.user);
    }
    render(){
        return(
            <div>
                {this.state.contents.map((postItem)=>{
                    return <PostFeedItem key={postItem._id} data={postItem} currentUser={this.props.currentUser}/>
                })}
            </div>
        );
    }
}
