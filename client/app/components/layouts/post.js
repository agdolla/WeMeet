import React from 'react';
import {PostFeed} from '../containers';
import {Navbar} from '../containers';

export default class Post extends React.Component{
  render(){
    return(
      <div style={{marginTop:'70px'}}>
        <Navbar post="active" user={this.props.user}/>
        <div className="container">
          <div className="row">
            <div className="
            col-md-8 col-md-offset-2
            col-sm-10 col-sm-offset-1
            main-feed">
              <PostFeed user={this.props.user} socket={this.props.socket}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
