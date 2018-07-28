import React from 'react';
import { withRouter } from "react-router-dom";
// var debug = require('react-debug');

//credentials function
import {isUserLoggedIn} from '../../utils';

import {LandingBackground} from '../containers';
import {LandingSignup,LandingSignin} from '../containers'


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
            </div>
        );
      }
}

export default withRouter(Landing);
