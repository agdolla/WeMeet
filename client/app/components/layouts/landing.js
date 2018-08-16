import React from 'react';
import { withRouter } from "react-router-dom";
import {isUserLoggedIn} from '../../utils';
import {LandingBackground} from '../containers';
import {LandingSignup,LandingSignin} from '../containers'

// var debug = require('react-debug');


class Landing extends React.Component {

    constructor(props){
        super(props);
    }


    componentDidMount(){
        if(isUserLoggedIn()){
            this.props.history.push('/activity');
        }
    }

    handleClick(e){
        e.preventDefault();
        window.scrollTo(0,document.body.scrollHeight);
    }


      render(){
        return(
            <div>
                <LandingBackground onclick={this.handleClick.bind(this)}/>
                <div className="container index LandingPage">
                    <div className="row">
                        <LandingSignin />
                        <LandingSignup />
                    </div>
                </div>
                <div className="row footer">
                    <div className="col-md-8 col-md-offset-2">
                        <h3 style={{color:'white'}}><span><img src="../img/logo/mipmap-xxxhdpi/ic_launcher.png" width="50px"/></span></h3>
                        <h5>Copyright (c) 2016-2018 Copyright WeMeet. All Rights Reserved.</h5>
                    </div>
                </div>
            </div>
        );
      }
}

export default withRouter(Landing);
