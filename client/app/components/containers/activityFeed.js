import React from 'react';
import {Link} from "react-router";

import {ActivityFeedItem} from '../presentations';

import {getAllActivities} from '../../utils';
// var debug = require('react-debug');
import RaisedButton from 'material-ui/RaisedButton';
export default class ActivityFeed extends React.Component{

    constructor(props){
        super(props);
        this.state= {
            contents: [],
            btnText:"load more",
            submitted:false
        }
    }

    getData(){
        getAllActivities((new Date()).getTime(), (activityFeedData)=>{
            this.setState({
                contents:activityFeedData
            });
        });
    }

    handleLoadMore(e){
        e.preventDefault();
        this.setState({
            submitted:true
        });
        var date = this.state.contents.length===0?(new Date()).getTime():
        this.state.contents[this.state.contents.length-1].postDate;
        getAllActivities(date, (activities)=>{
            if(activities.length===0){
                return this.setState({
                    btnText:"nothing more to load",
                    submitted:false
                })
            }
            var newActivities = this.state.contents.concat(activities);
            this.setState({
                contents:newActivities,
                submitted:false
            });
        });
    }

    componentDidMount(){
        this.getData();
    }

    componentWillReceiveProps(){
        this.getData();
    }

    render(){
        if(this.state.contents.length === 0){
            return(
                <div className="alert alert-info" role="alert">
                    No one has posted any activities yet.
                    Post your first activity
                    <Link to="postactivity">
                        <strong>
                            here
                        </strong>
                    </Link>
                </div>
            );
        }
        return(
            <div>
                {this.state.contents.map((activityFeedItem)=>{
                    return <ActivityFeedItem key={activityFeedItem._id} data={activityFeedItem}/>
                })}
                <RaisedButton label={this.state.btnText} fullWidth={true} onClick={(e)=>this.handleLoadMore(e)} disabled={this.state.btnText==="nothing more to load"||this.state.submitted} style={{marginBottom:'30px'}}/>
            </div>
        );
    }
}
