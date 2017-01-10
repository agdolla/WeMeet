import React from 'React';
// import ReactDOM from 'react-dom';
import {getUserData} from '../server';
import {Link} from 'react-router';
import ChatEntry from './chatentry';
import ChatRightBubble from './chatrightbubble';
import ChatLeftBubble from './chatleftbubble';
// var debug = require('react-debug');

export default class ChatWindow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          targetUser: {},
          message: props.message,
          load:false
        }
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate() {
      if(!this.state.load)
        this.refs.chatwindow.scrollTop=this.refs.chatwindow.scrollHeight;
    }

    handleLoad(e){
      e.preventDefault();
      this.setState({
        load:true
      },()=>{
        this.props.onLoad(e);
      });

    }

    handlePostMessage(text){
      this.props.onPost(text);
    }

    getData() {
      if(!this.props.target==""){
        getUserData(this.props.target, (userData) => {
            this.setState({targetUser:userData})
        });}
    }

    componentWillReceiveProps(nextProps){
      if(!this.props.target==""){
      getUserData(this.props.target, (userData) => {
          this.setState(
            {
              targetUser:userData,
              message:nextProps.message
            })
      });}
    }
    render() {
        return (
            <div className="col-md-7 col-sm-7 col-xs-7 chat-right">
                <div className="panel panel-dafault chatwindow">
                    <div className="panel-heading">
                        <div className="media">
                            <div className="media-left">
                              <Link to={"profile/"+this.state.targetUser._id}>
                                <img className="media-object" src={this.state.targetUser.avatar } alt="image" height="45" width="45"></img>
                                </Link>
                          </div>
                            <div className="media-body">
                                <div className="media-heading">

                                    <div className="media">
                                        <div className="media-left media-body">
                                            <font size="3">{this.state.targetUser.fullname}</font>
                                        </div>

                                    </div>
                                </div>
                                <font size="2" color="grey ">
                                    {this.state.targetUser.description}</font>
                            </div>
                        </div>
                    </div>

                    <div className="panel-body" ref="chatwindow">
                      <div style={{textAlign:"center"}}>
                        <a href="" onClick={(e)=>this.handleLoad(e)}>{this.props.btnText}</a>
                      </div>

                      {this.state.message === undefined ? 0: this.state.message.map((msg,i)=>{
                        if(msg.sender._id===this.props.curUser){
                          return (
                            <ChatRightBubble key={i} data={msg} />
                          )
                        }
                        else{
                          return (
                            <ChatLeftBubble key={i} data={msg} />
                          )
                        }
                      })}

                    </div>

                    <ChatEntry onPost={(message)=>this.handlePostMessage(message)}/>
                </div>
            </div>

        )
    }
}
