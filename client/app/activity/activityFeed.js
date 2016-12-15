import React from 'react';
import ActivityFeedItem from './activityFeedItem';
import {getAllActivities} from '../server';
import {Link} from "react-router";
import {socket} from '../credentials';

export default class ActivityFeed extends React.Component{

  constructor(props){
    super(props);
    this.state= {
      contents: [],
      notified:false
    }
  }

  getData(){
    getAllActivities(this.props.user, (activityFeedData)=>{
      this.setState({
        contents:activityFeedData,
        notified:false
      });
    });
  }


  notifyMe(cb) {
    if (!Notification) {
      alert('Desktop notifications not available in your browser. Try Chromium.');
      return;
    }

    if (Notification.permission !== "granted")
      Notification.requestPermission();
    else {
      var notification = new Notification('WeMeet', {
        icon: 'http://localhost:3000/img/logo/mipmap-xxhdpi/ic_launcher.png',
        body: "Hey there! You have new activities"
      });
      this.setState({
        notified:true
      })
      notification.onclick = (event)=>{
        event.preventDefault();
        event.target.close();
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
          return <ActivityFeedItem key={activityFeedItem._id} data={activityFeedItem} currentUser={this.props.user}/>
        })}
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
