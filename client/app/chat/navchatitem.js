import React from 'React';
import {Link} from 'react-router';
import {hideElement} from '../util'
// var debug = require('react-debug');
import {ListItem} from 'material-ui/List'
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
export default class NavChatItem extends React.Component {
    constructor(props) {
        super(props);
        this.state={
          online:false
        }
    }

    handleClick(e){
      e.preventDefault();
      this.props.switchUser(this.props.data._id);
    }


    render() {
      var icon = this.props.data.online? 
      <FontIcon className="material-icons" style={{color:'green'}}>radio_button_checked</FontIcon>:
      <FontIcon className="material-icons" >radio_button_unchecked</FontIcon>

        return (
        <div>
          <ListItem
            onClick={(e)=>this.handleClick(e)}
            leftAvatar={<Link to={"profile/"+this.props.data._id}><Avatar src={this.props.data.avatar} backgroundColor="white"/></Link>}
            primaryText={this.props.data.fullname}
            rightIcon={icon}
            secondaryText={
              <p>
                {this.props.lastmessage===undefined||Object.keys(this.props.lastmessage).length===0?"":this.props.lastmessage.text}
                <span className={"label label-danger "+
                  hideElement(this.props.lastmessage===undefined||
                    Object.keys(this.props.lastmessage).length===0||
                    this.props.lastmessage.isread ||
                    this.props.lastmessage.sender===this.props.currentUser)}
                style={{marginLeft:5}}>New</span>
              </p>
            }
            secondaryTextLines={2}
          />
          <Divider inset={true} />
        </div>
        )
    }

}
