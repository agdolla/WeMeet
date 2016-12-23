import React from 'react';
import SearchEntry from './searchEntry';
import Navbar from '../component/navbar';
import {getUserData} from '../server';


export default class Search extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }
  getData(){
    getUserData(this.props.user,(userData)=>{
        this.setState(userData);
    });
  }


  render(){
    return(
      <div className="search" style={{marginTop:'70'}}>
        <Navbar search="active" user={this.state}/>
        <div className="container">
          <div className="row">
            <div className="col-md-7 col-md-offset-2 main-feed">
              <SearchEntry user={this.state}/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount(){
    this.getData();
  }
}
