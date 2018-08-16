import React from 'React';
import {Navbar} from '../containers';
import {ActivityDetailBody} from '../containers';
import {getUserData} from '../../utils';

export default class ActivityDetail extends React.Component{

    constructor(props){
        super(props);
    }

    componentDidMount() {
        getUserData(this.props.userId)
        .then(response=>{
            this.setState(response.data);
        })
    }

    render(){
        if(this.state===null) return null;
        return(
            <div style={{marginTop:'70px'}}>
                <Navbar activity="active" user={this.state}/>
                <ActivityDetailBody id={this.props.id} avatar={this.state.avatar} 
                currentUser={this.state._id} friends={this.state.friends}/>
            </div>
        )
    }
}
