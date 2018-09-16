import React from 'react';
import Link from 'react-router-dom/Link';
import { socket } from '../../utils/credentials';
// material ui
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';

var moment = require('moment');
// let debug = require('react-debug');

export default class ProfilePersonalInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            snackOpen: false,
            collapseOpen: false,
            sentRequestFailed: false
        }
    }

    isCommon(id) {
        return this.props.commonFriends.indexOf(id) !== -1 || id === this.props.currentUser;
    }

    handleAddFriend(targetId) {
        socket.emit('friend notification', {
            sender: this.props.currentUser,
            target: targetId
        });
    }

    handleRequestClose = () => {
        this.setState({
            snackOpen: false,
        });
    };

    handleClick = () => {
        this.setState(state => ({ collapseOpen: !state.collapseOpen }));
    };

    componentDidMount = () => {
        socket.on('friend notification', this.handleFriendNotification);
    }

    componentWillUnmount = () => {
        socket.removeListener('friend notification', this.handleFriendNotification);
    }

    handleFriendNotification = (err) => {
        this.setState({
            snackOpen: true,
            sentRequestFailed: err.error
        })
    }

    render() {
        return (
            <div>
                <Snackbar
                    autoHideDuration={4000}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    open={this.state.snackOpen}
                    onClose={this.handleRequestClose}>
                    <SnackbarContent
                        style={{
                            backgroundColor: [this.state.sentRequestFailed ? '#f44336' : '#4CAF50']
                        }}
                        message={
                            <span style={{
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {this.state.sentRequestFailed ?
                                    <ErrorIcon style={{ fontSize: '20px', marginRight: '10px' }} /> :
                                    <CheckCircleIcon style={{ fontSize: '20px', marginRight: '10px' }} />
                                }
                                {this.state.sentRequestFailed ? 'failed to send request!' : 'request sent!'}
                            </span>
                        }
                    />
                </Snackbar>
                <List style={{ backgroundColor: '#ffffff', padding: 0, boxShadow: '0 10px 28px 0 rgba(137,157,197,.12)' }}
                    subheader={<ListSubheader style={{ fontSize: '20px' }}>Profile</ListSubheader>}>
                    <ListItem>
                        <Avatar src={this.props.user.avatar} />
                        <ListItemText primary={this.props.user.fullname} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Icon style={{ width: '30px', textAlign: 'center' }} className="fas fa-info-circle" />
                        </ListItemIcon>
                        <ListItemText primary={this.props.user.description} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Icon style={{ width: '30px', textAlign: 'center' }} className="fas fa-birthday-cake" />
                        </ListItemIcon>
                        <ListItemText primary={moment(this.props.user.birthday).calendar()} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Icon style={{ width: '30px', textAlign: 'center' }} className="fas fa-envelope" />
                        </ListItemIcon>
                        <ListItemText primary={this.props.user.email} />
                    </ListItem>
                    <ListItem button onClick={this.handleClick}>
                        <ListItemIcon>
                            <Icon style={{ width: '30px', textAlign: 'center' }} className="fas fa-users" />
                        </ListItemIcon>
                        <ListItemText primary="Connections" />
                        {this.state.collapseOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={this.state.collapseOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {(this.props.user.friends === undefined ? [] : this.props.user.friends).map((friend, i) => {
                                var rightButton;
                                if (this.isCommon(friend._id)) {
                                    rightButton = <IconButton disabled={true}>
                                        <Icon className="fas fa-check" />
                                    </IconButton>
                                }
                                else {
                                    rightButton = <IconButton onClick={() => this.handleAddFriend(friend._id)}>
                                        <Icon className="fas fa-plus" />
                                    </IconButton>
                                }
                                return <ListItem key={i}>
                                    <Link to={'/profile/' + friend._id}>
                                        <Avatar src={friend.avatar} />
                                    </Link>
                                    <ListItemText primary={friend.fullname}
                                        secondary={friend.description} />
                                    <ListItemSecondaryAction>
                                        {rightButton}
                                    </ListItemSecondaryAction>
                                </ListItem>
                            })}
                        </List>
                    </Collapse>
                </List>
            </div>
        );
    }
}
