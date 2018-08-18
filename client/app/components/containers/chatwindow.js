import React from 'React';
import {Link} from 'react-router-dom';
import {ChatEntry} from '../presentations';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import CircularProgress from '@material-ui/core/CircularProgress';

let moment = require('moment');
// var debug = require('react-debug');

export default class ChatWindow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            targetUser: props.target,
            message: props.message,
            open: false,
            selectedImgs: [],
            currentIdx: 0,
            loading: true
        }
    }

    componentDidMount() {
        this.setState({
            targetUser:this.props.target,
            message:this.props.message
        },()=>{
            this.refs.chatwindow.scrollTop=this.refs.chatwindow.scrollHeight;
        });
    }

    handlePostMessage(text, imgs){
        this.setState({
            loading: true
        },()=>{
            this.refs.chatwindow.scrollTop=this.refs.chatwindow.scrollHeight;
            this.props.onPost(text, imgs);
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if((this.props.target._id!==prevProps.target._id
        || JSON.stringify({object: this.props.message})!==JSON.stringify({object: prevProps.message}))){
            this.setState({
                targetUser:this.props.target,
                message:this.props.message,
                loading: false
            },()=>{
                if(this.props.message.length <= 10)
                    this.refs.chatwindow.scrollTop=this.refs.chatwindow.scrollHeight;
            })
        }
    }

    handleClose = () => {
        this.setState({ open: false });
    };

    handleClickOpen(imgs, idx){
        this.setState({ open: true, selectedImgs: imgs, currentIdx: idx });
    }

    render() {
        return (
            <div className="col-md-7 col-md-offset-0 col-sm-10 col-sm-offset-1 col-xs-12 chat-right">
                <div className="panel panel-dafault chatwindow">
                    <div className="panel-heading">
                        <Tooltip title="Friends">
                            <IconButton className="pull-right friend-btn" onClick={()=>this.props.onExpand()}>
                                <Icon style={{width:'50px'}} className="fas fa-user-friends"/>
                            </IconButton>
                        </Tooltip>
                        <div className="media">
                            <div className="media-left">
                                <Link to={"/profile/"+this.state.targetUser._id}>
                                    <img className="media-object" src={this.state.targetUser.avatar } alt="image" height="45" width="45"></img>
                                </Link>
                            </div>
                            <div className="media-body">
                                <div className="row">
                                    <div className="col-md-10">
                                        <div className="media-heading">
                                            <div className="media">
                                                <div className="media-left media-body">
                                                    <font size="3">{this.state.targetUser.fullname}</font>
                                                </div>
                                            </div>
                                        </div>
                                        <font size="2" color="grey ">
                                            {this.state.targetUser.description}
                                        </font>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}>
                        <DialogContent>
                                <img style={{
                                    maxHeight: '100%',
                                    maxWidth: '100%'
                                }} src={this.state.selectedImgs[this.state.currentIdx]}/>
                        </DialogContent>
                        <DialogActions>
                            <IconButton onClick={()=>{
                                this.setState({
                                    currentIdx: (this.state.currentIdx+this.state.selectedImgs.length-1)%this.state.selectedImgs.length
                                })
                            }}>
                                <Icon className='fas fa-chevron-left' />
                            </IconButton>
                            <IconButton onClick={()=>{
                                this.setState({
                                    currentIdx: (this.state.currentIdx+1)%this.state.selectedImgs.length
                                })
                            }}>
                                <Icon className='fas fa-chevron-right' />
                            </IconButton>
                            <Button onClick={this.handleClose} color="primary">
                            Close
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <div className="panel-body" ref="chatwindow">
                        <Button onClick={(e)=>this.props.onLoad(e)} fullWidth
                        disabled={this.props.btnText === "nothing more to load"}>
                            {this.props.btnText}
                        </Button>

                        <List>
                            {this.state.message === undefined ? 0: this.state.message.map((msg,i)=>{
                                        //default time format
                                var time = moment(msg.date).calendar();
                                //if less than 24 hours, use relative time
                                if((new Date().getTime()) - 12 <= 86400000)
                                    time = moment(msg.date).fromNow();

                                return <ListItem key={i}
                                style={{
                                    alignItems: "flex-start",
                                    marginBottom:'10px'
                                }}>
                                    <ListItemAvatar>
                                        <Avatar src={msg.sender.avatar}/>
                                    </ListItemAvatar>
                                    <ListItemText
                                    primary={
                                        <span>
                                            <strong>{msg.sender.fullname}</strong>
                                            <span style={{fontSize:'12px', marginLeft:'15px'}}>{time}</span>
                                        </span>
                                    }
                                    secondary={
                                        <span>
                                            <GridList cellHeight={160} cols={3}>
                                                {msg.imgs.map((img, idx)=>{
                                                    return <GridListTile key={idx}>
                                                        <img src={img}/>
                                                        <GridListTileBar
                                                        actionIcon={
                                                            <IconButton onClick={()=>this.handleClickOpen(msg.imgs, idx)}>
                                                                <Icon style={{color:'white'}} className='fas fa-search-plus' />
                                                            </IconButton>
                                                        }
                                                        />
                                                    </GridListTile>
                                                })}
                                            </GridList>
                                            {msg.text}
                                        </span>
                                    }
                                    />
                                </ListItem>
                            })}
                            {
                                this.state.loading?
                                <ListItem>
                                    <CircularProgress size={30} style={{marginLeft:'8px',color:'#61B4E4'}}/>
                                </ListItem>:null
                            }
                        </List>
                    </div>
                    <ChatEntry onPost={(message, imgs)=>this.handlePostMessage(message,imgs)}/>
                </div>
            </div>
        )
    }
}
