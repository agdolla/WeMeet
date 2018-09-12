import React from 'react';
import {Navbar} from '../containers';
import {ChatNavBody} from '../containers';
import {ChatWindow} from '../containers';
import {getUserData,getMessages,getSessions,getSessionId} from '../../utils';
import {socket} from '../../utils';
import Drawer from '@material-ui/core/Drawer';

let debug = require('react-debug');
let Promise = require('bluebird');

export default class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            message :[],
            sessions: {},
            friend: "",
            sessionId:"",
            btnText:"load earier messages",
            open:false
        };
    }

    componentDidMount() {
        this.getData();

        socket.on('online',(data)=>{
            var tmp = Object.assign({},this.state.user);
            tmp.friends.forEach((i)=>{if(i._id===data.user)i.online=data.online})
            this.setState({ user:tmp })
        });

        socket.on('chat',(data)=>{
            let updatedSession = data.sessionData;
            var newSessions = Object.assign({},this.state.sessions);
            newSessions[updatedSession._id] = updatedSession;
            if(this.state.sessionId === updatedSession._id.toString()) {
                var newMsgs = Array.from(this.state.message);
                newMsgs.push({
                    sender: data.sender,
                    text: data.message,
                    date: data.date,
                    imgs: data.imgs,
                });
                this.setState({
                    sessions: newSessions,
                    btnText:"load earier messages",
                    message: newMsgs,
                });
            }
            else {
                this.setState({
                    sessions: newSessions,
                });
            }
        });
    }

    componentWillUnmount() {
        socket.removeAllListeners("chat");
        socket.removeAllListeners('online');
    }

    componentDidUpdate(prevProps, prevState) {
        if(JSON.stringify(this.state.user) !== JSON.stringify(prevState.user)){
            this.getData();
        }
    }

    async getData() {
        let user = await getUserData(this.state.user._id);
        let userData = user.data;
        var sessions = await getSessions(userData._id);
        sessions = sessions.data;
        var sessionsData = {};
        sessions.forEach((session)=>{
            sessionsData[session._id] = session
        });
        let sessionData = await this.getSession(userData.friends[0]._id);
        let messages = await getMessages((new Date().getTime()),userData._id,sessionData)

        this.setState({
            user: userData,
            sessions: sessionsData,
            friend: userData.friends[0],
            sessionId: sessionData,
            message: messages.data,
            btnText: messages.data.length===0?"say hello to your friend!":"load earier messages"
        });
    }

    getSession(friend){
        return new Promise((resolve, reject)=>{
            let sessions = this.state.sessions;
            let keys = Object.keys(sessions).filter((sessionId)=>{
                return sessions[sessionId].users.indexOf(friend) !== -1;
            })
            if(keys.length === 0){
                getSessionId(this.state.user._id,friend)
                .then(response=>{
                    resolve(response.data._id);
                })
            }
            else{
                resolve(keys[0]);
            }
        })
    }

    handlePostMessage(message, imgs){
        socket.emit('chat',{
            sessionId: this.state.sessionId,
            date: (new Date()).getTime(),
            sender: this.state.user._id,
            target: this.state.friend._id,
            message: message,
            imgs: imgs
        });
    }

    handleSwitchFriends(friendData){
        this.getMessagesForUser(friendData._id)
        .then(data=>{
            this.setState({
                friend: friendData,
                sessionId: data.sessionId,
                message: data.messages.data,
                btnText:data.messages.data.length===0?"say hello to your friend!":"load earier messages"
            });
        })
    }

    async getMessagesForUser(userId) {
        let sessionId = await this.getSession(userId);
        let messages = await getMessages((new Date().getTime()),this.state.user._id,sessionId);
        return {
            sessionId: sessionId,
            messages: messages
        }
    }

    handleLoadMessage(){
        var time = (this.state.message===undefined || this.state.message.length===0)?
        (new Date().getTime()):this.state.message[0].date;
        getMessages(time,this.state.user._id,this.state.sessionId)
        .then(response=>{
            let messages = response.data;
            if(messages.length===0){
                return this.setState({
                    btnText: "nothing more to load"
                })
            }
            var newMessages = messages.concat(this.state.message);
            this.setState({
                message:newMessages
            });
        });
    }

    render() {
        var chatwindow =
        (
            <ChatWindow target={this.state.friend} curUser={this.state.user}
            onPost={(message, imgs)=>this.handlePostMessage(message, imgs)}
            message={this.state.message}
            onLoad={()=>this.handleLoadMessage()}
            onExpand={()=>this.setState({open:!this.state.open})}
            btnText={this.state.btnText}
            failed={this.state.failed}>
            </ChatWindow>
        );
        if(this.state.user.friends === undefined? true: this.state.user.friends.length === 0){
            chatwindow = (
                <div className="col-md-7 col-sm-7 col-xs-7">
                    <div className="alert alert-info" role="alert">
                        You don't have any chats yet
                    </div>
                </div>
            )
        }
        return (
            <div style={{marginTop:'70px'}}>
                <Drawer open={this.state.open} 
                style={{width:'500px'}}
                onClose={() => this.setState({open:false})}>
                    <ChatNavBody sessions={this.state.sessions}
                    userData={this.state.user} activeFriend={this.state.friend._id} switchUser={(id)=>this.handleSwitchFriends(id)}/>
                </Drawer>
                <Navbar chat="active" user={this.state.user}/>
                <div className="container mainElement">
                    <div className="row">
                        <div style={{marginRight:'-50px'}}
                        className="col-md-5 col-sm-5 col-xs-5 col-md-offset-1 col-sm-offset-1 col-xs-offset-1 chat-left">
                            <ChatNavBody sessions={this.state.sessions}
                            userData={this.state.user} activeFriend={this.state.friend._id} switchUser={(id)=>this.handleSwitchFriends(id)}/>
                        </div>
                        {chatwindow}
                    </div>
                </div>
            </div>
        );
    }
}
