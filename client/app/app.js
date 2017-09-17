import React from 'react';
import ReactDOM from 'react-dom';
import { IndexRoute, Router, Route, hashHistory } from 'react-router';


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


// var debug = require('react-debug');
// var swal = require('sweetalert');
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

import Perf from 'react-addons-perf';
window.Perf = Perf;

class ActivityPage extends React.Component{
    render(){
        if(this.props.location.query.data===undefined){
            if(isUserLoggedIn()){
                var user = getUserData();
                socket.emit('user',user._id);
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
            socket.emit('user',data.user._id);
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
            <MuiThemeProvider>
                <div>
                    {this.props.children}
                </div>
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

class LandingPage extends React.Component {
    render(){
        return(
            <Landing/ >
        )
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
            <Route path="activity_detail/:id" component={ActivityDetailPage}/>
            <Route path="search" component={SearchPage}/>
            <Route path="postactivity" component={PostActivityPage} />
            <Route path='*' component={ActivityPage} />
        </Route>
    </Router>
),document.getElementById('container'));
