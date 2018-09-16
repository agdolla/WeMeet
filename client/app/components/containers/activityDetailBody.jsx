import React from 'React';
import Link from 'react-router-dom/Link';
import { ActivityCommentThread } from '../presentations';
import { ActivityChatPanel } from '.';
import {
  getActivityDetail, postActivityDetailComment, likeActivity,
  unLikeActivity, hideElement, didUserLike, getActivityItemCommments
} from '../../utils';
import { socket } from '../../utils/credentials';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Icon from '@material-ui/core/Icon';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Divider from '@material-ui/core/Divider';
import ErrorIcon from '@material-ui/icons/Error';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

var moment = require('moment');
// var debug = require('react-debug');

export default class ActivityDetailBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activity: {},
      comments: [],
      ishost: false,
      joined: false,
      success: false,
      loadMore: true,
      snackOpen: false,
      snackbarContent: "",
      snackbarColor: 'green',
      snackbarType: 'success',
      inviteDialogOpen: false,
      usersDialogOpen: false,
      invitedFriendList: [],

    };
  }

  handleLikeClick(e) {
    e.preventDefault();

    if (e.button === 0) {
      var handler = (likeCounter) => {
        var activity = this.state.activity;
        activity.likeCounter = likeCounter;
        this.setState(
          { activity: activity }
        );
      };

      if (!didUserLike(this.state.activity.likeCounter, this.props.currentUser)) {
        likeActivity(this.state.activity._id, this.props.currentUser)
          .then(response => { handler(response.data) })
      }
      else {
        unLikeActivity(this.state.activity._id, this.props.currentUser)
          .then(response => handler(response.data));
      }
    }
  }

  handlePostComment(comment) {
    postActivityDetailComment(this.state.activity._id, this.props.currentUser, comment)
      .then(response => {
        this.setState({
          activity: response.data
        }, () => {
          this.loadComments(true);
        });
      });
  }

  getData() {
    getActivityDetail(this.props.id)
      .then(response => {
        let activitydata = response.data;
        this.setState({ activity: activitydata }, () => {
          this.setState({
            ishost: this.isHost(),
            joined: this.checkJoined()
          });
        });
      })
  }

  isHost() {
    return this.props.currentUser === this.state.activity.author._id;
  }


  checkJoined() {
    if (this.state.activity.participants === undefined) {
      return false;
    }
    return this.state.activity.participants.filter((user) => { return user._id == this.props.currentUser }).length > 0;
  }

  handleRequestJoin(e) {
    e.preventDefault();
    socket.emit('activity notification', {
      sender: this.props.currentUser,
      target: this.state.activity.author._id,
      activityId: this.state.activity._id,
      type: 'request'
    });
  }

  checkFriendsOfUser(friendId) {
    return this.props.currentUser === friendId || this.props.friends.filter((friend) => {
      return friend._id === friendId
    }).length > 0;
  }

  handleAddFriend(friendId) {
    socket.emit('friend notification', {
      sender: this.props.currentUser,
      target: friendId
    });
  }

  handleRequestClose = () => {
    this.setState({
      snackOpen: false,
    });
  };

  loadComments(justPosted) {
    let date = justPosted || this.state.comments.length == 0 ? (new Date()).getTime() :
      this.state.comments[this.state.comments.length - 1].postDate;

    getActivityItemCommments(this.props.id, date)
      .then(response => {
        let load = response.data.length > 0;
        let activityComments = justPosted ? response.data : this.state.comments.concat(response.data);
        this.setState({
          loadMore: load,
          comments: activityComments
        })
      })
  }

  handleError = (res) => {
    let err = res.error;
    let message = err ? 'failed to send request!' : 'request sent!';
    let backgroundColor = err ? '#f44336' : '#4CAF50';
    this.setState({
      snackOpen: true,
      snackbarColor: backgroundColor,
      snackbarContent: message,
      snackbarType: err ? 'error' : 'success'
    });
  }


  componentDidMount() {
    this.getData();
    socket.on('activity notification', this.handleError);
    socket.on('friend notification', this.handleError);
  }

  componentWillUnmount = () => {
    socket.removeListener('activity notification', this.handleError);
    socket.removeListener('friend notification', this.handleError);
  }

  handleDialogClose = () => {
    this.setState({
      inviteDialogOpen: false,
      invitedFriendList: []
    })
  }

  handleDialogOpen = () => {
    this.setState({
      inviteDialogOpen: true
    })
  }

  handleUsersDialogClose = () => {
    this.setState({
      usersDialogOpen: false
    })
  }

  handleUsersDialogOpen = () => {
    this.setState({
      usersDialogOpen: true
    })
  }

  handleInvite(value) {
    var newFriendList = Array.from(this.state.invitedFriendList);
    if (newFriendList.indexOf(value) == -1)
      newFriendList.push(value);
    else newFriendList.splice(newFriendList.indexOf(value), 1);
    this.setState({
      invitedFriendList: newFriendList
    })
  }

  handleSendInvitation() {
    this.state.invitedFriendList.map((targetid) => {
      socket.emit('activity notification', {
        sender: this.props.currentUser,
        target: targetid,
        activityId: this.props.id,
        type: 'invite'
      });
    });
    this.handleDialogClose();
  }


  render() {
    var buttonText;
    if (this.state.ishost && !this.state.joined) {
      buttonText = "You are the host"
    }
    else if (!this.state.ishost && this.state.joined) {
      buttonText = "You have joined"
    }
    else {
      buttonText = "Click to sign up"
    }
    var data = this.state.activity
    var contents;
    var text;
    var name;
    var authorid;
    switch (data.type) {
      case "Event":
        contents = data.contents;
        name = this.state.activity.author.fullname;
        authorid = this.state.activity.author._id;
        text = contents.text.split("\n").map((line, i) => {
          return (
            <p key={"line" + i}>{line}</p>
          );
        })
        break;
      case "Entertainment":
        contents = data.contents;
        name = this.state.activity.author.fullname;
        authorid = this.state.activity.author._id;
        text = contents.text.split("\n").map((line, i) => {
          return (
            <p key={"line" + i}>{line}</p>
          );
        })
        break;
      case "Study":
        contents = data.contents;
        name = this.state.activity.author.fullname;
        authorid = this.state.activity.author._id;
        text = contents.text.split("\n").map((line, i) => {
          return (
            <p key={"line" + i}>{line}</p>
          );
        })
        break;
      default:
        text = null;
        name = null;
    }

    return (
      <div className="activityDetail">
        <Dialog
          open={this.state.inviteDialogOpen}
          onClose={this.handleDialogClose}>
          <DialogTitle>{"Invite your friends"}</DialogTitle>
          <DialogContent style={{ width: '400px' }}>
            <List>
              {this.props.friends.map((friend, i) => {
                return <ListItem key={i}>
                  <ListItemAvatar>
                    <Avatar src={friend.avatar} />
                  </ListItemAvatar>
                  <ListItemText primary={friend.fullname} />
                  <ListItemSecondaryAction>
                    {this.state.activity.participants !== undefined &&
                      this.state.activity.participants.filter((participant) => {
                        return participant._id === friend._id
                      }).length === 0 ?
                      <Checkbox
                        onChange={() => this.handleInvite(friend._id)}
                        checked={this.state.invitedFriendList.indexOf(friend._id) !== -1}
                      /> :
                      <Checkbox
                        disabled
                        checked={true}
                      />
                    }
                  </ListItemSecondaryAction>
                </ListItem>
              })}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose}>
              Cancel
            </Button>
            <Button onClick={() => this.handleSendInvitation()} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          autoHideDuration={4000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={this.state.snackOpen}
          onClose={this.handleRequestClose}>
          <SnackbarContent
            style={{
              backgroundColor: [this.state.snackbarColor]
            }}
            message={
              <span style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                {this.state.snackbarType === 'success' ?
                  <CheckCircleIcon style={{ fontSize: '20px', marginRight: '10px' }} /> :
                  <ErrorIcon style={{ fontSize: '20px', marginRight: '10px' }} />}
                {this.state.snackbarContent}
              </span>
            }
          />
        </Snackbar>
        <Dialog
          open={this.state.usersDialogOpen}
          onClose={this.handleUsersDialogClose}>
          <DialogTitle>{"Joined Users"}</DialogTitle>
          <DialogContent style={{ width: '600px' }}>
            <List>
              {this.state.activity.participants === undefined ||
                this.state.activity.participants.length === 0 ? "No one has signed up yet!" :
                this.state.activity.participants.map((p, i) => {
                  var rightButton;
                  if (this.checkFriendsOfUser(p._id)) {
                    rightButton = <IconButton disabled>
                      <Icon className="fas fa-check" />
                    </IconButton>
                  }
                  else {
                    rightButton = <IconButton onClick={() => this.handleAddFriend(p._id)}>
                      <Icon className="fas fa-plus" />
                    </IconButton>
                  }
                  return <ListItem key={i} style={{ padding: '20px' }}>
                    <Link to={'/profile/' + p._id}>
                      <Avatar src={p.avatar} />
                    </Link>
                    <ListItemText primary={p.fullname}
                      secondary={p.description} />
                    <ListItemSecondaryAction>
                      {rightButton}
                    </ListItemSecondaryAction>
                  </ListItem>
                })}
            </List>
          </DialogContent>
        </Dialog>
        <div className="adbackground" style={{ "backgroundImage": "url(" + this.state.activity.img + ")" }}>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-md-12 col-sm-12 col-xs-12 col-lg-offset-1">
              <div className="panel panel-default body-title">
                <div className="panel-heading">

                  <div className="row">
                    <div className="col-md-8" >
                      <h2 style={{ 'paddingLeft': '15px' }}>{this.state.activity.title}</h2>

                      <span className="glyphicon glyphicon-time" style={
                        { 'paddingRight': '10px', 'paddingLeft': '15px' }
                      }></span>
                      {moment(this.state.activity.startTime).format('MMMM Do YYYY, h:mm:ss a')}<br />

                      <span className="glyphicon glyphicon-map-marker"
                        style={{ 'paddingRight': '10px', 'paddingTop': '5px', 'paddingLeft': '15px' }}>
                      </span>
                      {this.state.activity.location}<br />
                      <span className="glyphicon glyphicon-user"
                        style={{ 'paddingRight': '10px', 'paddingTop': '5px', 'paddingLeft': '15px' }}>
                      </span>
                      <Link to={"/profile/" + authorid}>
                        {name}
                      </Link>
                    </div>

                    <div className="col-md-4" style={{ 'paddingTop': '20px' }} >
                      <div className="col-md-12 col-sm-12 col-xs-12 body-title-signed-in">
                        {this.state.activity.participants === undefined ? 0 : this.state.activity.participants.length} people <font style={{ 'color': 'grey' }}>joined</font>

                        <font style={{ 'color': '#61B4E4', 'fontSize': '10px', 'paddingLeft': '10px', 'cursor': 'pointer' }}
                          onClick={this.handleUsersDialogOpen}>View All</font>
                        <br />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12 remain-places" style={{ 'paddingTop': '25px', textAlign: "center" }} >
                      <div className={"alert alert-success" + hideElement(!this.state.success)} role="alert" style={{
                        marginLeft: '43%',
                        marginRight: '43%',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        marginBottom: '7px'
                      }}><font className={hideElement(!this.state.success)} style={{ fontSize: 13 }}>Request sent!</font></div>
                      <Button variant="outlined" disabled={this.state.ishost || this.state.joined} onClick={(e) => this.handleRequestJoin(e)}>
                        {buttonText}
                      </Button>
                      {this.state.ishost &&
                        <Button onClick={this.handleDialogOpen} variant="outlined" color="primary" style={{ marginLeft: '10px' }}>
                          Invite friends
                        </Button>}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12 body-title-icon" style={{ textAlign: "right" }}>
                      <FormControlLabel
                        control={
                          <Checkbox onClick={(e) => this.handleLikeClick(e)}
                            style={{ width: '30px', height: '30px' }}
                            checked={this.state.activity.likeCounter === undefined ?
                              false : didUserLike(this.state.activity.likeCounter, this.props.currentUser)}
                            icon={<Icon style={{ fontSize: '20px' }} className="far fa-heart" />}
                            checkedIcon={<Icon className="fas fa-heart" style={{ color: 'red', fontSize: '20px' }} />} />
                        }
                        label={this.state.activity.likeCounter === undefined ? 0 : this.state.activity.likeCounter.length}
                      />
                      <Icon className='fas fa-comments' style={{
                        fontSize: '20px', width: '25px', marginRight: '8px', verticalAlign: 'middle'
                      }} />
                      {this.state.activity.commentsCount}
                    </div>
                  </div>
                </div>
              </div>
              <div className="panel panel-default">
                <div className="panel-heading">
                  <div className="container-fluid body-detail">
                    <h4 style={{ 'color': 'grey' }}>Activity Details</h4>
                    <div className="row">
                      <div className="col-md-12" style={{ 'paddingTop': '20px' }}>
                        {text}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ActivityChatPanel id={this.props.id} currentUser={this.props.currentUser} />
            </div>
          </div>
        </div>
        <ActivityCommentThread count={this.state.activity.commentsCount}
          user={this.props.currentUser} avatar={this.props.avatar} onPost={(comment) => this.handlePostComment(comment)}
          onLoadComments={() => this.loadComments(false)} loadMore={this.state.loadMore}>
          {this.state.comments.map((comment, i) => {
            //default time format
            var commentTime = moment(comment.postDate).calendar();
            //if less than 24 hours, use relative time
            if ((new Date().getTime()) - comment.postDate <= 86400000)
              commentTime = moment(comment.postDate).fromNow();
            return (
              <div>
                <ListItem key={i}>
                  <ListItemAvatar>
                    <Link to={'/profile/' + comment.author._id}>
                      <Avatar src={comment.author.avatar} />
                    </Link>
                  </ListItemAvatar>
                  <ListItemText primary={
                    <span>
                      {comment.author.fullname}
                      <span style={{ fontSize: '12px', marginLeft: '15px' }}>{commentTime}</span>
                    </span>
                  }
                    secondary={comment.text} />
                </ListItem>
                <Divider light inset />
              </div>
            )
          })}
        </ActivityCommentThread>
      </div>
    )
  }

}
