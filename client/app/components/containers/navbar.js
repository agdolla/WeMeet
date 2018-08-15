import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {socket} from '../../utils';
import {logout} from '../../utils';
import {hideElement, hasNewNotification} from '../../utils';
import Badge from '@material-ui/core/Badge';
import Avatar from "@material-ui/core/Avatar";
import IconButton from '@material-ui/core/IconButton';
import Person from '@material-ui/icons/Person';
import Settings from '@material-ui/icons/SettingsApplications';
import Create from '@material-ui/icons/Create';
import PowerOff from '@material-ui/icons/PowerOff'
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';


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
      snackBar:false,
      anchorEl: null
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

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render(){
    var iconMenu =
    <Menu
      id="simple-menu"
      anchorEl={this.state.anchorEl}
      open={Boolean(this.state.anchorEl)}
      onClose={this.handleClose}
    >
      <Link style={{textDecoration:'none', outline:'0px'}} to={"/profile/"+this.props.user._id}>
        <MenuItem>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText inset primary={<h5>Profile</h5>} />
        </MenuItem>
      </Link>
      <Link style={{textDecoration:'none', outline:'0px'}} to="/settings">
        <MenuItem>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText inset primary={<h5>Settings</h5>} />
        </MenuItem>
      </Link>
      <Link style={{textDecoration:'none', outline:'0px'}} to="/createActivity">
        <MenuItem>
          <ListItemIcon>
            <Create />
          </ListItemIcon>
          <ListItemText inset primary={<h5>Create Activity</h5>} />
        </MenuItem>
      </Link>
      <Divider/>
      <MenuItem onClick={(e)=>this.handleLogOut(e)}>
          <ListItemIcon>
            <PowerOff/>
          </ListItemIcon>
          <ListItemText inset primary={<h5>Logout</h5>} />
      </MenuItem>
    </Menu>

    return(
      <div>
        <Snackbar
          open={this.state.snackBar && this.props.chat!=='active'}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          message={"You have new messages"}
          action="check"
          autoHideDuration={4000}
          onClose={()=>{this.setState({snackBar:false})}}
          action={[
            <Button key="undo" color="secondary" size="small" onClick={()=>{this.props.history.push('/chat')}}>
              Check
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={()=>{this.setState({snackBar:false})}}>
              <CloseIcon />
            </IconButton>,
          ]}
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
              open={this.state.open}
              onClose={() => this.setState({open:false})}
              style={{width:'300px'}}>
            <List style={{width:'300px'}}>
            <ListItem style={{paddingBottom:'0px'}}>
              <ListItemAvatar>
                <Avatar src={this.props.user.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={<h4>{this.props.user.fullname}</h4>}/>
                <ListItemSecondaryAction>
                  <IconButton aria-haspopup="true"
                    onClick={this.handleClick}
                    aria-owns={this.state.anchorEl ? 'simple-menu' : null}>
                    <ExpandMore />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Link style={{textDecoration:'none'}} to='/activity'>
                <ListItem>
                  <ListItemIcon>
                    <Icon className="fas fa-list-alt"></Icon>
                  </ListItemIcon>
                  <ListItemText inset primary="Activities" />
                </ListItem>
              </Link>

              <Link style={{textDecoration:'none'}} to='/post'>
                <ListItem>
                  <ListItemIcon>
                    <Icon className="fas fa-book"/>
                  </ListItemIcon>
                  <ListItemText inset primary="Trend" />
                </ListItem>
              </Link>

              <Link style={{textDecoration:'none'}} to='/chat'>
                <ListItem>
                  <ListItemIcon>
                    <Icon className="fas fa-comment-alt"/>
                  </ListItemIcon>
                  <ListItemText inset primary="Chat" />
                </ListItem>
              </Link>

              <Link style={{textDecoration:'none'}} to='/search'>
                <ListItem>
                  <ListItemIcon>
                    <Icon className="fas fa-search"/>
                  </ListItemIcon>
                  <ListItemText inset primary="Search" />
                </ListItem>
              </Link>

              <Link style={{textDecoration:'none'}} to='/notification'>
                <ListItem>
                  <ListItemIcon>
                    <Icon className="fas fa-bell"/>
                  </ListItemIcon>
                  <ListItemText inset primary="Notification" />
                </ListItem>
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
                  <ListItem style={{paddingBottom:'0px'}}>
                    <ListItemAvatar>
                      <Avatar src={this.props.user.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<h5>{this.props.user.fullname}</h5>}/>
                      <ListItemSecondaryAction>
                        <IconButton aria-haspopup="true"
                          onClick={this.handleClick}
                          aria-owns={this.state.anchorEl ? 'simple-menu' : null}>
                          <ExpandMore />
                        </IconButton>
                      </ListItemSecondaryAction>
                  </ListItem>
                  {iconMenu}
                </div>
                  <li className={this.props.search}>
                    <Link to="/search"><i className="fa fa-search" aria-hidden="true"/></Link>
                  </li>
                  <li className={this.props.notification}>
                    <Link to={"/notification"}>
                      {!this.state.notification?<i className="far fa-bell" aria-hidden="true"></i>:
                        <Badge
                        style={{width:'20px'}}
                        badgeContent={this.state.notificationCount}
                        color='secondary'>
                          <i className="far fa-bell" aria-hidden="true"/>
                        </Badge>
                        }
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
