import React from 'react';
import {Navbar} from '../containers';
import {CreateActivityFeed} from '../containers';
// let debug = require('react-debug');

export default class CreateActivity extends React.Component {
    render() {
        return (
            <div className='createActivity' style={{marginTop:'70px'}}>
                <Navbar user={this.props.user}/>
                <CreateActivityFeed user={this.props.user} />
            </div>
        )
    }
}
