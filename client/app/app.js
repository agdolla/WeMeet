import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, withRouter} from 'react-router-dom';


import {Post} from './components/layouts';
import {Chat} from './components/layouts';
import {Notification} from './components/layouts';
import { Search } from './components/layouts';
import { Profile } from './components/layouts';
import { PostActivity } from './components/layouts';
import {Activity_detail} from './components/layouts';
import { Activity } from './components/layouts';
import { Settings } from './components/layouts';
import { Landing } from './components/layouts';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {getUserId,isUserLoggedIn,socket,updateCredentials,getUserData} from './utils/credentials';


var debug = require('react-debug');
// var swal = require('sweetalert');
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

// import Perf from 'react-addons-perf';
// window.Perf = Perf;

class ActivityPage extends React.Component{
    render(){
        if(this.props.location.search===""){
            if(isUserLoggedIn()){
                var user = getUserData();
                socket.emit('user',user._id);
                window.onload = ()=>{
                    socket.emit('user',user._id);
                }
                return(<Activity user={user}/>);
            }
            else{
                this.props.history.push('/');
                location.reload();
            }
        }
        //facebook login
        else{
            const rawData = new URLSearchParams(this.props.location.search).get('data');
            var data = JSON.parse(rawData);
            updateCredentials(data.user, data.token);
            socket.emit('user',data.user._id);
            window.onload = ()=>{
                socket.emit('user',data.user._id);
            }
            return(<Activity user={data.user}/>);
        }
    }
}
withRouter(ActivityPage);

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
            this.props.history.push('/');
            location.reload();
        }
    }
}
withRouter(ThrendPage);

class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                <Switch>
                  <Route exact path="/" component={LandingPage} />
                  <Route path="/post" component={ThrendPage} />
                  <Route path="/activity/:data" component={ActivityPage} />
                  <Route path="/settings" component={SettingsPage} />
                  <Route path="/chat" component={ChatPage} />
                  <Route path="/notification" component={NotificationPage}/>
                  <Route path="/profile/:user" component={ProfilePage} />
                  <Route path="/activity_detail/:id" component={ActivityDetailPage}/>
                  <Route path="/search" component={SearchPage}/>
                  <Route path="/postactivity" component={PostActivityPage} />
                  <Route path='*' component={ActivityPage} />
                </Switch>
            </MuiThemeProvider>
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
            this.props.history.push('/');
            location.reload();
        }
    }
}
withRouter(SettingsPage);

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
            this.props.history.push('/');
            location.reload();
        }
    }
}
withRouter(ChatPage);

class NotificationPage extends React.Component{
    render(){
        if(isUserLoggedIn()){
            var user = getUserData();
            window.onload = ()=>{
                socket.emit('user',user._id);
            }
            return(
                <Notification user={user} />
            );
        }
        else{
            this.props.history.push('/');
            location.reload();
        }
    }
}
withRouter(NotificationPage);

class ActivityDetailPage extends React.Component{
    render(){
        if(isUserLoggedIn()){
            var user = getUserData();
            window.onload = ()=>{
                socket.emit('user',user._id);
            }
            return(
                <Activity_detail user={user} id={this.props.match.params.id}/>
            )
        }
        else{
            this.props.history.push('/');
            location.reload();
        }
    }
}
withRouter(ActivityDetailPage);

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
            this.props.history.push('/');
            location.reload();
        }
    }
}
withRouter(SearchPage);

class ProfilePage extends React.Component{
    render(){
        if(isUserLoggedIn()){
            var userId = getUserId();
            window.onload = ()=>{
                socket.emit('user',userId);
            }
            return(
                <Profile user={this.props.match.params.user} currUser={userId}/>
            );
        }
        else{
            this.props.history.push('/');
            location.reload();
        }
    }
}
withRouter(ProfilePage);

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
            this.props.history.push('/');
            location.reload();
        }
    }
}
withRouter(PostActivityPage);

class LandingPage extends React.Component {
    render(){
        return(
            <Landing/ >
        );
    }
}
withRouter(LandingPage);

//render main
ReactDOM.render((
    <HashRouter>
      <Route path="/" component={App} />
    </HashRouter>
),document.getElementById('container'));
