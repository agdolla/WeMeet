import React from 'react';
import {Navbar} from '../containers';
import {SettingProfileInfo, SettingSystemInfo} from '../containers'
import {getUserData} from '../../utils';

// var debug = require('react-debug');

export default class Settings extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userData: {}
        }
    }

    getData(){
        getUserData(this.props.user,(userData)=>{
            this.setState({
                userData: userData
            });
        });
    }

    componentWillMount(){
        this.getData();
    }

    render(){
        return(
            <div style={{marginTop:'70px'}}>
                <Navbar user={this.state.userData}/>
                <div className="container settings">
                    <div className="row">
                        <SettingProfileInfo userData={this.state.userData}/>
                        <SettingSystemInfo userData={this.state.userData}/>
                    </div>
                </div>
            </div>
        );
    }
}
