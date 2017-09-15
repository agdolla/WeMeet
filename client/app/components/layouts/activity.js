import React from 'react';
import {Link} from 'react-router';

//import container
import { ActivityFeed } from '../containers';
import { Navbar } from '../containers';
//import request function
import {getlocation,setlocation} from '../../utils';


import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

export default class Activity extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div style={{marginTop:'70px'}}>
        <Navbar activity="active" user={this.props.user}/>
        <div className="container index">
          <Link to="postactivity" className="c-btn" name = "button">
            <FloatingActionButton backgroundColor='#607D8B'>
              <ContentAdd />
            </FloatingActionButton>
          </Link>
          <div className="row">
            <div className="
            col-md-7 col-md-offset-2
            col-sm-8 col-sm-offset-2
            col-xs-12
            ">
              <h4><span className="glyphicon glyphicon-flash" style={{'marginBottom':'10px',marginRight:'10px'}}></span> Recently Activities</h4>
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
