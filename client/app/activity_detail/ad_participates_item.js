import React from 'React';
import {hashHistory} from 'react-router';
import {addFriend} from '../server';
import {hideElement} from '../util';
import {socket,getToken} from '../credentials';

export default class Ad_participates_item extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      data: props.data,
      success:false
    }
  }

  handleRedirect(e){
    e.preventDefault();
    hashHistory.push("profile/"+this.state._id);
  }

  checkFriendsOfUser(){
    if(this.props.friends===undefined){
      return false;
    }
    return this.props.friends.filter((friend)=>{
      if(friend._id===this.state.data._id)
        return true;
      else return false;
    }).length>0;
  }

  handleAddFriend(e){
    e.preventDefault();
    addFriend(this.props.currUser,this.props.data._id,(success)=>{
      if(success){
        this.setState({
          success:true
        });

        socket.emit('notification',{
          authorization:getToken(),
          sender: this.props.currUser,
          target: this.state.data._id
        });
      }
    });
  }

    render(){
      return(
        <li className="media">
        <div className={"alert alert-success "+hideElement(!this.state.success)} role="alert">Request sent!</div>
          <div className="media-left">
            <a onClick={(e)=>this.handleRedirect(e)} data-dismiss="modal" aria-label="Close">
              <img className="media-object" src={this.state.data.avatar} height="55px" alt="..."/>
            </a>
          </div>
          <div className="media-body media-top">
            {this.state.data.fullname}<br/>
            {this.state.data.ps}
        </div>
        <div className="media-body media-right" style={{textAlign:"right"}} >
          <a href="#" onClick={(e)=>this.handleAddFriend(e)}><i className={"fa fa-user-plus pull-right "+hideElement(this.checkFriendsOfUser()||this.state.data._id===this.props.currUser)} style={{'paddingRight':'20px'}} aria-hidden="true"></i></a>
          <i className={"fa fa-check pull-right "+hideElement(!this.checkFriendsOfUser())} style={{color:'green','paddingRight':'20px',textAlign:"right"}} aria-hidden="true"></i>
        </div>
      </li>
      )
    }
}
