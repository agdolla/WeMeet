import React from 'react';
import {hideElement} from '../../utils';

export default class CreateActivityFriendItem extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            invited: "",
            reseted: false
        }
    }

    handleSubmit(e){
        e.preventDefault();
        this.setState({
            invited:"disabled",
            reseted:false
        });
        this.props.onInvite(this.props.data._id);
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
            <li className="media createActivity-media" style={{"paddingLeft":'10px'}}>
                <div className="media-left">
                    <img style={{marginRight:'20px'}} className="media-object" src={this.props.data.avatar} width="55px" alt="..." />
                </div>
                <div className="media-body media-top">
                    <h5>  {this.props.data.fullname}</h5>
                    <h5 style={{color:'grey'}}>    {this.props.data.description}</h5>
                </div>
                <div className="media-body media-right" style={{"paddingRight":'20px',width: '0px'}}>
                    <i className={"fa fa-check pull-right "+hideElement(this.state.invited!=="disabled")} style={{color:'green','paddingRight':'20px','marginTop':'10px',fontSize: '23px'}} aria-hidden="true"></i>
                    <button type="button" className={"btn btn-default btn-blue-grey pull-right " +hideElement(this.state.invited==="disabled")} style={{marginTop:'10px'}} onClick={(e) => this.handleSubmit(e)} name="button">Invite</button>
                </div>
            </li>
        );
    }
}
