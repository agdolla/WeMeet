import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {socket} from '../../utils';
import {logout} from '../../utils';
import {hideElement, hasNewNotification} from '../../utils';
import Badge from 'material-ui/Badge';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import HardwareKeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import Person from 'material-ui/svg-icons/social/person';
import Settings from 'material-ui/svg-icons/action/settings';
import Create from 'material-ui/svg-icons/content/create';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import FontIcon from 'material-ui/FontIcon';
import Snackbar from 'material-ui/Snackbar';

var swal = require('sweetalert');
var debug = require('react-debug');

class Navbar extends React.Component{

  constructor(props){
    super(props);
    this.state={
      activity:false,
      post:false,
      chat:false,
      notification:false,
      notificationCount: 0,
      open:false,
      snackBar:false
    }
  }

  handleLogOut(e){
    e.preventDefault();
    logout();
    this.props.history.push('/');
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
      chat:true,
      snackBar:true
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
      notification:false
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

  // componentWillReceiveProps(){
  //   this.setState({
  //     activity:false,
  //     post:false,
  //     chat:false,
  //     notifiction:false
  //   });
  // }

  componentDidUpdate(prevProps, prevState) {
    if(Object.keys(this.props.user).length>0){
      hasNewNotification(this.props.user._id)
      .then(response=>{
        let count = response.data.count;
        if(prevState.notificationCount !== count){
          this.setState({
            notification:count>0,
            notificationCount: count
          });
        }
      })
    }
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
        this.props.history.push(route);
      }
    }
  }

  render(){
    var iconMenu =
    <IconMenu
      iconButtonElement={<IconButton><HardwareKeyboardArrowDown/></IconButton>}
      anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
      targetOrigin={{horizontal: 'right', vertical: 'bottom'}}>

      <Link style={{textDecoration:'none'}} to={"/profile/"+this.props.user._id}><MenuItem primaryText="Profile" rightIcon={<Person/>}/></Link>
      <Link style={{textDecoration:'none'}} to="/settings"><MenuItem primaryText="Settings" rightIcon={<Settings/>}/></Link>
      <Link style={{textDecoration:'none'}} to="/createActivity"><MenuItem primaryText="Create Activity" rightIcon={<Create/>}/></Link>
      <Divider/>
      <MenuItem primaryText="Log out" onClick={(e)=>this.handleLogOut(e)}/>
    </IconMenu>

    return(
      <div>
        <Snackbar
          open={this.state.snackBar && this.props.chat!=='active'}
          message={"You have new messages"}
          action="check"
          autoHideDuration={4000}
          onActionClick={()=>{this.props.history.push('/chat')}}
          onRequestClose={()=>{this.setState({snackBar:false})}}
        />

        <nav className="navbar navbar-default navbar-fixed-top" role="navigation">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" onClick={()=>{this.setState({open:!this.state.open})}}>
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link className="navbar-brand" to="/activity">
                <img src="./img/logo/mipmap-xxhdpi/ic_launcher.png" width="50px" height="50px" alt="" />
              </Link>
            </div>
            <Drawer
              docked={false}
              width={300}
              open={this.state.open}
              onRequestChange={(open) => this.setState({open:open})}
            >
            <List>
              <ListItem
                style={{marginBottom:'5px'}}
                rightIconButton={iconMenu}
                disabled={true}
                leftAvatar={
                  <Avatar style={{backgroundColor:'none'}} src={this.props.user.avatar} />
                }>
                {this.props.user.fullname}
              </ListItem>
              <Link style={{textDecoration:'none'}} to='/activity'>
                <ListItem primaryText="Activities" leftIcon={<FontIcon className="material-icons">featured_play_list</FontIcon>}/>
              </Link>

              <Link style={{textDecoration:'none'}} to='/post'>
                <ListItem primaryText="Trend" leftIcon={<FontIcon className="material-icons">assessment</FontIcon>}/>
              </Link>

              <Link style={{textDecoration:'none'}} to='/chat'>
                <ListItem primaryText="Chat" leftIcon={<FontIcon className="material-icons">chat_bubble</FontIcon>}/>
              </Link>

              <Link style={{textDecoration:'none'}} to='/search'>
                <ListItem primaryText="Search" leftIcon={<FontIcon className="material-icons">search</FontIcon>}/>
              </Link>

              <Link style={{textDecoration:'none'}} to='/notification'>
                <ListItem primaryText="Notification" leftIcon={<FontIcon className="material-icons">notifications</FontIcon>}/>
              </Link>
            </List>
            </Drawer>
            {/* Collect the nav links, forms, and other content for toggling */}
            <div className="collapse navbar-collapse" id="navbar">
              <ul className="nav navbar-nav nav-left">
                <li className={this.props.activity}>
                  <Link to='/activity'> Activities <i className={"fa fa-circle "+hideElement(!this.state.activity)} style={{fontSize:'12px',marginLeft:'2px',color:'#EF9A9A'}}aria-hidden="true"></i>
                  </Link>
                </li>
                <li className={this.props.post}>
                  <Link to='/post'>Trend <i className={"fa fa-circle "+hideElement(!this.state.post)} style={{fontSize:"12px",marginLeft:'2px',color:'#EF9A9A'}}aria-hidden="true"></i></Link>
                </li>
                <li className={this.props.chat}>
                  <Link to={'/chat'}>Chat <i className={"fa fa-circle "+hideElement(!this.state.chat||this.props.chat==="active")} style={{fontSize:'12px',marginLeft:'2px',color:'#EF9A9A'}}aria-hidden="true"></i></Link>
                </li>
              </ul>

              <ul className="nav navbar-nav navbar-right">
                <div className="pull-left">
                  <ListItem
                    style={{paddingBottom:'0px'}}
                    rightIconButton={iconMenu}
                    disabled={true}
                    leftAvatar={
                      <Avatar style={{backgroundColor:'none'}} src={this.props.user.avatar} />
                    }
                  >
                    {this.props.user.fullname}
                  </ListItem>
                </div>
                  <li className={this.props.search}>
                    <Link to="/search"><i className="fa fa-search" aria-hidden="true"/></Link>
                  </li>
                  <li className={this.props.notification}>
                    <Link to={"/notification"}>
                      {!this.state.notification?<i className="fa fa-bell-o" aria-hidden="true"></i>:
                      <Badge
                        badgeContent={this.state.notificationCount}
                        primary={true}
                        badgeStyle={{backgroundColor:'#f44336'}}
                        style={{padding:'10px 12px 10px 10px'}}/>}
                    </Link>
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
export default withRouter(Navbar);
