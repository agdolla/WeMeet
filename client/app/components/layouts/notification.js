import React from 'react';
import {NotificationBody} from '../containers';
import {Navbar} from '../containers';
import {getNotificationData, deleteNotification,
    acceptFriendRequest,acceptActivityRequest, getUserData} from '../../utils';
import {socket} from '../../utils';

// let debug = require('react-debug');

export default class Notification extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userData:{},
            FR: [],
            AN: []
        }
    }

    getData(){
        getUserData(this.props.userId)
        .then(response=>{
            this.setState({
                userData: response.data
            })
        });
        getNotificationData(this.props.userId)
        .then(response=>{
            let notificationData = response.data;
            var FR = [];
            var AN = [];
            notificationData.contents.map((notification)=>{
                if(notification.type === "FR"){
                    FR.insert(0,notification);
                }
                else{
                    AN.insert(0,notification);
                }
            });
            this.setState({
                FR: FR,
                AN: AN
            });
        });
    }

    onNotification = ()=>{
        this.getData();
    }

    componentDidMount() {
        this.getData();
        socket.on('notification',this.onNotification);
    }

    componentWillUnmount() {
        socket.removeEventListener('notification')
    }
    
    handleDelete = (id)=>{
        deleteNotification(id,this.props.userId)
        .then(response=>{
            let notificationData = response.data;
            var FR = [];
            var AN = [];
            notificationData.contents.forEach((notification)=>{
                if(notification.type === "FR"){
                    FR.insert(0,notification);
                }
                else{
                    AN.insert(0,notification);
                }
            });
            this.setState({
                FR: FR,
                AN: AN
            });
        });
    }

    handleFriendAccept = (id,user)=>{
        acceptFriendRequest(id,this.props.userId)
        .then(()=>{
            this.getData();
            socket.emit("friend request accepted",{
                sender: this.props.userId,
                target: user
            });
        });
    }

    handleActivityAccept = (notificationid)=>{
        acceptActivityRequest(notificationid,this.props.userId)
        .then(()=>{
            this.getData();
        });
    }

    render(){
        return(
            <div style={{marginTop:'50px'}}>
                <Navbar user={this.state.userData} notification="active"/>
                <div className="container">
                    <div className="row notification">
                        <div className="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">
                            <NotificationBody AN={this.state.AN} FR={this.state.FR}
                            handleDelete={this.handleDelete}
                            handleActivityAccept={this.handleActivityAccept}
                            handleFriendAccept={this.handleFriendAccept}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
