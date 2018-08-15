import React from 'React';
import {Link} from 'react-router-dom';
import {hideElement} from '../../utils'
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';


export default class ChatNavChatItem extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            online:false
        }
    }

    handleClick(e){
        e.preventDefault();
        this.props.switchUser(this.props.data);
    }


    render() {
        var icon = this.props.data.online?
        <Icon className="fas fa-circle" style={{color:'green',fontSize:'20px'}}/>:
        <Icon className="far fa-circle" style={{fontSize:'20px'}}/>

        return (
            <div>
                <ListItem button onClick={(e)=>this.handleClick(e)}
                    style={{
                    alignItems: "flex-start"
                    }}>
                    <Link to={"/profile/"+this.props.data._id}>
                        <ListItemAvatar
                        style={{
                            marginTop: "20px"
                        }}>
                                <Avatar src={this.props.data.avatar}/>
                        </ListItemAvatar>
                    </Link>
                    <ListItemText
                    primary={this.props.data.fullname}
                    secondary={
                        <span>
                            {this.props.lastmessage===undefined||Object.keys(this.props.lastmessage).length===0?"":
                            (this.props.lastmessage.text.length < 60 ? this.props.lastmessage.text : 
                                (this.props.lastmessage.text.substring(0,60)+'...'))}
                            
                            <span className={"label label-danger "+
                            hideElement(this.props.lastmessage===undefined||
                            Object.keys(this.props.lastmessage).length===0||
                            this.props.lastmessage.isread ||
                            this.props.lastmessage.sender===this.props.currentUser)}
                            style={{marginLeft:5}}>New</span>
                        </span>
                    }
                    />
                    <ListItemSecondaryAction style={{marginRight:'10px'}}>
                        {icon}
                    </ListItemSecondaryAction>
                </ListItem>
                <Divider inset/>
            </div>
        )
    }

}
