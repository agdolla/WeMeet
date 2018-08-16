import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch, withRouter} from 'react-router-dom';
import {Post} from './components/layouts';
import {Chat} from './components/layouts';
import {Notification} from './components/layouts';
import { Search } from './components/layouts';
import { Profile } from './components/layouts';
import { CreateActivity } from './components/layouts';
import { ActivityDetail} from './components/layouts';
import { Activity } from './components/layouts';
import { Settings } from './components/layouts';
import { Landing } from './components/layouts';
import {getUserId,isUserLoggedIn,socket,updateCredentials} from './utils/credentials';
import history from './utils/history';

// var debug = require('react-debug');
// var swal = require('sweetalert');

class ActivityPage extends React.Component{
    render(){
        let isFacebook = this.props.location.search!=="";
        if(isFacebook || isUserLoggedIn()){
            if(!isFacebook){
                var userId = getUserId();
                window.onload = ()=>{
                    socket.emit('user',userId);
                }
                return(<Activity userId={userId}/>);

            }
            else{ //facebook login
                const rawData = new URLSearchParams(this.props.location.search).get('data');
                var data = JSON.parse(rawData);
                updateCredentials(data.user);
                this.props.history.push('/activity');
                location.reload();
            }
        }
        else{
            this.props.history.push('/');
            location.reload();
        }
    }
}
withRouter(ActivityPage);

class ThrendPage extends React.Component{
    render(){
        if(isUserLoggedIn()){
            var userId = getUserId();
            window.onload = ()=>{
                socket.emit('user',userId);
            }
            return (<Post userId={userId}/>);
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
            <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route path="/post" component={ThrendPage} />
                <Route path="/activity/:data" component={ActivityPage} />
                <Route path="/settings" component={SettingsPage} />
                <Route path="/chat" component={ChatPage} />
                <Route path="/notification" component={NotificationPage}/>
                <Route path="/profile/:user" component={ProfilePage} />
                <Route path="/activityDetail/:id" component={ActivityDetailPage}/>
                <Route path="/search" component={SearchPage}/>
                <Route path="/createActivity" component={CreateActivityPage} />
                <Route path='*' component={ActivityPage} />
            </Switch>
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
                <Settings userId={userId} />
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
                <Chat userId={userId}/>
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
            var userId = getUserId();
            window.onload = ()=>{
                socket.emit('user',userId);
            }
            return(
                <Notification userId={userId} />
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
            var userId = getUserId();
            window.onload = ()=>{
                socket.emit('user',userId);
            }
            return(
                <ActivityDetail userId={userId} id={this.props.match.params.id}/>
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
            var userId = getUserId();
            window.onload = ()=>{
                socket.emit('user',userId);
            }
            return(
                <Search userId={userId}/>
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

class CreateActivityPage extends React.Component {
    render() {
        if(isUserLoggedIn()){
            var userId = getUserId();
            window.onload = ()=>{
                socket.emit('user',userId);
            }
            return (
                <CreateActivity userId={userId}/>
            );
        }
        else{
            this.props.history.push('/');
            location.reload();
        }
    }
}
withRouter(CreateActivityPage);

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
    <Router history={history}>
      <Route path="/" component={App} />
    </Router>
),document.getElementById('container'));
