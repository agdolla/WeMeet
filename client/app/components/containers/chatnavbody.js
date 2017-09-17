import React from 'React';



import {ChatNavChatItem} from '../presentations';



import {List} from 'material-ui/List'
import Subheader from 'material-ui/Subheader';

export default class ChatNavBody extends React.Component {

    constructor(props) {
        super(props);
        this.state = props;
    }

    componentWillReceiveProps(newProps){
        this.setState(newProps);
    }

    getLastmessage(friendId){
        var filterResult = this.state.sessions.filter((session) => {
            if(session.users.indexOf(friendId)!==-1){
                return true;
            }
            return false;
        });

        if(filterResult.length===0){
            return undefined;
        }
        else{
            return filterResult[0].lastmessage;
        }

    }

    render() {
        var alert =
            (<div className="alert alert-info" role="alert">
            You don't have any friends yet.
            </div>);

        return (
            <List style={{backgroundColor:'#FDFDFD',height:'100%',overflowY:'auto'}}>
            <Subheader style={{height:'50px',fontSize:'15px',textAlign:'center',paddingLeft:'0px'}}><strong>Friends</strong></Subheader>
            {
                this.state.userData === undefined ? null:
                (this.state.userData.friends===undefined || this.state.userData.friends.length===0 ? alert : this.state.userData.friends.map((friend)=>{
                    return <ChatNavChatItem
                    key={friend._id}
                    data={friend}
                    activeFriend = {this.props.activeFriend}
                    currentUser={this.state.userData._id}
                    switchUser={this.props.switchUser}
                    lastmessage={this.getLastmessage(friend._id)}/>
                }))
            }
            </List>
        )
    }

}
