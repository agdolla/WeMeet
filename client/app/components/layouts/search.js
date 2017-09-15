import React from 'react';
import SearchEntry from './searchEntry';
import Navbar from '../component/navbar';
// import {getUserData} from '../server';


export default class Search extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div className="search" style={{marginTop:'70px'}}>
        <Navbar search="active" user={this.props.user}/>
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2 main-feed">
              <SearchEntry user={this.props.user}/>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
