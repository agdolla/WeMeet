import React from 'React';
import { ChatNavChatItem } from '../presentations';
import List from '@material-ui/core/List';

// let debug = require('react-debug');

export default class ChatNavBody extends React.Component {

    constructor(props) {
        super(props);
        this.state = props;
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
            this.setState(this.props);
        }
    }


    getMessageData(friendId) {
        let sessions = this.props.sessions;
        let filterResult = Object.keys(sessions).filter((sessionId) => {
            return sessions[sessionId].users.indexOf(friendId) !== -1;
        })

        if (filterResult.length === 0) {
            return {
                lastmessage: '',
                unread: {}
            };
        }
        else {
            return {
                lastmessage: sessions[filterResult[0]].lastmessage,
                unread: sessions[filterResult[0]].unread
            }
        }
    }

    render() {
        var alert =
            (<div className="alert alert-info" role="alert">
                You don't have any friends yet.
            </div>);

        return (
            <List style={{ backgroundColor: '#FDFDFD', height: '100%', overflowY: 'auto', width: '300px' }}>
                {
                    this.state.userData !== undefined &&
                    (this.state.userData.friends === undefined || this.state.userData.friends.length === 0 ? alert :
                        this.state.userData.friends.map((friend) => {
                            return <ChatNavChatItem
                                key={friend._id}
                                data={friend}
                                activeFriend={this.props.activeFriend}
                                currentUser={this.state.userData._id}
                                switchUser={this.props.switchUser}
                                messageData={this.getMessageData(friend._id)} />
                        }))
                }
            </List>
        )
    }

}
