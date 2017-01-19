import React from 'react';
import {Link} from 'react-router';
import {logout} from '../credentials';
import {hashHistory} from 'react-router'
import {socket} from '../credentials';
import {hideElement} from '../util'
// var debug = require('react-debug');
var swal = require('sweetalert');

export default class Navbar extends React.Component{

  constructor(props){
    super(props);
    this.state={
      activity:false,
      post:false,
      chat:false,
      notification:false
    }
  }

  handleLogOut(e){
    e.preventDefault();
    logout();
    hashHistory.push('/');
  }

  onNewPost = () => {
    this.notifyMe('/post',"Hey there! You have new posts!");
    this.setState({
      post:true
    });
  }

  onNewActivity = () =>{
    this.notifyMe('/activity',"Hey there! You have new activities!");
    this.setState({
      activity:true
    });
  }
  onChat = ()=>{
    this.setState({
      chat:true
    });
  }
  onNotification = ()=>{
    this.setState({
      notification: true
    });
  }

  onFriendRequestAccepted = (data)=>{
    this.notifyMe('/chat',data.sender+" accepted your request");
  }

  componentDidMount(){
    this.setState({
      activity:false,
      post:false,
      chat:false,
      notifiction:false
    });
    socket.on('newActivity',this.onNewActivity);
    socket.on('newPost',this.onNewPost);
    socket.on('chat',this.onChat);
    socket.on('notification',this.onNotification);
    socket.on('friend request accepted',this.onFriendRequestAccepted);
  }

  componentWillUnmount(){
    socket.removeListener("newPost",this.onNewPost);
    socket.removeListener("newActivity",this.onNewActivity);
    socket.removeListener("chat",this.onChat);
    socket.removeListener("notification",this.onNotification);
    socket.removeListener("friend request accepted",this.onFriendRequestAccepted);
  }

  componentWillReceiveProps(){
    this.setState({
      activity:false,
      post:false,
      chat:false,
      notifiction:false
    });
  }

  notifyMe(route,message) {
    if (!Notification) {
      swal({
        title:'Desktop notifications not available in your browser!',
        text: 'Please try with a different browser.',
        type: 'error'
      });
      return;
    }
    if (Notification.permission !== "granted")
      Notification.requestPermission();
    else {
      var notification = new Notification('WeMeet', {
        icon: 'https://www.w1meet.com/img/logo/mipmap-xxhdpi/ic_launcher.png',
        body: message
      });
      notification.onclick = (event)=>{
        event.preventDefault();
        event.target.close();
        hashHistory.push(route);
      }
    }
  }

  render(){
    return(
      <div>
        <nav className="navbar navbar-default navbar-fixed-top" role="navigation">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link className="navbar-brand" to="/activity">
                <img src="./img/logo/mipmap-xxhdpi/ic_launcher.png" width="50px" height="50px" alt="" />
              </Link>
            </div>

            {/* Collect the nav links, forms, and other content for toggling */}
            <div className="collapse navbar-collapse" id="navbar">
              <ul className="nav navbar-nav nav-left">
                <li className={this.props.activity}>
                  <Link to='/activity'> Activities <i className={"fa fa-circle "+hideElement(!this.state.activity)} style={{fontSize:12,marginLeft:'2',color:'#EF9A9A'}}aria-hidden="true"></i>
                  </Link>
                </li>
                <li className={this.props.post}>
                  <Link to='/post'>Trend <i className={"fa fa-circle "+hideElement(!this.state.post)} style={{fontSize:12,marginLeft:'2',color:'#EF9A9A'}}aria-hidden="true"></i></Link>
                </li>
                <li className={this.props.chat}>
                  <Link to={"/chat"}>Chat <i className={"fa fa-circle "+hideElement(!this.state.chat||this.props.chat==="active")} style={{fontSize:12,marginLeft:'2',color:'#EF9A9A'}}aria-hidden="true"></i></Link>
                </li>
              </ul>

              <ul className="nav navbar-nav navbar-right">
                <div className="dropdown pull-left">
                  <a href="#" className="dropdown-toggle" type="button" id="user-options" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                    <img src={this.props.user.avatar} height="50px" alt="" /> {this.props.user.fullname}
                    <span className="caret"></span>
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="user-options">
                    <li><Link to={"profile/"+this.props.user._id}><span><i className="fa fa-user" aria-hidden="true"></i></span>Profile</Link></li>
                    <li><Link to="settings"><span><i className="fa fa-cog" aria-hidden="true"></i></span>Settings</Link></li>
                    <li><Link to="postactivity"><span><i className="fa fa-pencil" aria-hidden="true"></i></span>Create Activity</Link></li>
                    <li role="separator" className="divider"></li>
                    <li><a href="#" onClick={(e)=>this.handleLogOut(e)}><span><i className="fa fa-sign-out" aria-hidden="true"></i></span>Log out</a></li>
                  </ul>
                </div>
                  <li className={this.props.search}>
                    <Link to={"search"}><i className="fa fa-search" aria-hidden="true"/></Link>
                  </li>
                  <li className={this.props.notification}>
                    <Link to={"notification/"+1}><i className="fa fa-bell-o" aria-hidden="true"></i> <i className={"fa fa-circle "+hideElement(!this.state.notification)} style={{fontSize:12,marginLeft:'2',color:'#EF9A9A'}}aria-hidden="true"></i></Link>
                  </li>
              </ul>
            </div>
            {/*.navbar-collapse */}
          </div>
          {/*.container-fluid*/}
        </nav>
      </div>
    );
  }
}
