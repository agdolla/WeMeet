import React from 'React';
import {Link} from 'react-router-dom';
import {ActivityDetailComment} from '../presentations';
import {ActivityCommentThread} from '../presentations';
import {getActivityDetail,postActivityDetailComment,
  sendJoinActivityRequest,likeActivity,
  unLikeActivity,socket, hideElement,didUserLike, getActivityItemCommments, addFriend} from '../../utils';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Icon from '@material-ui/core/Icon';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

var moment = require('moment');
// var debug = require('react-debug');

export default class ActivityDetailBody extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      activity: {},
      comments: [],
      ishost: false,
      joined: false,
      success:false,
      loadMore: true,
      snackOpen: false
    };
  }

  handleLikeClick(e){
    e.preventDefault();

    if(e.button === 0){
      var handler = (likeCounter) => {
        var activity = this.state.activity;
        activity.likeCounter = likeCounter;
        this.setState(
          {activity:activity}
        );
      };

      if(!didUserLike(this.state.activity.likeCounter,this.props.currentUser)){
        likeActivity(this.state.activity._id,this.props.currentUser)
        .then(response => {handler(response.data)})
      }
      else{
        unLikeActivity(this.state.activity._id,this.props.currentUser)
        .then(response=>handler(response.data));
      }
    }
  }

  handlePostComment(comment){
    postActivityDetailComment(this.state.activity._id, this.props.currentUser ,comment)
    .then(response=>{
      this.setState({
        activity: response.data
      },()=>{
        this.loadComments(true);
      });
    });
  }

  getData(){
    getActivityDetail(this.props.id)
    .then(response=>{
      let activitydata = response.data;
      this.setState({activity:activitydata},()=>{
        this.setState({
          ishost: this.isHost(),
          joined: this.checkJoined()
        });
      });
    })
  }

  isHost(){
    return this.props.currentUser === this.state.activity.author._id;
  }


  checkJoined(){
    if(this.state.activity.participants===undefined){
      return false;
    }
    return this.state.activity.participants.filter((user)=>{return user._id==this.props.currentUser}).length>0;
  }

  handleRequestJoin(e){
    e.preventDefault();
    sendJoinActivityRequest(this.props.currentUser,this.state.activity.author._id,  this.state.activity._id)
    .then(response=>{
      socket.emit('notification',{
        sender: this.props.currentUser,
        target: this.state.activity.author._id
      });
      this.setState({
        success:true
      });
    })
    .catch(err=>{
      //todo: hande err
    })
  }

  checkFriendsOfUser(friendId){
      return this.props.currentUser===friendId || this.props.friends.filter((friend)=>{
          return friend._id===friendId
      }).length>0;
  }

  handleAddFriend(friendId){
      addFriend(this.props.currentUser,friendId)
      .then(response=>{
          this.setState({
              snackOpen:true
          });
          socket.emit('notification',{
              sender: this.props.currentUser,
              target: friendId
          });
      })
      .catch(err=>{
      })
  }

  handleRequestClose = () => {
    this.setState({
        snackOpen: false,
    });
  };

  loadComments(justPosted) {
    let date = justPosted || this.state.comments.length == 0 ? (new Date()).getTime() :
    this.state.comments[this.state.comments.length-1].postDate;

    getActivityItemCommments(this.props.id, date)
    .then(response=>{
        let load = response.data.length > 0;
        let activityComments = justPosted? response.data : this.state.comments.concat(response.data);
        this.setState({
            loadMore: load,
            comments: activityComments
        })
    })
}


  componentDidMount(){
    this.getData();
  }

  render(){
    var buttonText;
    if(this.state.ishost&&!this.state.joined){
      buttonText = "You are the host"
    }
    else if(!this.state.ishost&&this.state.joined){
      buttonText = "You have joined"
    }
    else{
        buttonText = "Click to sign up"
    }
    var data = this.state.activity
    var contents;
    var text;
    var name;
    var authorid;
    switch(data.type){
      case "Event":
      contents = data.contents;
      name = this.state.activity.author.fullname;
      authorid = this.state.activity.author._id;
        text = contents.text.split("\n").map((line, i) => {
          return (
            <p key={"line" + i}>{line}</p>
          )                       ;
        })
          break;
      case "Entertainment":
      contents = data.contents;
      name = this.state.activity.author.fullname;
      authorid = this.state.activity.author._id;
        text = contents.text.split("\n").map((line, i) => {
          return (
            <p key={"line" + i}>{line}</p>
          )                       ;
        })
          break;
      case "Study":
        contents = data.contents;
        name = this.state.activity.author.fullname;
        authorid = this.state.activity.author._id;
          text = contents.text.split("\n").map((line, i) => {
            return (
              <p key={"line" + i}>{line}</p>
            )                       ;
          })
        break;
      default:
        text = null;
        name = null;
    }


    return(
      <div className="activityDetail">
        <Snackbar
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={this.state.snackOpen}
        onClose={this.handleRequestClose}>
            <SnackbarContent
            style={{
                backgroundColor: 'green'
            }}
            message={
                <span style={{                        
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                    <CheckCircleIcon style={{fontSize: '20px', marginRight:'10px'}}/>
                    Friend request sent!
                </span>
            }
            />
        </Snackbar>
        <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header" style={{'paddingBottom':'4px'}}>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h3 className="modal-title" style={{'paddingBottom':'10px'}}> Participating users</h3>
              </div>
              <div className="modal-body">
                <List style={{backgroundColor: '#ffffff',padding:0, boxShadow:'0 10px 28px 0 rgba(137,157,197,.12)'}}>
                  {this.state.activity.participants === undefined ||
                    this.state.activity.participants.length === 0 ? "No one has signed up yet!" :
                    this.state.activity.participants.map((p,i)=>{
                      var rightButton;
                      if(this.checkFriendsOfUser(p._id)) {
                          rightButton =  <IconButton disabled>
                                          <Icon className="fas fa-check"/> 
                                      </IconButton>
                      }
                      else {
                          rightButton =  <IconButton onClick={()=>this.handleAddFriend(p._id)}>
                                          <Icon className="fas fa-plus"/> 
                                      </IconButton>
                      }
                      return <ListItem key={i} style={{padding:'20px'}}>
                          <Link to={'/profile/'+p._id}>
                              <Avatar src={p.avatar} />
                          </Link>
                          <ListItemText primary={p.fullname}
                          secondary={p.description}/>
                          <ListItemSecondaryAction>
                              {rightButton}
                          </ListItemSecondaryAction>
                      </ListItem>
                  })}
                </List>
              </div>
            </div>
          </div>
        </div>
        <div className= "adbackground" style={{"backgroundImage": "url("+this.state.activity.img+")"}}>
        </div>
        <div className = "container">
          <div className="row">
            <div className = "col-lg-10 col-md-12 col-sm-12 col-xs-12 col-lg-offset-1">
              <div className="panel panel-default body-title">
                <div className="panel-heading">

                  <div className = "row">
                    <div className = "col-md-8" >
                      <h2 style={{'paddingLeft':'15px'}}>{this.state.activity.title}</h2>

                      <span className="glyphicon glyphicon-time" style={
                          {'paddingRight':'10px','paddingLeft': '15px'}
                        }></span>
                        {moment(this.state.activity.startTime).format('MMMM Do YYYY, h:mm:ss a')}<br />

                      <span className="glyphicon glyphicon-map-marker"
                        style={{'paddingRight':'10px','paddingTop':'5px','paddingLeft': '15px'}}>
                      </span>
                      {this.state.activity.location}<br />
                      <span className="glyphicon glyphicon-user"
                        style={{'paddingRight':'10px','paddingTop':'5px','paddingLeft': '15px'}}>
                      </span>
                      <Link to={"/profile/"+authorid}>
                          {name}
                        </Link>
                    </div>

                    <div className = "col-md-4" style={{'paddingTop': '20px'}} >
                      <div className = "col-md-12 col-sm-12 col-xs-12 body-title-signed-in">
                        {this.state.activity.participants === undefined ? 0:this.state.activity.participants.length} people <font style={{'color':'grey'}}>signed up</font>

                      <font style={{'color':'#61B4E4','fontSize':'10px','paddingLeft':'10px','cursor':'pointer'}}
                        data-toggle="modal" data-target="#myModal"  >View All</font>
                      <br/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className = "col-md-12 col-sm-12 col-xs-12 remain-places" style={{'paddingTop':'25px',textAlign:"center"}} >
                  <div className={"alert alert-success"+hideElement(!this.state.success)}  role="alert" style={{
                    'marginLeft': '43%',
                     marginRight: '43%',
                     paddingTop: '8px',
                     paddingBottom: '8px',
                     marginBottom: '7px'
                  }}><font className={hideElement(!this.state.success)} style={{fontSize:13}}>Request sent!</font></div>
                    <Button variant="outlined" disabled={this.state.ishost || this.state.joined} onClick={(e)=>this.handleRequestJoin(e)}>
                      {buttonText}
                    </Button>
                  </div>
                </div>

                <div className="row">
                  <div className = "col-md-12 col-sm-12 col-xs-12 body-title-icon" style={{textAlign:"right"}}>
                    <FormControlLabel
                      control={
                        <Checkbox onClick={(e)=>this.handleLikeClick(e)}
                        style={{width: '30px', height: '30px'}}
                        checked={this.state.activity.likeCounter===undefined?
                          false:didUserLike(this.state.activity.likeCounter,this.props.currentUser)}
                        icon={<Icon style={{fontSize:'20px'}} className="far fa-heart"/>} 
                        checkedIcon={<Icon className="fas fa-heart" style={{color:'red',fontSize:'20px'}}/>}/>
                      }
                      label={this.state.activity.likeCounter === undefined ? 0:this.state.activity.likeCounter.length}
                    />
                    <Icon className='fas fa-comments' style={{
                      fontSize:'20px',width:'25px',marginRight:'8px',verticalAlign:'middle'
                      }}/>
                    {this.state.activity.commentsCount}
                  </div>
                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <div className="container-fluid body-detail">
                  <h4 style={{'color': 'grey'}}>Activity Details</h4>
                  <div className="row">
                    <div className="col-md-12" style={{'paddingTop':'20px'}}>
                      {text}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ActivityCommentThread count={this.state.activity.commentsCount} 
    user={this.props.currentUser} avatar={this.props.avatar} onPost={(comment)=>this.handlePostComment(comment)}
    onLoadComments={()=>this.loadComments(false)} loadMore={this.state.loadMore}>
      {this.state.comments.map((comment,i)=>{
        return (
          <ActivityDetailComment key={i} data={comment} />
        )
      })}
    </ActivityCommentThread>
  </div>
  )
}

}
