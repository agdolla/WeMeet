import React from 'react';
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import {Link} from 'react-router-dom';
import IconButton from 'material-ui/IconButton';
import {addFriend} from '../../utils';
import Snackbar from 'material-ui/Snackbar';

var moment = require('moment');

export default class ProfilePersonalInfo extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            open: false
        }
    }

    isCommon(id) {
        return this.props.commonFriends.indexOf(id) !== -1 || id === this.props.currentUser;
    }

    handleAddFriend(targetId) {
        addFriend(this.props.currentUser, targetId);
        this.setState({
            open: true
        });
    }

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    render(){
        return(
            <div>
                <Snackbar
                    bodyStyle = {{
                        backgroundColor:"#2E7D32",
                        textAlign:'center'
                    }}
                    open={this.state.open}
                    message="Friend request sent!"
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                />
                <List style={{backgroundColor: '#ffffff',padding:0, boxShadow:'0 10px 28px 0 rgba(137,157,197,.12)'}}>
                    <Subheader style={{fontSize: '20px'}}>Profile</Subheader>
                    <ListItem primaryText={this.props.user.fullname} 
                        leftAvatar={<Avatar src={this.props.user.avatar} 
                        backgroundColor="none"/>} disabled={true}/>
                    <ListItem primaryText={this.props.user.description} 
                        leftIcon={<FontIcon className="material-icons">info</FontIcon>} 
                        disabled={true}/>
                    <ListItem primaryText={moment(this.props.user.birthday).calendar()} 
                        leftIcon={<FontIcon className="material-icons">cake</FontIcon>} 
                        disabled={true}/>
                    <ListItem primaryText={this.props.user.email} 
                        leftIcon={<FontIcon className="material-icons">mail</FontIcon>} 
                        disabled={true}/>
                    <ListItem primaryText="Connections"
                        leftIcon={<FontIcon className="material-icons">contacts</FontIcon>}
                        initiallyOpen={false}
                        primaryTogglesNestedList={true}
                        nestedItems={(this.props.user.friends===undefined? []:this.props.user.friends).map((friend,i)=>{
                            var rightButton;
                            if(this.isCommon(friend._id)) {
                                rightButton =  <IconButton disabled={true}>
                                                <FontIcon className="material-icons">check</FontIcon> 
                                            </IconButton>
                            }
                            else {
                                rightButton =  <IconButton onClick={()=>this.handleAddFriend(friend._id)}>
                                                <FontIcon className="material-icons">add</FontIcon> 
                                            </IconButton>
                            }
                            return <ListItem primaryText={friend.fullname}
                                secondaryText={friend.description}
                                key={i}
                                leftAvatar={
                                    <Link to={'/profile/'+friend._id}>
                                        <Avatar src={friend.avatar} backgroundColor="none" />
                                    </Link>
                                }
                                rightIconButton={rightButton}
                                disabled={true}
                            /> 
                        })}/>
                </List>
            </div>
        );
    }
}
