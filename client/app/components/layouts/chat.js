import React from 'react';

import {Navbar} from '../containers';
import {ChatNavBody} from '../containers';
import {ChatWindow} from '../containers';

//request function
import {getUserData,getMessages,postMessage,getSessions,getSessionId} from '../../utils';
//credentials function
import {socket} from '../../utils';



import Drawer from 'material-ui/Drawer';
// var debug = require('react-debug');

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
        })
    }

    componentWillUpdate(){
        socket.removeAllListeners("chat");
    }

    componentDidUpdate(){
        socket.on('chat',()=>{
            this.getSession(this.state.friend._id,(session)=>{
                this.setState({
                    sessionId:session
                },
                ()=>{
                    getMessages((new Date().getTime()),this.props.user,this.state.sessionId,(message)=>{
                        this.setState({
                            message:message
                        },()=>{
                            getSessions(this.props.user, (sessions) => {
                                this.setState({
                                    sessions:sessions,
                                    btnText:"load earier messages"
                                });
                            });
                        })
                    });
                })
            });
        });
    }

    getData() {
        getUserData(this.props.user, (userData) => {
            this.setState({
                user:userData
            },()=>{
                getSessions(this.props.user,(sessions)=>{
                    this.setState({
                        sessions:sessions,
                        friend:this.state.user.friends[0]
                    },()=>{
                        this.getSession(this.state.friend._id,(session)=>{
                            this.setState({
                                sessionId:session
                            },
                            ()=>{
                                getMessages((new Date().getTime()),this.props.user,this.state.sessionId,(message)=>{
                                    this.setState({
                                        message:message,
                                        btnText:message.length===0?"say hello to your friend!":"load earier messages"
                                    })
                                });
                            });
                        });
                    });
                });
            })
        });
    }

    getSession(friend,callback){
        var sessions = this.state.sessions;
        var result = null;
        sessions.forEach(session=>{
            if(session.users.indexOf(friend)!==-1){
                return result = session._id;
            }
        });
        if(result === null){
            getSessionId(this.props.user,friend,(session)=>{
                return callback(session._id);
            });
        }else callback(result);
    }

    handlePostMessage(message){
        socket.emit('chat',{currUser:this.props.user,friend:this.state.friend._id});
        postMessage(this.state.sessionId, this.props.user, this.state.friend._id ,message, (newMessage)=>{
            this.setState({message:newMessage},()=>{
                getSessions(this.props.user, (sessions) => {
                    this.setState({
                        sessions:sessions,
                        btnText:"load earier messages"
                    })
                });
            });
        });
    }

    handleSwitchFriends(friendData){
        this.setState({friend:friendData},
            ()=>{
                this.getSession(this.state.friend._id,(session)=>{
                    this.setState({
                        sessionId:session
                    },
                    ()=>{
                        getMessages((new Date().getTime()),this.props.user,this.state.sessionId,(message)=>{
                            this.setState({
                                message:message,
                                btnText:message.length===0?"say hello to your friend!":"load earier messages"
                            })
                        });
                    });
                });
            }
        );
    }
    handleLoadMessage(e){
        e.preventDefault();
        var time = this.state.message.length===0?(new Date().getTime()):this.state.message[0].date;
        getMessages(time,this.props.user,this.state.sessionId,(messages)=>{
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
