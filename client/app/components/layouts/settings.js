import React from 'react';

//import containers
import {Navbar} from '../containers';
import {SettingProfileInfo, SettingSystemInfo} from '../containers'
//request function
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
                userData:userData
            });
        });
    }
    componentDidMount(){
        this.getData();
    }

    render(){
        return(
            <div style={{marginTop:'70px'}}>
                <Navbar user={this.state.userData}/>
                <div className="container settings">
                    <div className="row">
                        <SettingProfileInfo user={this.props.user}/>
                        <SettingSystemInfo user={this.props.user}/>
                    </div>
                </div>
            </div>
        );
    }
}
