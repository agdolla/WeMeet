import React from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

// let debug = require('react-debug');

export default class LandingBackground extends React.Component {

    render() {
        var btn_style = {
            margin: '10px',
            outline: '0px'
        }
        return (
            <div className="bg">
                <div className="text-vertical-center">
                    <h1 style={{ color: 'white' }}><span><img src="../img/logo/mipmap-xxxhdpi/ic_launcher.png" width="70px" /></span> WeMeet</h1>
                    <h2 style={{ color: 'white' }}>Join nearby activities and make friends!</h2>
                    <br />
                    <Button variant="contained" color="primary" style={btn_style} onClick={this.props.handleOpen("signUpOpen")}>
                        Sign up
                </Button>
                    <Button variant="contained" color="secondary" style={btn_style} onClick={this.props.handleOpen("loginOpen")}>
                        Log in
                </Button>
                    <Button variant="contained" color="default" style={{
                        fontSize: '14px',
                        margin: '10px',
                        outline: '0px',
                        color: 'white',
                        backgroundColor: '#3b5998'
                    }} href="/auth/facebook">
                        <Icon className="fab fa-facebook-f" />
                        Facebook
                </Button>
                </div>
            </div>
        )
    }


}
