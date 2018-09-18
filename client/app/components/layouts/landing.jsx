import React from 'react';
import { withRouter } from "react-router-dom";
import { isUserLoggedIn } from '../../utils';
import { LandingBackground } from '../containers';
import { LandingSignup, LandingSignin } from '../containers'

// var debug = require('react-debug');


class Landing extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            signUpOpen: false,
            loginOpen: false
        }
    }

    componentDidMount() {
        if (isUserLoggedIn()) {
            this.props.history.push('/activity');
        }
    }

    handleOpen = value => () => {
        this.setState({
            [value]: true
        });
    }

    handleClose = value => () => {
        this.setState({
            [value]: false
        });
    }

    render() {
        return (
            <div>
                <LandingBackground handleOpen={this.handleOpen} />
                <LandingSignin open={this.state.loginOpen} handleClose={this.handleClose} />
                <LandingSignup open={this.state.signUpOpen} handleClose={this.handleClose} />
                <div className="row footer">
                    <div className="col-md-8 col-md-offset-2">
                        <h3 style={{ color: 'white' }}><span><img src="../img/logo/mipmap-xxxhdpi/ic_launcher.png" width="50px" /></span></h3>
                        <h5>Copyright (c) 2016-2018 Copyright WeMeet. All Rights Reserved.</h5>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Landing);
