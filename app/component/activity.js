import React from 'react';
import ActivityFeed from './ActivityFeed';

export default class Activity extends React.Component{
  render(){
    return(
      <div>
        <a href="postactivity.html" className="btn btn-lg btn-blue-grey c-btn" name = "button"><span className="glyphicon glyphicon-plus"></span></a>
          <div className="row">
            <div className="col-md-7 col-md-offset-2">
              <h4><span className="glyphicon glyphicon-flash" style={{'marginBottom':'10'}}></span>Recently Activities</h4>
              <ActivityFeed />
            </div>
          </div>
      </div>
    );
  }
}
