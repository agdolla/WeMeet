import React from 'react';
import ReactDOM from 'react-dom';
import Activity from './activity/activity';
import Post from './post/post';
import Settings from './settings/settings';
import Chat from './chat/chat'
import Notification from './notification/notification';
import Search from './search/search';
import Profile from './profile/profile';
import PostActivity from './postactivity/postactivity';
import Activity_detail from './activity_detail/activity_detail';
import { IndexRoute, Router, Route, hashHistory } from 'react-router';
import {hideElement} from './util';
import {signup,login} from './server.js';
import {getUserId,isUserLoggedIn,socket,updateCredentials,getUserData} from './credentials';
var zxcvbn = require('zxcvbn');
// var debug = require('react-debug');
var swal = require('sweetalert');


class ActivityPage extends React.Component{
  render(){
    if(this.props.location.query.data===undefined){
      if(isUserLoggedIn()){
        var user = getUserData();
        window.onload = ()=>{
          socket.emit('user',user._id);
        }
        return(<Activity user={user}/>);
      }
      else{
        hashHistory.push('/');
        location.reload();
      }
    }
    //facebook login
    else{
     var data = JSON.parse(this.props.location.query.data);
      updateCredentials(data.user, data.token);
      window.onload = ()=>{
        socket.emit('user',data.user._id);
      }
      return(<Activity user={data.user}/>);
    }
  }
}
class ThrendPage extends React.Component{
  render(){
    if(isUserLoggedIn()){
      var user = getUserData();
      window.onload = ()=>{
        socket.emit('user',user._id);
      }
      return (<Post user={user}/>);
    }
    else{
      hashHistory.push('/');
      location.reload();
    }
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

class SettingsPage extends React.Component {
  render() {
    if(isUserLoggedIn()){
      var userId = getUserId();
      window.onload = ()=>{
        socket.emit('user',userId);
      }
      return (
        <Settings user={userId} />
      );
    }
    else{
      hashHistory.push('/');
      location.reload();
    }
  }
}

class ChatPage extends React.Component{
  render() {
    if(isUserLoggedIn()){
      var userId = getUserId();
      window.onload = ()=>{
        socket.emit('user',userId);
      }
      return (
        <Chat user={userId}/>
      );
    }
    else{
      hashHistory.push('/');
      location.reload();
    }
  }
}

class NotificationPage extends React.Component{
  render(){
    if(isUserLoggedIn()){
      var user = getUserData();
      window.onload = ()=>{
        socket.emit('user',user._id);
      }
      return(
        <Notification user={user} id={this.props.params.id}/>
      );
    }
    else{
      hashHistory.push('/');
      location.reload();
    }
  }
}

class ActivityDetailPage extends React.Component{
  render(){
    if(isUserLoggedIn()){
      var user = getUserData();
      window.onload = ()=>{
        socket.emit('user',user._id);
      }
      return(
        <Activity_detail user={user} id={this.props.params.id}/>
      )
    }
    else{
      hashHistory.push('/');
      location.reload();
    }
  }
}
class SearchPage extends React.Component{
   render(){
     if(isUserLoggedIn()){
       var user = getUserData();
       window.onload = ()=>{
         socket.emit('user',user._id);
       }
       return(
         <Search user={user}/>
       );
     }
     else{
       hashHistory.push('/');
       location.reload();
     }
  }
}

class ProfilePage extends React.Component{
  render(){
    if(isUserLoggedIn()){
      var userId = getUserId();
      window.onload = ()=>{
        socket.emit('user',userId);
      }
      return(
        <Profile user={this.props.params.user} currUser={userId}/>
      );
    }
    else{
      hashHistory.push('/');
      location.reload();
    }
  }
}

class PostActivityPage extends React.Component {
  render() {
    if(isUserLoggedIn()){
      var userId = getUserId();
      window.onload = ()=>{
        socket.emit('user',userId);
      }
      return (
        <PostActivity user={userId}/>
      );
    }
    else{
      hashHistory.push('/');
      location.reload();
    }
  }
}

class LandingPage extends React.Component{
  constructor(props){
    super(props);
    this.state={
      signInEmail:"",
      signInPass:"",
      signUpEmail:"",
      signUpName:"",
      signUpPass:"",
      signUpPass2:"",
      failedLogin:false,
      failedSignUp:false,
      submitted:false,
      passwordStrength:0,
      passwordClass:"progress-bar-danger",
      passwordTooSimple:false
    }
  }

  handleChange(field, e) {
    e.preventDefault();
    if(field==="signUpPass"){
      this.setState({
        passwordTooSimple:false
      });
      var strength = zxcvbn(e.target.value);
      switch (strength.score) {
        case 0:{
          this.setState({
            passwordStrength:20
          })
        }
          break;
        case 1:{
          this.setState({
            passwordStrength:40
          })
        }
          break;
        case 2:{
          this.setState({
            passwordStrength:60,
            passwordClass:"progress-bar-warning"
          })
        }
          break;
        case 3:{
          this.setState({
            passwordStrength:80,
            passwordClass:"progress-bar-success"
          })
        }
          break;
        case 4:{
          this.setState({
            passwordStrength:100,
            passwordClass:"progress-bar-success",
            passwordTooSimple:false
          })
        }
          break;
        default:
      }
      if(e.target.value===""){
        this.setState({
          passwordStrength:0,
          passwordClass:"progress-bar-danger"
        })
      }
    }
    var update = {};
    update[field] = e.target.value;
    this.setState(update);
  }

  handleSignIn(e){
    e.preventDefault();

    if(this.state.signInPass!==""&&this.state.signInEmail!==""&& (e.key==="Enter"||e.button===0)){
      this.setState({
        submitted:true
      });
      login(this.state.signInEmail,this.state.signInPass,(success)=>{
        if(success){
          this.setState({
            signInPass:"",
            signInEmail:"",
            failedLogin:false,
            submitted:false
          });
          hashHistory.push('/activity');
        }
        else{
          this.setState({
            failedLogin:true,
            submitted:false
          });
        }
      });
    }

  }
  componentDidMount(){
    if(isUserLoggedIn()){
      hashHistory.push("/activity");
    }
  }

  handleClick(e){
    e.preventDefault();
    var x = document.getElementsByTagName("body")[0];
    x.scrollTop=x.scrollHeight
  }

  handleSignUp(e){
    e.preventDefault();
    if(this.state.signUpName.trim()!==""&&
    this.state.signUpEmail!==""&&
    this.state.signUpPass!==""&&
    this.state.passwordStrength>=80&&
    this.state.signUpPass===this.state.signUpPass2&&(e.key==="Enter"||e.button===0)){
      this.setState({
        submitted:true
      });
      signup(this.state.signUpEmail,this.state.signUpName,this.state.signUpPass,(success)=>{
        if(success){
          login(this.state.signUpEmail,this.state.signUpPass,(success)=>{
            if(success){
              this.setState({
                signInPass:"",
                signInEmail:"",
                signUpEmail:"",
                signUpPass:"",
                signUpName:"",
                failedLogin:false,
                submitted:false,
                passwordError:false
              });
              hashHistory.push('/activity');
            }
            else{
              this.setState({
                failedLogin:true,
                submitted:false
              })
            }
          });
        }
        else{
          this.setState({
            failedSignUp:true,
            submitted:false
          });
        }
      });
    }
    else if(this.state.passwordStrength<80 && this.state.signUpPass!==""&&(e.key==="Enter"||e.button===0)){
      this.setState({
        passwordTooSimple:true,
        submitted:false
      })
    }
    else if(this.state.signUpPass2!==this.state.signUpPass&&(e.key==="Enter"||e.button===0)){
      this.setState({
        passwordError:true,
        submitted:false
      })
    }
  }

  render(){
    return(
      <div>
        <div className="bg">
          <div className="text-vertical-center">
            <h1 style={{color:'white'}}><span><img src="../img/logo/mipmap-xxxhdpi/ic_launcher.png" width="70px"/></span> WeMeet</h1>
            <h2 style={{color:'white'}}>Join nearby activities and make friends!</h2>
            <br/>
            <a href="#" onClick={(e)=>this.handleClick(e)} className="btn btn-mdb btn-lg">Sign up free today</a>
            <a href="#" onClick={(e)=>this.handleClick(e)} className="btn btn-info btn-lg">Log in</a>
            <a href="/auth/facebook" style={{background: '#3b5998'}} className="btn btn-dark btn-lg">
              <i className="fa fa-facebook" aria-hidden="true" style={{marginRight:'5px'}}></i>FACEBOOK
            </a>
          </div>
        </div>
        <div className="container index LandingPage">
          <div className="row">
            <div className="col-md-6 signin">
              <div className={"alert alert-danger " + hideElement(!this.state.failedLogin)} role="alert"><strong>Invalid email address or password.</strong> Please try a different email address or password, and try logging in again.</div>
              <div className="panel panel-primary">
                <div className="panel-heading">
                  <h4>Log in</h4>
                </div>
                <div className="panel-body">
                  <div className="row">
                    <div className="col-md-7 col-md-offset-2">
                      <div className="md-form">
                        <input onKeyUp={(e)=>this.handleSignIn(e)} disabled={this.state.submitted} type="text" className="form-control"
                          onChange={(e)=>this.handleChange("signInEmail",e)} required/>
                        <label>Email</label>
                      </div>
                    </div>
                    <div className="col-md-7 col-md-offset-2">
                      <div className="md-form">
                        <input onKeyUp={(e)=>this.handleSignIn(e)} disabled={this.state.submitted} type="password" className="form-control"
                          onChange={(e)=>this.handleChange("signInPass",e)}
                          required/>
                        <label>Password</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="panel-footer">
                  <div className="row">
                    <div className="col-md-12">
                      <button disabled={this.state.submitted} type="submit" className="btn btn-amber pull-right" onClick={(e)=>this.handleSignIn(e)}>
                        Welcome back!
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className={hideElement(!this.state.failedSignUp) + " alert alert-danger"} role="alert"><strong>
                Invalid account signup.</strong><br/>
              1.It is possible that you already have an account with that particular email address<br/>
              2.you didn't fill in all the blanks.<br/>
              3.email format is not correct
          </div>
          <div className={hideElement(!this.state.passwordError) + " alert alert-danger"} role="alert"><strong>
            Invalid account signup.</strong> two passwords don't match
          </div>
          <div className={hideElement(!this.state.passwordTooSimple) + " alert alert-danger"} role="alert"><strong>
            Password is too simple</strong>
          </div>
          <div className="panel panel-primary">
            <div className="panel-heading">
              <h4>Sign up</h4>
            </div>
            <div className="panel-body">
              <div className="row">
                <div className="col-md-7 col-md-offset-2">
                  <div className="md-form">
                    <input onKeyUp={(e)=>this.handleSignUp(e)} type="text" disabled={this.state.submitted} className="form-control" onChange={(e)=>this.handleChange("signUpName",e)}/>
                    <label>Username</label>
                  </div>
                </div>
                <div className="col-md-7 col-md-offset-2">
                  <div className="md-form">
                    <input onKeyUp={(e)=>this.handleSignUp(e)} type="email" disabled={this.state.submitted} className="form-control" onChange={(e)=>this.handleChange("signUpEmail",e)}/>
                    <label>Email</label>
                  </div>
                </div>
                <div className="col-md-7 col-md-offset-2">
                  <div className="md-form">
                    <input onKeyUp={(e)=>this.handleSignUp(e)} type="password" disabled={this.state.submitted} className="form-control" onChange={(e)=>this.handleChange("signUpPass",e)}/>
                    <label>Password</label>
                  </div>
                  <div className="progress" style={{height:'6', marginTop:'-15',borderRadius:'0'}}>
                    <div className={"progress-bar "+this.state.passwordClass}
                      role="progressbar"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{width:this.state.passwordStrength+"%"}}>
                    </div>
                  </div>
                </div>
                <div className="col-md-7 col-md-offset-2">
                  <div className="md-form">
                    <input onKeyUp={(e)=>this.handleSignUp(e)} type="password" disabled={this.state.submitted} className="form-control" onChange={(e)=>this.handleChange("signUpPass2",e)}/>
                    <label>Repeat password</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-footer">
              <div className="row">
                <div className="col-md-12">
                  <button disabled={this.state.submitted} type="button" className="btn btn-info pull-right" onClick={(e)=>this.handleSignUp(e)}>
                    Join Us!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
    );
  }
}

//render main
ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={LandingPage} />
      <Route path="post" component={ThrendPage} />
      <Route path="activity/:data" component={ActivityPage} />
      <Route path="settings" component={SettingsPage} />
      <Route path="chat" component={ChatPage} />
      <Route path="notification" component={NotificationPage}>
        <Route path="/notification/:id" component={NotificationPage}/>
      </Route>
      <Route path="profile" component={ProfilePage}>
        <Route path="/profile/:user" component={ProfilePage} />
      </Route>
      <Route path="activity_detail" component={ActivityDetailPage}>
        <Route path="/activity_detail/:id" component={ActivityDetailPage}/>
      </Route>
      <Route path="search" component={SearchPage}/>
      <Route path="postactivity" component={PostActivityPage} />
      <Route path='*' component={ActivityPage} />
    </Route>
  </Router>

),document.getElementById('container'));
