import React from 'react';
import {NotificationFriendRequest} from '../presentations';
import {NotificationActivity} from '../presentations'
import {Tabs, Tab} from 'material-ui/Tabs';
import Icon from '@material-ui/core/Icon';
import Badge from 'material-ui/Badge';
// import IconButton from 'material-ui/IconButton';

// let debug = require('react-debug');


Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

export default class NotificationBody extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        var frbadge =
        <Badge badgeStyle={{backgroundColor:'#DB6666', visibility:this.props.FR.length===0?"hidden":'visible'}}
            badgeContent={this.props.FR.length}
            primary={true}
            >
            <Icon className="fas fa-user-plus" style={{color:'white', width:'30px'}}/>
        </Badge>;

        var anbadge =
        <Badge badgeStyle={{backgroundColor:'#DB6666', visibility:this.props.AN.length===0?"hidden":'visible'}}
            badgeContent={this.props.AN.length}
            primary={true}
            >
            <Icon className="fas fa-bell" style={{color:'white'}}/>
        </Badge>;
        return(
            <Tabs
                style={{boxShadow:  "0 10px 28px 0 rgba(137,157,197,.12)", marginTop:'20px'}}
                inkBarStyle={{backgroundColor:"white",height:'3px'}}
                contentContainerStyle={{backgroundColor:'#FDFDFD',padding:'10px'}}>

                <Tab icon={frbadge} style={{backgroundColor:'#61B4E4',height:60}}>
                    <div>
                        {this.props.FR.length===0?"Nothing here":this.props.FR.map((fr,i)=>{
                            return <NotificationFriendRequest key={i} data={fr} 
                            onDelete={(id)=>this.props.handleDelete(id)} 
                            onAccept={(id,user)=>this.props.handleFriendAccept(id,user)}/>
                        })}
                    </div>
                </Tab>
                <Tab  buttonStyle={{backgroundColor:'#61B4E4',height:60}} icon={anbadge}>
                    <div>
                        {this.props.AN.length===0?"Nothing here":this.props.AN.map((AN,i)=>{
                            return <NotificationActivity key={i} data={AN} 
                            onDelete={(id)=>this.props.handleDelete(id)} 
                            onAccept={(activityid,userid)=>this.props.handleActivityAccept(activityid,userid)}/>
                        })}
                    </div>
                </Tab>
            </Tabs>);

        }
    }
