import React from 'react';
import {Link} from 'react-router-dom';

//request function
import {getActivityDetail} from '../../utils';

export default class NotificationActivity extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            activityname:""
        }
    }

    handleAccept(e){
        e.preventDefault();
        this.props.onAccept(this.props.data._id);
    }

    handleDelete(e){
        e.preventDefault();
        this.props.onDelete(this.props.data._id);
    }

    getData(){
        getActivityDetail(this.props.data.activityid,(activitydata)=>{
            this.setState({activityname:activitydata.title},()=>{
            });
        });
    }

    componentDidMount(){
        this.getData();
    }

    render(){
        var text = "";
        if (this.props.data.RequestOrInvite === "request"){
            text = "sent you a request to join activity "
        }
        else{
            text = "invited you to join "
        }
        return(
            <div>
                <div className="row friend-request">
                    <div className="col-md-8">
                        <div className="media">
                            <div className="media-left">
                                <Link to={"/profile/"+this.props.data.sender._id}>
                                    <img className="media-object" src="img/user.png" width="50px" height="50px" alt="..." />
                                </Link>
                            </div>
                            <div className="media-body">
                                <h4 className="media-heading">{this.props.data.sender.fullname}</h4>
                                {text}

                                <Link to={"/activityDetail/"+this.props.data.activityid}>
                                    {this.state.activityname}
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 pull-right">
                        <button type="button" className="btn btn-sm btn-blue-grey" name="button" onClick={(e)=>this.handleAccept(e)}>Accept</button>
                        <button type="button" className="btn btn-sm btn-blue-grey pull-right" onClick={(e)=>this.handleDelete(e)} name="button">Delete</button>
                    </div>
                </div>
                <hr/>
            </div>
        );
    }
}
