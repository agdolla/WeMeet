import React from 'react';
import Link from 'react-router-dom/Link';
import Icon from '@material-ui/core/Icon';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';

// let debug = require('react-debug');


Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

export default class NotificationBody extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            value: 0
        }
    }

    handleChange = (event, value) => {
        this.setState({ value: value });
    };

    render(){
        var frbadge =
        this.props.FR.length===0? <Icon className="fas fa-user-plus" style={{width:'30px'}}/>:
        <Badge badgeContent={this.props.FR.length} color="secondary">
            <Icon className="fas fa-user-plus" style={{width:'30px'}}/>
        </Badge>;

        var anbadge =
        this.props.AN.length===0? <Icon className="fas fa-bell"/>:
        <Badge badgeContent={this.props.AN.length} color="secondary">
            <Icon className="fas fa-bell"/>
        </Badge>;

        let friendRequestContent = 
        <List style={{backgroundColor: '#ffffff',padding:0, boxShadow:'0 10px 28px 0 rgba(137,157,197,.12)'}}>
            {this.props.FR.length===0?"Nothing here":this.props.FR.map((fr,i)=>{
                return <div key={i}>
                    <ListItem style={{padding:'20px'}}>
                            <Link to={"/profile/"+fr.sender._id}>
                                <ListItemAvatar>
                                    <Avatar src={fr.sender.avatar}/>
                                </ListItemAvatar>
                            </Link>
                            <ListItemText primary={fr.sender.fullname}
                            secondary="sent you a friend request"/>
                        <ListItemSecondaryAction>
                            <IconButton onClick={()=>this.props.handleFriendAccept(fr._id, fr.sender._id)}>
                                <Icon className='fas fa-check' style={{color:'#43A047'}}/>
                            </IconButton>
                            <IconButton onClick={()=>this.props.handleDelete(fr._id)}>
                                <Icon className='fas fa-trash' style={{color:'#e53935'}}/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider inset/>
                </div>
            })}
        </List>
        let activityRequestContent = 
        <List style={{backgroundColor: '#ffffff',padding:0, boxShadow:'0 10px 28px 0 rgba(137,157,197,.12)'}}>
        {this.props.AN.length===0?"Nothing here":this.props.AN.map((AN,i)=>{
            var text = "";
            if (AN.RequestOrInvite === "request"){
                text = "sent you a request to join activity"
            }
            else{
                text = "invited you to join activity"
            }
            return <div key={i}>
                    <ListItem style={{padding:'20px'}}>
                            <Link to={"/profile/"+AN.sender._id}>
                                <ListItemAvatar>
                                    <Avatar src={AN.sender.avatar}/>
                                </ListItemAvatar>
                            </Link>
                        <ListItemText primary={AN.sender.fullname}
                        secondary={
                            <Link to={"/activityDetail/"+AN.activityid} target="_blank">
                                {text}
                            </Link>
                        }/>
                        <ListItemSecondaryAction>
                            <IconButton onClick={()=>this.props.handleActivityAccept(AN._id)}>
                                <Icon className='fas fa-check' style={{color:'#43A047'}}/>
                            </IconButton>
                            <IconButton onClick={()=>this.props.handleDelete(AN._id)}>
                                <Icon className='fas fa-trash' style={{color:'#e53935'}}/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider inset/>
                </div>
        })}
        </List>
        return(
            <div style={{marginTop: '30px'}}>
                <Tabs
                value={this.state.value}
                style={{backgroundColor:'white'}}
                indicatorColor="primary"
                textColor="primary"
                onChange={this.handleChange}
                fullWidth centered>
                    <Tab icon={frbadge}/>
                    <Tab icon={anbadge}/>
                </Tabs>
                {this.state.value === 0 && friendRequestContent}
                {this.state.value === 1 && activityRequestContent}
            </div>
        );

        }
    }
