import React from 'react';
import {hashHistory} from 'react-router';
var debug = require('react-debug');

//credentials function
import {isUserLoggedIn} from '../../utils';

import {LandingBackground} from '../containers';
import {LandingSignup,LandingSignin} from '../containers'


export default class Landing extends React.Component {

    constructor(props){
        super(props);
    }


    componentDidMount(){
        if(isUserLoggedIn()){
            hashHistory.push("/activity");
        }
    }

    handleClick(e){
        e.preventDefault();
        var x = document.getElementsByTagName("body")[0];
        x.scrollTop=x.scrollHeight
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
