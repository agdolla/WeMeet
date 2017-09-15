import React from 'React';
import {Navbar} from '../containers';
import {Ad_body} from '../containers';
// import {getUserData} from '../server';

export default class Activity_detail extends React.Component{

  constructor(props){
    super(props);
  }
  render(){
    return(
      <div style={{marginTop:'70px'}}>
        <Navbar activity="active" user={this.props.user}/>
        <Ad_body id={this.props.id} avatar={this.props.user.avatar} currentUser={this.props.user._id} friends={this.props.user.friends}/>
      </div>
    )
  }
}
