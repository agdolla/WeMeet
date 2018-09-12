import React from 'React';
import Link from 'react-router-dom/Link';
import {socket} from '../../utils/credentials';
import {getActivityMessages} from '../../utils';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

// let debug = require('react-debug');
let moment = require('moment');

moment.updateLocale('en', {
    longDateFormat : {
        LT: "h:mm:ss A"
    }
});

export default class ActivityChatPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: "",
            msgs: [],
            moreToLoad: true,
            numberOfUsers: 0,
        }
    }
    
    onUserJoined = (data)=>{
        let joinMessage = {
            user: data.user,
            type: "joined"
        }

        let newMsgs = this.state.msgs;
        newMsgs.push(joinMessage);

        this.setState({
            numberOfUsers: data.numberOfUsers,
            msgs: newMsgs
        },()=>{
            this.refs.activityChatWindow.scrollTop=this.refs.activityChatWindow.scrollHeight;
        });   
    }

    onUserLeft = (data)=>{
        let leftMessage = {
            user: data.user,
            type: "left"
        }
    
        let newMsgs = this.state.msgs;
        newMsgs.push(leftMessage);
    
        this.setState({
            numberOfUsers: data.numberOfUsers,
            msgs: newMsgs
        },()=>{
            this.refs.activityChatWindow.scrollTop=this.refs.activityChatWindow.scrollHeight;
        });
    }

    onNewActivityChatMessage = (data)=>{
        var newMsgs = Array.from(this.state.msgs);
        newMsgs.push(data);
        this.setState({
            msgs: newMsgs
        },()=>{
            this.refs.activityChatWindow.scrollTop=this.refs.activityChatWindow.scrollHeight;
        });
    }


    componentDidMount() {
        socket.on('new activity chat message', this.onNewActivityChatMessage);
        socket.on('user joined', this.onUserJoined);
        socket.on('user left', this.onUserLeft);

        //join room
        socket.emit('join activity chat room', {
            activityId: this.props.id,
            user: this.props.currentUser
        });

        this.getMessages(true);
    }

    componentWillUnmount() {
        //leave room
        socket.emit('leave activity chat room', {
            activityId: this.props.id,
            user: this.props.currentUser
        });

        //remove socket io listener
        socket.removeListener('new activity chat message', this.onNewActivityChatMessage);
        socket.removeListener('user joined', this.onUserJoined);
        socket.removeListener('user left', this.onUserLeft);
    }
    
    handleChange(e){
        e.preventDefault();
        this.setState({text: emojione.shortnameToUnicode(e.target.value)});
    }

    handleSendMsg(e){
        e.preventDefault();
        if(e.key === "Enter" || e.button===0){
            if(this.state.text.trim() !== ""){
                this.sendMessages();
                this.setState({text:""});
            }
        }
    }

    getMessages(initialLoad){
        let time = this.state.msgs.length > 0? this.state.msgs[0].postDate: (new Date()).getTime();
        getActivityMessages(this.props.id, time)
        .then(messages=>{
            let msgs = messages.data;
            let newMsgs = msgs.concat(initialLoad?[]:this.state.msgs);
            this.setState({
                msgs: newMsgs,
                moreToLoad: msgs.length > 0
            },()=>{
                if(initialLoad)
                    this.refs.activityChatWindow.scrollTop=this.refs.activityChatWindow.scrollHeight;
            });
        });
    }

    sendMessages(){
        let data = {
            activityId: this.props.id,
            author: this.props.currentUser,
            text: this.state.text.trim()
        }
        socket.emit('activity chat message', data);
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <div className="container-fluid">
                        <h4 style={{'color': 'grey'}}>Chat ({this.state.numberOfUsers})</h4>
                    </div>
                </div>
                <div className="panel-body" ref="activityChatWindow" style={{height:'450px', overflowY:'scroll'}}>
                    <Button onClick={()=>{
                        this.getMessages()
                    }} fullWidth disabled={!this.state.moreToLoad || this.state.msgs.length===0}>
                        {this.state.moreToLoad?"Load more messages":"nothing more to load"}
                    </Button>
                    <List>
                        {
                            this.state.msgs.map((msg, i)=>{
                                if(msg.type !== undefined) {
                                    return <ListItem key={i}>
                                        <Link to={'/profile/'+msg.user._id}>
                                            <ListItemAvatar>
                                                <Avatar src={msg.user.avatar} />
                                            </ListItemAvatar>
                                        </Link>
                                        <ListItemText primary={
                                            <span>
                                                <strong>{msg.user.fullname}</strong>
                                                <span style={{marginLeft:'8px'}}>{msg.type}</span>
                                            </span>
                                        }/>
                                    </ListItem>
                                }
                                //default time format
                                var time = moment(msg.postDate).calendar();
                                //if less than 1 hour, use relative time
                                if((new Date().getTime()) - msg.postDate <= 3600000)
                                    time = moment(msg.postDate).fromNow();
                                
                                return <ListItem key={i} style={{
                                    alignItems: "flex-start",
                                    marginBottom:'10px'
                                }}>
                                    <Link to={'/profile/'+msg.author._id}>
                                        <ListItemAvatar>
                                            <Avatar src={msg.author.avatar} />
                                        </ListItemAvatar>
                                    </Link>
                                    <ListItemText primary={
                                        <span>
                                            {msg.author.fullname}
                                            <span style={{fontSize:'12px', marginLeft:'15px'}}>{time}</span>
                                        </span>
                                    }
                                    secondary={msg.text}/>
                                </ListItem>
                            })
                        }
                    </List>
                </div>
                <div className="panel-footer" style={{height: '150px'}}>
                    <div className="row">
                        <div className="col-md-10 col-xs-10 col-sm-10">
                            <textarea id="chattext" className="form-control msg nohover non-active" name="name" rows="5" value={this.state.text}
                            onChange={(e)=>this.handleChange(e)} 
                            onFocus={(e)=>this.handleChange(e)} cols="40" placeholder="please type text"
                            onKeyUp={(e)=>this.handleSendMsg(e)}></textarea>
                        </div>
                        <div className="col-md-2 col-sm-2 col-xs-2 send">
                            <button type="button" className="btn btn-default btn-blue-grey pull-right" name="button"
                            onClick={(e)=>this.handleSendMsg(e)}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}