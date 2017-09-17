import React from 'React';
import {Link} from 'react-router';
// import ReactDOM from 'react-dom';

//request function
import {getUserData} from '../../utils';


import {ChatEntry} from '../presentations';
import {ChatRightBubble} from '../presentations';
import {ChatLeftBubble} from '../presentations';



// var debug = require('react-debug');
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';


export default class ChatWindow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            targetUser: props.target,
            message: props.message,
            load:false
        }
    }

    // componentDidMount() {
    //     this.getData();
    // }

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

    // getData() {
    //   if(!this.props.target==""){
    //     getUserData(this.props.target, (userData) => {
    //         this.setState({targetUser:userData})
    //     });}
    // }

    componentWillReceiveProps(nextProps){
        if(!this.props.target==""){
            this.setState({
                targetUser:nextProps.target,
                message:nextProps.message
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
                                <Link to={"profile/"+this.state.targetUser._id}>
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
