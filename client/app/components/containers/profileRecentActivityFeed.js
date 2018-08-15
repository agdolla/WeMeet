import React from 'react';

//request function
import {getActivityFeedData} from '../../utils';

import {ActivityFeedItem} from '../presentations';
import Button from '@material-ui/core/Button';

// let debug = require('react-debug');

export default class ProfileRecentActivityFeed extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            contents: [],
            loadMore: true
        };
    }

    getData(user, refreshed){
        let count = refreshed?0:this.state.contents.length;
        getActivityFeedData(user, count)
        .then(response=>{
            // debug(response.data);
            let activities = refreshed?response.data.contents:this.state.contents.concat(response.data.contents);
            this.setState({
                contents:activities,
                loadMore: response.data.contents.length > 0
            });
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.user !== this.props.user){
            this.getData(this.props.user,true);
        }
    }

    componentDidMount(){
        this.getData(this.props.user);
    }

    render(){
        return(
            <div style={{marginTop: '15px', marginBottom: '20px'}}>
                {this.state.contents.map((activityItem)=>{
                    return <ActivityFeedItem key={activityItem._id} data={activityItem} currentUser={this.props.currentUser}/>
                })}
                {
                    <Button onClick={()=>{this.getData(this.props.user,false)}} 
                    fullWidth style={{backgroundColor:"#fdfdfd"}}
                    disabled={!this.state.loadMore}>
                        {this.state.loadMore? "Load More" : "Nothing more to load"}
                    </Button>
                }
            </div>
        );
    }
}
