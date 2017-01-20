import React from 'React';
import {Link} from 'react-router';
import {hideElement} from '../util'
// var debug = require('react-debug');
import {ListItem} from 'material-ui/List'
import Avatar from 'material-ui/Avatar';
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
        return (
        <ListItem
          onClick={(e)=>this.handleClick(e)}
          leftAvatar={<Link to={"profile/"+this.props.data._id}><Avatar src={this.props.data.avatar} backgroundColor="white"/></Link>}
          primaryText={this.props.data.fullname}
          rightIcon={
                 <i className="fa fa-circle" aria-hidden="true" style={{
                    color:this.props.data.online? 'green':'grey', marginRight:'10px', marginTop:'10px'
                }}>
              </i>
          }
          secondaryText={
            <p>
              {this.props.lastmessage===undefined||
                Object.keys(this.props.lastmessage).length===0?"":
                (this.props.lastmessage.text.length>35?this.props.lastmessage.text.substring(0,35)+"...":this.props.lastmessage.text)}
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
        )
    }

}
