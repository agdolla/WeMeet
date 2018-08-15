import React from 'React';
import {Link} from 'react-router-dom';

//import presentations
import {ActivityDetailComment} from '../presentations';
import {ActivityCommentThread} from '../presentations';
import {ActivityDetailSignedUpUserItem} from '../presentations';
import {ActivityDetailSignedUpUserAvatar} from '../presentations'

//request function
import {getActivityDetail,postActivityDetailComment,
    sendJoinActivityRequest,likeActivity,
    unLikeActivity,socket, hideElement,didUserLike, getActivityItemCommments} from '../../utils';

var moment = require('moment');

import RaisedButton from 'material-ui/RaisedButton';

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
      loadMore: true
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
                <ul className="media-list">
                  {this.state.activity.participants === undefined ||
                    this.state.activity.participants.length === 0 ? "No one has signed up yet!" :
                    this.state.activity.participants.map((p,i)=>{
                    return (
                      <ActivityDetailSignedUpUserItem key={i} data={p} currUser={this.props.currentUser} friends={this.props.friends} />
                    )
                  })}
                </ul>
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

                      {this.state.activity.participants === undefined ? 0:this.state.activity.participants.map((p,i)=>{
                        return (<ActivityDetailSignedUpUserAvatar key={i} data={p} />)
                      })}

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
                    <RaisedButton primary={true} label={buttonText} disabled={this.state.ishost || this.state.joined} onClick={(e)=>this.handleRequestJoin(e)}/>
                  </div>
                </div>

                <div className="row">
                  <div className = "col-md-12 col-sm-12 col-xs-12 body-title-icon" style={{textAlign:"right"}}>
                    <a href="#" onClick={(e)=>this.handleLikeClick(e)}><span className="glyphicon glyphicon-heart" style={{'marginRight':'5px'}}></span>
                      {this.state.activity.likeCounter === undefined ? 0:this.state.activity.likeCounter.length}
                    </a>
                    <span className="glyphicon glyphicon-comment" style={{'marginRight':'5px','marginLeft':'20px'}}></span>
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
