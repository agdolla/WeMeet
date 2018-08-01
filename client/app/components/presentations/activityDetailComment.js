import React from 'React';
import {Link} from 'react-router-dom';
var moment = require('moment');

export default class ActivityDetailComment extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        //default time format
        var time = moment(this.props.data.postDate).calendar();
        //if less than 24 hours, use relative time
        if((new Date().getTime()) - this.props.data.postDate <= 86400000)
        time = moment(this.props.data.postDate).fromNow();

        return(
            <div>
                <div className="media-left">
                    <Link to={"/profile/"+this.props.data.author._id}>
                        <img className="media-object" src={this.props.data.author.avatar} height="45px" style={{marginTop:'10px'}}/>
                    </Link>
                </div>
                <div className="media-body media-top">
                    <h5>{this.props.data.author.fullname}<small style={{marginLeft:"5px"}}>{time}</small></h5>
                    {this.props.data.text}
                </div>
            </div>
        );
    }
}
