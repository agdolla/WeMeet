import React from 'React';
import {withRouter} from 'react-router-dom';

//request function
import {addFriend} from '../../utils';
//util function
import {hideElement} from '../../utils';
//credentials function
import {socket,getToken} from '../../utils';
// var debug = require('react-debug');


class Ad_participates_item extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            success:false
        }
    }

    handleRedirect(e){
        e.preventDefault();
        this.props.history.push("profile/"+this.props.data._id);
    }

    checkFriendsOfUser(){
        if(this.props.friends===undefined){
            return false;
        }
        return this.props.friends.filter((friend)=>{
            if(friend===this.props.data._id)
            return true;
            else return false;
        }).length>0;
    }

    handleAddFriend(e){
        e.preventDefault();
        addFriend(this.props.currUser,this.props.data._id,(success)=>{
            if(success){
                socket.emit('notification',{
                    authorization:getToken(),
                    sender: this.props.currUser,
                    target: this.props.data._id
                });
                this.setState({
                    success:true
                });
            }
        });
    }

    render(){
        return(
            <li className="media ad-media">
                <div className={"alert alert-success "+hideElement(!this.state.success)} role="alert">Request sent!</div>
                <div className="media-left">
                    <a onClick={(e)=>this.handleRedirect(e)} data-dismiss="modal" aria-label="Close">
                        <img className="media-object" src={this.props.data.avatar} height="55px" alt="..."/>
                    </a>
                </div>
                <div className="media-body media-top">
                    <h5>  {this.props.data.fullname}</h5>
                    <h5 style={{color:'grey'}}>    {this.props.data.description}</h5>
                </div>
                <div className="media-body media-right" style={{textAlign:"right",width:'0px'}} >
                    <a href="#" onClick={(e)=>this.handleAddFriend(e)}><i className={"fa fa-user-plus pull-right "+hideElement(this.checkFriendsOfUser()||this.props.data._id===this.props.currUser)} style={{'paddingRight':'20px'}} aria-hidden="true"></i></a>
                    <i className={"fa fa-check pull-right "+hideElement(!this.checkFriendsOfUser())} style={{color:'green','paddingRight':'20px','marginTop':'10px'}} aria-hidden="true"></i>
                </div>
            </li>
        )
    }
}

export default withRouter(Ad_participates_item);
