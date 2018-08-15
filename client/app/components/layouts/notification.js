import React from 'react';
// import NavTab from './navTabs';
import {NotificationBody} from '../containers';
import {Navbar} from '../containers';
import {getNotificationData, deleteNotification,acceptFriendRequest,acceptActivityRequest} from '../../utils';
import {socket} from '../../utils';

export default class Notification extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            FR: [],
            AN: []
        }
    }

    getData = ()=>{
        getNotificationData(this.props.user._id)
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
        deleteNotification(id,this.props.user._id)
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

    handleFriendAccept = (id,user)=>{
        acceptFriendRequest(id,this.props.user._id)
        .then(()=>{
            this.getData();
            socket.emit("friend request accepted",{
                sender: this.props.user._id,
                target: user
            });
        });
    }

    handleActivityAccept = (notificationid)=>{
        acceptActivityRequest(notificationid,this.props.user._id)
        .then(()=>{
            this.getData();
        });
    }

    render(){
        return(
            <div style={{marginTop:'50px'}}>
                <Navbar user={this.props.user} notification="active"/>
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
