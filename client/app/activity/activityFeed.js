import React from 'react';
import ActivityFeedItem from './activityFeedItem';
import {getAllActivities} from '../server';
import {Link} from "react-router";
import {disabledElement} from '../util';
// var debug = require('react-debug');

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
          <Link to="postactivity"><strong> here</strong></Link>
        </div>
      );
    }
    return(
      <div>
        {this.state.contents.map((activityFeedItem)=>{
          return <ActivityFeedItem key={activityFeedItem._id} data={activityFeedItem}/>
        })}
        <div className="btn-group btn-group-justified" role="group" aria-label="...">
          <div className="btn-group" role="group">
            <button className={"btn btn-default loadbtn "+disabledElement(this.state.btnText==="nothing more to load"||this.state.submitted)} 
            onClick={(e)=>this.handleLoadMore(e)}>
              {this.state.btnText}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
