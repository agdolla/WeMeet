import React from 'react';
import {Link} from 'react-router-dom';
var moment = require('moment');

export default class PostComment extends React.Component{

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
                        <img className="media-object" src={this.props.data.author.avatar} height="45px" alt="..."></img>
                    </Link>
                </div>
                <div className="media-body">
                    <h5 className="media-heading">{this.props.data.author.fullname}
                        <span className="pull-right">{time}</span>
                    </h5>
                    <p style={{"marginTop": '10px'}}>
                        {this.props.data.text}
                    </p>
                </div>
                <hr />
            </div>
        );
    }
}
