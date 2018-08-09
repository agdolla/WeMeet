import React from 'react';

import {NotificationFriendRequest} from '../presentations';
import {NotificationActivity} from '../presentations'

//request function
import {getNotificationData, deleteNotification,acceptFriendRequest,acceptActivityRequest} from '../../utils';
//credentials function
import {socket} from '../../utils';


import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import Badge from 'material-ui/Badge';
// import IconButton from 'material-ui/IconButton';

// let debug = require('react-debug');


Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

export default class NotificationBody extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            FR: [],
            AN: [],
            value: 'a'
        }
    }



    getData(){
        getNotificationData(this.props.user)
        .then(response=>{
            let notificationData = response.data;
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
        });
    }

    handleDelete(id){
        deleteNotification(id,this.props.user)
        .then(response=>{
            let notificationData = response.data;
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
        });
    }

    handleFriendAccept(id,user){
        acceptFriendRequest(id,this.props.user)
        .then(()=>{
            this.getData();
            socket.emit("friend request accepted",{
                sender: this.props.user,
                target: user
            });
        });
    }

    handleActivityAccept(notificationid){
        acceptActivityRequest(notificationid,this.props.user)
        .then(()=>{
            this.getData();
        });
    }

    handleChange(value){
        this.setState({
            value: value
        })
    }

    render(){
        var frbadge =
        <Badge badgeStyle={{backgroundColor:'#DB6666', visibility:this.state.FR.length===0?"hidden":'visible'}}
            badgeContent={this.state.FR.length}
            primary={true}
            >
            <FontIcon className="material-icons" style={{color:'white'}}>person_add</FontIcon>
        </Badge>;

        var anbadge =
        <Badge badgeStyle={{backgroundColor:'#DB6666', visibility:this.state.AN.length===0?"hidden":'visible'}}
            badgeContent={this.state.AN.length}
            primary={true}
            >
            <FontIcon className="material-icons" style={{color:'white'}}>notifications_active</FontIcon>
        </Badge>;
        return(
            <Tabs
                style={{boxShadow:  "0 10px 28px 0 rgba(137,157,197,.12)", marginTop:'20px'}}
                inkBarStyle={{backgroundColor:"white",height:'3px'}}
                contentContainerStyle={{backgroundColor:'#FDFDFD',padding:'10px'}}
                value={this.state.value}
                onChange={(value)=>this.handleChange(value)}
                >
                <Tab icon={frbadge}
                    value="a" style={{backgroundColor:'#61B4E4',height:60}}>
                    <div>
                        {this.state.FR.length===0?"Nothing here":this.state.FR.map((fr,i)=>{
                            return <NotificationFriendRequest key={i} data={fr} onDelete={(id)=>this.handleDelete(id)} onAccept={(id,user)=>this.handleFriendAccept(id,user)}/>
                        })}
                    </div>
                </Tab>
                <Tab  value="b" buttonStyle={{backgroundColor:'#61B4E4',height:60}} icon={anbadge}>
                    <div>
                        {this.state.AN.length===0?"Nothing here":this.state.AN.map((AN,i)=>{
                            return <NotificationActivity key={i} data={AN} onDelete={(id)=>this.handleDelete(id)} onAccept={(activityid,userid)=>this.handleActivityAccept(activityid,userid)}/>
                        })}
                    </div>
                </Tab>
            </Tabs>);

        }

        componentDidMount(){
            this.getData();
        }
    }
