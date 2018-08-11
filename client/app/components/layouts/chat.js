import React from 'react';
import {Navbar} from '../containers';
import {ChatNavBody} from '../containers';
import {ChatWindow} from '../containers';
import {getUserData,getMessages,postMessage,getSessions,getSessionId} from '../../utils';
import {socket} from '../../utils';
import Drawer from 'material-ui/Drawer';

// var debug = require('react-debug');
let Promise = require('bluebird');

export default class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            message :[],
            sessions: [],
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
        socket.on('chat',()=>{
            Promise.join(getSessions(this.props.user), this.getMessagesForUser(this.state.friend._id))
            .spread((sessions, data)=>{
                this.setState({
                    sessions: sessions.data,
                    message: data.messages.data,
                    btnText:"load earier messages",
                    sessionId: data.sessionData
                })
            });
        });
    }

    componentWillUnmount() {
        socket.removeAllListeners("chat");
        socket.removeAllListeners('online');
    }

    async getData() {
        let initialData = await Promise.join(getUserData(this.props.user), getSessions(this.props.user));
        let userData = initialData[0].data;
        let sessionsData = initialData[1].data;
        let sessionData = await this.getSession(userData.friends[0]._id);
        let messages = await getMessages((new Date().getTime()),this.props.user,sessionData)

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
            var sessions = this.state.sessions;
            var result = null;
            sessions.forEach(session=>{
                if(session.users.indexOf(friend)!==-1){
                    return result = session._id;
                }
            });
            if(result === null){
                getSessionId(this.props.user,friend)
                .then(response=>{
                    resolve(response.data._id);
                })
            }
            else resolve(result);
        });
    }

    handlePostMessage(message){
        postMessage(this.state.sessionId, this.props.user, this.state.friend._id ,message)
        .then(async response=>{
            let newMessage = response.data;
            let sessions = await getSessions(this.props.user);
            this.setState({
                message: newMessage,
                sessions: sessions.data,
                btnText:"load earier messages"
            },()=>{
                socket.emit('chat',{currUser:this.props.user,friend:this.state.friend._id});
            });
        });
    }

    handleSwitchFriends(friendData){
        this.getMessagesForUser(friendData._id)
        .then(data=>{
            this.setState({
                friend: friendData,
                sessionId: data.sessionData,
                message: data.messages.data,
                btnText:data.messages.data.length===0?"say hello to your friend!":"load earier messages"
            });
        })
    }

    async getMessagesForUser(userId) {
        let sessionData = await this.getSession(userId);
        let messages = await getMessages((new Date().getTime()),this.props.user,sessionData);
        return {
            sessionData: sessionData,
            messages: messages
        }
    }

    handleLoadMessage(e){
        e.preventDefault();
        var time = this.state.message.length===0?(new Date().getTime()):this.state.message[0].date;
        getMessages(time,this.props.user,this.state.sessionId)
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
            <ChatWindow target={this.state.friend} curUser={this.props.user}
            onPost={(message)=>this.handlePostMessage(message)}
            message={this.state.message}
            onLoad={(e)=>this.handleLoadMessage(e)}
            onExpand={()=>this.setState({open:!this.state.open})}
            btnText={this.state.btnText}>
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
                <Drawer open={this.state.open} width={300} docked={false} onRequestChange={(open) => this.setState({open:open})}>
                    <ChatNavBody sessions={this.state.sessions}
                    userData={this.state.user} activeFriend={this.state.friend._id} switchUser={(id)=>this.handleSwitchFriends(id)}/>
                </Drawer>
                <Navbar chat="active" user={this.state.user}/>
                <div className="container mainElement">
                    <div className="row">

                        <div className="col-md-5 col-sm-5 col-xs-5 col-md-offset-1 col-sm-offset-1 col-xs-offset-1 chat-left">
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
