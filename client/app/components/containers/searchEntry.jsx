import React from 'react';
import { searchquery } from '../../utils';
import { ActivityFeedItem } from '../presentations';
import { PostFeedItem } from '../presentations';
import { socket } from '../../utils';
import Link from 'react-router-dom/Link';
//mui
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

// var debug = require('react-debug');

export default class SearchEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            searchDataResult: {},
            title: "",
            snackOpen: false,
            sentRequestFailed: false
        }
    }
    handleChange(e) {
        e.preventDefault();
        this.setState({ value: e.target.value });
    }

    handleKeyUp(e) {
        e.preventDefault();
        if (e.key === "Enter") {
            var query = this.state.value.trim();
            if (query !== "") {
                searchquery(query)
                    .then(response => {
                        let searchData = response.data;
                        this.setState({
                            searchDataResult: searchData,
                            title: "Search result for " + query + ": "
                        });
                    });
            }
        }
    }

    checkFriendsOfUser(friendId) {
        return this.props.user._id === friendId || this.props.user.friends.filter((friend) => {
            return friend._id === friendId
        }).length > 0;
    }

    handleAddFriend(friendId) {
        socket.emit('friend notification', {
            sender: this.props.user._id,
            target: friendId
        });
    }

    handleRequestClose = () => {
        this.setState({
            snackOpen: false,
        });
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
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div className="media">
                            <div className="media-body">
                                <FormControl style={{ width: '100%', marginBottom: '10px', paddingTop: '8px' }}>
                                    <InputLabel
                                        style={{ color: '#607D8B' }}
                                        htmlFor="search">
                                        Search...
                                    </InputLabel>
                                    <Input
                                        style={{ paddingBottom: '5px' }}
                                        id="search"
                                        value={this.state.value}
                                        onChange={(e) => this.handleChange(e)}
                                        onKeyUp={(e) => this.handleKeyUp(e)}
                                        type="search"
                                    />
                                </FormControl>
                            </div>
                        </div>
                    </div>
                </div>
                <h4 style={{ marginBottom: '10px' }}>{this.state.title}</h4>
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
                <List style={{
                    backgroundColor: '#ffffff',
                    padding: 0, boxShadow: '0 10px 28px 0 rgba(137,157,197,.12)',
                    marginBottom: '30px'
                }}>
                    {this.state.searchDataResult.users === undefined ? [] : this.state.searchDataResult.users.map((user, i) => {
                        var rightButton;
                        if (this.checkFriendsOfUser(user._id)) {
                            rightButton = <IconButton disabled>
                                <Icon className="fas fa-check" />
                            </IconButton>
                        }
                        else {
                            rightButton = <IconButton onClick={() => this.handleAddFriend(user._id)}>
                                <Icon className="fas fa-plus" />
                            </IconButton>
                        }
                        return <ListItem key={i} style={{ padding: '20px' }}>
                            <Link to={'/profile/' + user._id}>
                                <Avatar src={user.avatar} />
                            </Link>
                            <ListItemText primary={user.fullname}
                                secondary={user.description} />
                            <ListItemSecondaryAction>
                                {rightButton}
                            </ListItemSecondaryAction>
                        </ListItem>
                    })}
                </List>

                {
                    this.state.searchDataResult.activities === undefined ? [] : this.state.searchDataResult.activities.map((activity, i) => {
                        return (
                            <ActivityFeedItem key={i} data={activity} />
                        )
                    })
                }
                {
                    this.state.searchDataResult.posts === undefined ? [] : this.state.searchDataResult.posts.map((post, i) => {
                        return (
                            <PostFeedItem key={i} data={post} currentUser={this.props.user._id} />
                        )
                    })
                }
            </div>
        );
    }
}
