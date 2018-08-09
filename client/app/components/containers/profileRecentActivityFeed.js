import React from 'react';

//request function
import {getActivityFeedData} from '../../utils';

import {ActivityFeedItem} from '../presentations';
import FlatButton from 'material-ui/FlatButton';

let debug = require('react-debug');

export default class ProfileRecentActivityFeed extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            contents: [],
            loadMore: true
        };
    }

    getData(user){
        getActivityFeedData(user, this.state.contents.length)
        .then(response=>{
            debug(response.data);
            let activities = this.state.contents.concat(response.data.contents);
            this.setState({
                contents:activities,
                loadMore: response.data.contents.length > 0
            });
        });
    }

    componentWillReceiveProps(newProps){
        this.getData(newProps.user);
    }

    // componentDidMount(){
    //     this.getData(this.props.user);
    // }

    render(){
        return(
            <div style={{marginTop: '15px', marginBottom: '20px'}}>
                {this.state.contents.map((activityItem)=>{
                    return <ActivityFeedItem key={activityItem._id} data={activityItem} currentUser={this.props.currentUser}/>
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
