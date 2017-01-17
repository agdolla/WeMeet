import React from 'react';
import ActivityFeed from './activityFeed';
import Navbar from '../component/navbar';
import {getlocation,setlocation} from '../server';
import {Link} from 'react-router';

export default class Activity extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div style={{marginTop:'70'}}>
        <Navbar activity="active" user={this.props.user}/>
        <div className="container index">
          <Link to="postactivity" className="btn btn-lg btn-blue-grey c-btn" name = "button">
            <span className="glyphicon glyphicon-plus"></span>
          </Link>
          <div className="row">
            <div className="col-md-7 col-md-offset-2">
              <h4><span className="glyphicon glyphicon-flash" style={{'marginBottom':'10'}}></span>Recently Activities</h4>
              <ActivityFeed socket={this.props.socket}/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount(){
    getlocation((res)=>{
        setlocation(this.props.user._id,res.results[0]);
    });

  }
}
