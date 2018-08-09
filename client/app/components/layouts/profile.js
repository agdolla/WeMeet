import React from 'react';
import {Navbar} from '../containers';
import {ProfilePersonalInfo} from '../containers';
import {ProfileRecentActivityFeed} from '../containers';
import {ProfileRecentPostFeed} from '../containers';
import {getUserData} from '../../utils';
import {Tabs, Tab} from 'material-ui/Tabs';

// let debug = require('react-debug');
let Promise = require('bluebird');

export default class Profile extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            currUser: {},
            user: {},
            commonFriends: []
        };
    }

    getData(currUser,user){
        Promise.join(getUserData(currUser), getUserData(user),(currUserData, userData)=>{
            let userFriendsList = userData.data.friends.map((friend)=>{return friend._id;});
            let currentUserFriendsList = currUserData.data.friends.map((friend)=>{return friend._id;});
            let commonFriends = userFriendsList.filter((friend)=>{return currentUserFriendsList.indexOf(friend)!==-1});
            this.setState({
                currUser: currUserData.data,
                user: userData.data,
                commonFriends: commonFriends
            });
        });
    }

    componentDidMount(){
        this.getData(this.props.currUser, this.props.user);
    }

    componentWillReceiveProps(newProps){
        this.getData(newProps.currUser, newProps.user);
    }

    render(){
        return(
            <div style={{marginTop:'70px'}}>
                <Navbar user={this.state.currUser}/>
                <div className="container profile">
                    <div className="row">
                        <div className="col-md-4">
                            <ProfilePersonalInfo user={this.state.user} currentUser={this.props.currUser} commonFriends={this.state.commonFriends}/>
                        </div>
                        <div className="col-md-7 col-md-offset-1">
                            <Tabs inkBarStyle={{backgroundColor:"white",height:'3px'}}>
                                <Tab label="Activities" style={{backgroundColor:'#61B4E4',height:60}}>
                                    <ProfileRecentActivityFeed user={this.props.user} currentUser={this.props.currUser}/>
                                </Tab>

                                <Tab label="Posts" style={{backgroundColor:'#61B4E4',height:60}}>
                                    <ProfileRecentPostFeed user={this.props.user} currentUser={this.props.currUser}/>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
