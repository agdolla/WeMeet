import React from 'react';
import Request from './friendRequest';
import ActivityNotification from './activityNotification'
import {getNotificationData, deleteNotification,acceptFriendRequest,acceptActivityRequest} from '../server';

Array.prototype.insert = function (index, item) {
this.splice(index, 0, item);
};

export default class NotificationBody extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      FR: [],
      AN: []
    }
  }



  getData(){
    getNotificationData(this.props.user,(notificationData)=>{
      var FR = [];
      var AN = [];
      notificationData.contents.map((notification)=>{
        if(notification.type === "FR"){
          FR.insert("0",notification);
        }
        else{
          AN.insert("0",notification);
        }
      });
      this.setState({
        FR: FR,
        AN: AN
      });
    })
  }

  handleDelete(id){
    deleteNotification(id,this.props.user,()=>{
      this.getData();
    });
  }

  handleFriendAccept(id){
    acceptFriendRequest(id,this.props.user,()=>{
      this.getData();
    });
  }

  handleActivityAccept(notificationid){
    acceptActivityRequest(notificationid,this.props.user,()=>{
      this.getData();
    })
  }

  render(){
    if(this.props.id == 1){
      if(this.state.FR.length === 0){
        return(
          <div className="panel panel-default">
            <div className="panel-body">
                  Nothing here yet
            </div>
          </div>
        );
      }
      return(
        <div className="panel panel-default">
          <div className="panel-body">
            {this.state.FR.map((fr,i)=>{
              return <Request key={i} data={fr} onDelete={(id)=>this.handleDelete(id)} onAccept={(id)=>this.handleFriendAccept(id)}/>
            })}
          </div>
        </div>
      )
    }
    else{
      if(this.state.AN.length === 0){
        return(
          <div className="panel panel-default">
            <div className="panel-body">
              Nothing here yet
            </div>
          </div>
        );
      }
      return(
        <div className="panel panel-default">
          <div className="panel-body">
            {this.state.AN.map((AN,i)=>{
              return <ActivityNotification key={i} data={AN} onDelete={(id)=>this.handleDelete(id)} onAccept={(activityid,userid)=>this.handleActivityAccept(activityid,userid)}/>
            })}
          </div>
        </div>
      )
    }
  }

  componentDidMount(){
    this.getData();
  }
}
