import React from 'react';
import PostFeed from './postFeed';
import Navbar from '../component/navbar';

export default class Post extends React.Component{
  render(){
    return(
      <div style={{marginTop:'70'}}>
        <Navbar post="active" user={this.props.user}/>
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2 main-feed">
              <PostFeed user={this.props.user} socket={this.props.socket}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
