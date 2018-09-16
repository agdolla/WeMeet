import React from 'react';
import { Navbar } from '../containers';
import { SettingProfileInfo, SettingSystemInfo } from '../containers'

// var debug = require('react-debug');

export default class Settings extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{ marginTop: '70px' }}>
                <Navbar user={this.props.user} />
                <div className="container settings">
                    <div className="row">
                        <SettingProfileInfo userData={this.props.user} />
                        <SettingSystemInfo userData={this.props.user} />
                    </div>
                </div>
            </div>
        );
    }
}
