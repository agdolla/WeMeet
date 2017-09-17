import React from 'react';
var moment = require('moment');
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon'

export default class ProfilePersonalInfo extends React.Component{

    constructor(props){
        super(props);
        this.state = props.user;
    }

    componentWillReceiveProps(newProps){
        this.setState(newProps.user);
    }

    countProgress(){
        var count = 0.0;
        if (this.state.fullname != null){
            count += 1;
        }
        if (this.state.nickname != null){
            count += 1;
        }
        if (this.state.description != null){
            count += 1;
        }
        if (Object.keys(this.state.location === undefined || this.state.location === null ? {} : this.state.location).length){
            count += 1;
        }
        if (this.state.birthday != null){
            count += 1;
        }
        return count / 5 * 100 | 0;
    }

    render(){
        var progress = this.countProgress();

        return(
            <div>
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div className="media">
                            You have completed {progress}% of profile.
                            <br />
                            <progress value={progress} max="100"></progress>
                        </div>
                    </div>
                </div>
                <List style={{backgroundColor: '#ffffff',padding:0, boxShadow:'0 10px 28px 0 rgba(137,157,197,.12)'}}>

                    <ListItem primaryText={moment(this.state.birthday).calendar()} leftIcon={<FontIcon className="material-icons">cake</FontIcon>} />
                    <ListItem primaryText={this.state.email} leftIcon={<FontIcon className="material-icons">mail</FontIcon>} />

                </List>
            </div>
        );
    }
}
