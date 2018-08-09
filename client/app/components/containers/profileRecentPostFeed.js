import React from 'react';
import {getPostFeedData} from '../../utils';
import {PostFeedItem} from '../presentations';
import FlatButton from 'material-ui/FlatButton';

export default class ProfileRecentPostFeed extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            "contents": [],
            loadMore: true
        };
    }

    getData(user){
        getPostFeedData(user, this.state.contents.length)
        .then(response=>{
            let activities = this.state.contents.concat(response.data.contents);
            this.setState({
                contents:activities,
                loadMore: response.data.contents.length > 0
            });
        });
    }

    // componentDidMount(){
    //     this.getData(this.props.user);
    // }

    componentWillReceiveProps(newProps){
        this.getData(newProps.user);
    }

    render(){
        return(
            <div>
                {this.state.contents.map((postItem)=>{
                    return <PostFeedItem key={postItem._id} data={postItem} currentUser={this.props.currentUser}/>
                })}
                {
                    <FlatButton onClick={()=>{this.getData(this.props.user)}} 
                    label={this.state.loadMore? "Load More" : "Nothing more to load"} 
                    fullWidth={true} backgroundColor={"#fdfdfd"}
                    disabled={!this.state.loadMore}/>
                }
            </div>
        );
    }
}
