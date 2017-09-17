import React from 'react';
import {Link} from 'react-router';
var moment = require('moment');
// var debug = require('react-debug');
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

export default class ActivityFeedItem extends React.Component{

    constructor(props){
        super(props);
        this.state = props.data;
    }

    render(){
        var startTime = moment(this.state.startTime).calendar();
        var endTime = moment(this.state.endTime).calendar();
        return(
            <Card style={{marginBottom:'30px',boxShadow:'0 10px 28px 0 rgba(137, 157, 197, .12)'}}>
                <CardHeader
                title={this.state.author.fullname}
                subtitle={this.state.author.description}
                avatar={<Link to={"/profile/"+this.state.author._id}><Avatar src={this.state.author.avatar} backgroundColor="white"/></Link>}
                />
                <Link to={"activity_detail/"+this.state._id}>
                    <CardMedia
                        overlay={<CardTitle title="Location" subtitle={this.state.location}/>}
                        >
                        <img src={this.state.img} />
                    </CardMedia>
                </Link>
                <div className="row">
                    <div className="col-md-10">
                        <CardTitle title={this.state.title} subtitle={startTime+"--"+endTime} style={{width:'90%'}}/>
                    </div>
                    <div className="col-md-2">
                        <div className='pull-right'>
                            <Chip style={{marginTop:'30px',marginRight:'10px'}} backgroundColor="#607D8B"labelColor="white">{this.state.type}</Chip>
                        </div>
                    </div>
                </div>
                <CardText>
                    {this.state.description}
                </CardText>
                <CardActions>
                </CardActions>
            </Card>
        );
    }
}
