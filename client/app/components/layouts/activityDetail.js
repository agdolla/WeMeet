import React from 'React';
import {Navbar} from '../containers';
import {ActivityDetailBody} from '../containers';
// import {getUserData} from '../server';

export default class ActivityDetail extends React.Component{

    constructor(props){
        super(props);
    }
    render(){
        return(
            <div style={{marginTop:'70px'}}>
                <Navbar activity="active" user={this.props.user}/>
                <ActivityDetailBody id={this.props.id} avatar={this.props.user.avatar} currentUser={this.props.user._id} friends={this.props.user.friends}/>
            </div>
        )
    }
}
