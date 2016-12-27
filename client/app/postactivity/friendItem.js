import React from 'react';
import {Link} from 'react-router';
import {hideElement} from '../util';

export default class FriendItem extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      invited: "",
      reseted: false
    }
  }

  handleSubmit(e){
        this.setState({
          invited:"disabled",
          reseted:false
        });
        this.props.onPost(this.props.data._id);
    }


    componentDidUpdate(){
      if(this.props.reset===true && this.state.reseted===false){
        this.setState({
            invited:"",
            reseted:true
        })
      }
    }



  render(){
    return(
      <li className="media postactivity-media" style={{
          "paddingLeft":'10',
        }}>
        <div className="media-left">
          <Link to="profile.html">
            <img className="media-object" src={this.props.data.avatar} width="55px" alt="..." />
          </Link>
        </div>
        <div className="media-body media-top">
        <h5>  {this.props.data.fullname}</h5>
        <h5 style={{color:'grey'}}>    {this.props.data.description}</h5>
      </div>
      <div className="media-body media-right" align="right" style={{"paddingRight":'20',width: 0}}>
  <i className={"fa fa-check pull-right "+hideElement(this.state.invited!=="disabled")} style={{color:'green','paddingRight':'20px','marginTop':'10',fontSize: 23}} aria-hidden="true"></i>
        <button type="button" className={"btn btn-default btn-blue-grey pull-right " +hideElement(this.state.invited==="disabled")} style={{marginTop:10}} onClick={(e) => this.handleSubmit(e)} name="button">Invite</button>
      </div>
    </li>

    );
  }
}
