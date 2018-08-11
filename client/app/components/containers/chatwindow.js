import React from 'React';
import {Link} from 'react-router-dom';
import {ChatEntry} from '../presentations';
import {ChatRightBubble} from '../presentations';
import {ChatLeftBubble} from '../presentations';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

// var debug = require('react-debug');

export default class ChatWindow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            targetUser: props.target,
            message: props.message
        }
    }

    componentDidMount() {
        this.setState({
            targetUser:this.props.target,
            message:this.props.message
        });
        this.refs.chatwindow.scrollTop=this.refs.chatwindow.scrollHeight;
    }

    async handlePostMessage(text){
        await this.props.onPost(text);
        this.refs.chatwindow.scrollTop=this.refs.chatwindow.scrollHeight;
    }

    componentDidUpdate(prevProps, prevState) {
        if((this.props.target._id!==prevProps.target._id
        || JSON.stringify(this.props.message)!==JSON.stringify(prevProps.message))){
            this.setState({
                targetUser:this.props.target,
                message:this.props.message
            })
        }
    }

    render() {
        return (
            <div className="col-md-7 col-md-offset-0 col-sm-10 col-sm-offset-1 col-xs-12 chat-right">
                <div className="panel panel-dafault chatwindow">
                    <div className="panel-heading">
                        <IconButton className="pull-right friend-btn" tooltip="Friends" tooltipPosition="bottom-center" onClick={()=>this.props.onExpand()}>
                            <FontIcon className="material-icons">group</FontIcon>
                        </IconButton>
                        <div className="media">
                            <div className="media-left">
                                <Link to={"/rofile/"+this.state.targetUser._id}>
                                    <img className="media-object" src={this.state.targetUser.avatar } alt="image" height="45" width="45"></img>
                                </Link>
                            </div>
                            <div className="media-body">
                                <div className="row">
                                    <div className="col-md-10">
                                        <div className="media-heading">
                                            <div className="media">
                                                <div className="media-left media-body">
                                                    <font size="3">{this.state.targetUser.fullname}</font>
                                                </div>
                                            </div>
                                        </div>
                                        <font size="2" color="grey ">
                                            {this.state.targetUser.description}
                                        </font>
                                    </div>
                                    <div className="col-md-2">
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="panel-body" ref="chatwindow">
                        <div style={{textAlign:"center"}}>
                            <a href="" onClick={(e)=>this.props.onLoad(e)}>{this.props.btnText}</a>
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
