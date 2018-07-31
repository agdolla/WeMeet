import React from 'react';

import {Navbar} from '../containers';
import {ProfileMainFeed} from '../containers';
import {ProfilePersonalInfo} from '../containers';
import {ProfileRecentActivityFeed} from '../containers';
import {ProfileRecentPostFeed} from '../containers';

import {getUserData} from '../../utils';

export default class Profile extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            currUser: {},
            user: {}
        };
    }

    getData(currUser,user){
        getUserData(currUser)
        .then(response=>{
            let userData = response.data;
            this.setState({
                currUser: userData
            });
        })
        getUserData(user)
        .then(response=>{
            let userData = response.data;
            this.setState({
                user:userData
            });
        });
    }

    componentDidMount(){
        this.getData(this.props.currUser,this.props.user);
    }

    componentWillReceiveProps(newProps){
        this.getData(newProps.currUser,newProps.user);
    }

    render(){
        return(
            <div style={{marginTop:'70px'}}>
                <Navbar user={this.state.currUser}/>
                <div className="container profile">
                    <div className="row">
                        <div className="col-md-11 col-md-offset-1">
                            <div className="row">
                                <div className="col-md-7">
                                    <h4>
                                        <span className="glyphicon glyphicon-user" style={{marginRight:'10px'}}></span>
                                        Profile
                                    </h4>
                                </div>
                            </div>

                            <ProfileMainFeed user={this.state.user} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-7 col-md-offset-1">
                            <h4>Personal Info</h4>
                            <ProfilePersonalInfo user={this.state.user} />
                        </div>
                        <div className="col-md-4">
                            <h4 style={{marginBottom:0}}>Your posts</h4>
                            <div className="row sidebar">
                                <ProfileRecentActivityFeed user={this.props.user} currentUser={this.props.currUser}/>
                                <ProfileRecentPostFeed user={this.props.user} currentUser={this.props.currUser}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
