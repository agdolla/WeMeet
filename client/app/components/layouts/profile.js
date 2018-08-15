import React from 'react';
import {Navbar} from '../containers';
import {ProfilePersonalInfo} from '../containers';
import {ProfileRecentActivityFeed} from '../containers';
import {ProfileRecentPostFeed} from '../containers';
import {getUserData} from '../../utils';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// let debug = require('react-debug');
let Promise = require('bluebird');

export default class Profile extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            currUser: {},
            user: {},
            commonFriends: [],
            value: 0
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

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.currentUser!==this.props.currentUser || 
            prevProps.user!==this.props.user){
                this.getData(this.props.currUser, this.props.user);
            }
    }
    

    handleChange = (event, value) => {
        this.setState({ value:value });
    };

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
                            <Tabs value={this.state.value}
                                onChange={this.handleChange}
                                style={{backgroundColor:'white'}}
                                indicatorColor="primary"
                                textColor="primary"
                                fullWidth centered>
                                <Tab label="Activities"/>
                                <Tab label="Posts"/>
                            </Tabs>
                            {this.state.value === 0 && <ProfileRecentActivityFeed user={this.props.user} currentUser={this.props.currUser}/>}
                            {this.state.value === 1 && <ProfileRecentPostFeed user={this.props.user} currentUser={this.props.currUser}/>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
