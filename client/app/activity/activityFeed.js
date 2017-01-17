import React from 'react';
import ActivityFeedItem from './activityFeedItem';
import {getAllActivities} from '../server';
import {Link} from "react-router";
import {socket} from '../credentials';
import {disabledElement} from '../util';
import {hashHistory} from 'react-router';
var debug = require('react-debug');

export default class ActivityFeed extends React.Component{

  constructor(props){
    super(props);
    this.state= {
      contents: [],
      notified:false,
      btnText:"load more",
      submitted:false
    }
  }

  getData(){
    getAllActivities((new Date()).getTime(), (activityFeedData)=>{
      this.setState({
        contents:activityFeedData,
        notified:false
      });
    });
  }

  handleLoadMoreA(e){
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
        notified:false,
        submitted:false
      });
    });
  }

  componentWillReceiveProps(){
    this.getData();
  }

  notifyMe(cb) {
    if (!Notification) {
      alert('Desktop notifications not available in your browser. Try Chromium.');
      return;
    }

    if (Notification.permission !== "granted")
      Notification.requestPermission();
    else {
      this.setState({
        notified:true
      });
      var notification = new Notification('WeMeet', {
        icon: 'https://www.w1meet.com/img/logo/mipmap-xxhdpi/ic_launcher.png',
        body: "Hey there! You have new activities"
      });
      notification.onclick = (event)=>{
        event.preventDefault();
        event.target.close();
        hashHistory.push('/activity');
        cb();
      }
    }
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
            onClick={(e)=>this.handleLoadMoreA(e)}>
              {this.state.btnText}
            </button>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount(){
    this.getData();
    socket.on('newActivity',()=>{
      if(!this.state.notified){
        this.notifyMe(()=>{
          this.getData();
        });
      }
    })
  }
}
