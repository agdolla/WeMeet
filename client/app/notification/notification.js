import React from 'react';
// import NavTab from './navTabs';
import NotificationBody from './notificationBody';
import Navbar from '../component/navbar';
// import {getUserData} from '../server';

export default class Notification extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return(
      <div style={{marginTop:'70px'}}>
        <Navbar user={this.props.user} notification="active"/>
        <div className="container">
          <div className="row notification">
            <div className="
            col-md-8 col-md-offset-2
            col-sm-10 col-sm-offset-1
            col-xs-12
            ">
              <h4><span><i className="fa fa-bell-o bell" aria-hidden="true" style={{marginRight:'10px'}}></i></span>Notifications</h4>
              <NotificationBody id={this.props.id} user={this.props.user._id}/>
            </div>
          </div>
        </div>
    </div>
    );
  }
}
