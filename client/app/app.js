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
import {getUserData} from './utils'

// let debug = require('react-debug');
// var swal = require('sweetalert');

class ActivityPage extends React.Component{
    render(){
        return <Activity user={this.props.userData}/>;
    }
}
withRouter(ActivityPage);

class ThrendPage extends React.Component{
    render(){
        return <Post user={this.props.userData}/>;
    }
}
withRouter(ThrendPage);

class App extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={LandingPage} />
                <WeMeet />
            </Switch>
        );
    }
}

class WeMeet extends React.Component {

    componentDidMount() {
        let isFacebook = this.props.location.search!=="";
        if(isFacebook){
            const rawData = new URLSearchParams(this.props.location.search).get('data');
            var data = JSON.parse(rawData);
            updateCredentials(data.user);
            history.push('/');
        }
        if(!isUserLoggedIn()){
            history.push('/');
            location.reload();
            return;
        }
        let userId = getUserId();
        window.onload = ()=>{
            socket.emit('user',userId);
        }
        getUserData(userId)
        .then(response=>{
            this.setState(response.data);
        })
    }

    componentDidUpdate() {
        if(!isUserLoggedIn()){
            history.push('/');
            location.reload();
        }
    }
    
    render() {
        if(this.state===null) return null;
        return (
            <Switch>
                <Route path="/post" component={()=>{return <ThrendPage userData={this.state}/>}}/>
                <Route path="/activity" component={()=>{return <ActivityPage userData={this.state}/>}}/>
                <Route path="/settings" component={()=>{return <SettingsPage userData={this.state}/>}} />
                <Route path="/chat" component={()=>{return <ChatPage userData={this.state} />}} />
                <Route path="/notification" component={()=>{return <NotificationPage userData={this.state}/>}}/>
                <Route path="/profile/:user" component={(props)=>{return <ProfilePage {...props} userData={this.state} />}} />
                <Route path="/activityDetail/:id" component={(props)=>{return <ActivityDetailPage {...props} userData={this.state}/>}}/>
                <Route path="/search" component={()=>{return <SearchPage userData={this.state}/>}}/>
                <Route path="/createActivity" component={()=>{return <CreateActivityPage userData={this.state}/>}} />
                <Route path='*' component={()=>{return <ActivityPage userData={this.state}/>}} />
            </Switch> 
        )
    }
}
withRouter(WeMeet);

class SettingsPage extends React.Component {
    render() {
        return <Settings user={this.props.userData} />
    }
}
withRouter(SettingsPage);

class ChatPage extends React.Component{
    render() {
        return (
            <Chat user={this.props.userData}/>
        );
    }
}
withRouter(ChatPage);

class NotificationPage extends React.Component{
    render(){
        return(
            <Notification user={this.props.userData} />
        );
    }
}
withRouter(NotificationPage);

class ActivityDetailPage extends React.Component{
    render(){
        return(
            <ActivityDetail user={this.props.userData} id={this.props.match.params.id}/>
        )
    }
}
withRouter(ActivityDetailPage);

class SearchPage extends React.Component{
    render(){
        return(
            <Search user={this.props.userData}/>
        );
    }
}
withRouter(SearchPage);

class ProfilePage extends React.Component{
    render(){
        return(
            <Profile user={this.props.match.params.user} currUser={this.props.userData}/>
        );
    }
}
withRouter(ProfilePage);

class CreateActivityPage extends React.Component {
    render() {
        return (
            <CreateActivity user={this.props.userData}/>
        );
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
