import React from 'react';

//request function
import {getActivityFeedData} from '../../utils';

import {ProfileRecentActivityItem} from '../presentations';

export default class ProfileRecentActivityFeed extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            "contents": []
        };
    }

    getData(user){
        getActivityFeedData(user)
        .then(response=>{
            let activity = response.data;
            this.setState(activity);
        });
    }

    componentWillReceiveProps(newProps){
        this.getData(newProps.user);
    }

    componentDidMount(){
        this.getData(this.props.user);
    }

    render(){
        return(
            <div>
                {this.state.contents.map((activityItem)=>{
                    return <ProfileRecentActivityItem key={activityItem._id} data={activityItem} currentUser={this.props.currentUser}/>
                })}
            </div>
        );
    }
}
