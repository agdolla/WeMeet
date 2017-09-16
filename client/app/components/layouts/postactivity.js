import React from 'react';
import {hashHistory} from 'react-router';



import {Navbar} from '../containers';


import {getUserData,createActivity,sendInviteActivityRequest} from '../../utils';


import {PostActivityFriendItem} from '../containers';


import {hideElement} from '../../utils';
import {socket,getToken} from '../../utils';




import AvatarCropper from "react-avatar-cropper";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';
var debug = require('react-debug');
var swal = require('sweetalert');

export default class PostActivity extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      userData: {},
      type:1,
      title: "",
      img:null,
      cropperOpen:false,
      startTime: null,
      endTime: null,
      description: "",
      location: "",
      detail:"",
      alert:false,
      sizealert:false,
      fileWrongType:false,
      invitedlist:[],
      reset:false
    }
  }

  handleFile(e){
    e.preventDefault();
    // Read the first file that the user selected (if the user selected multiple
    // files, we ignore the others).
    var reader = new FileReader();
    var file = e.target.files[0];
    if(!file.type.match('image.*')){
      this.setState({fileWrongType:true});
    }
    else if(file.size<1100000){
      // Called once the browser finishes loading the image.
      reader.onload = (upload) => {
        this.setState({
          img: upload.target.result,
          cropperOpen:true
        });
      };
      reader.readAsDataURL(file);
      this.setState({sizealert:false});
      this.setState({fileWrongType:false});
    }
    else{
      this.setState({sizealert:true});
    }
  }

  handleFileClick(e){
    e.target.value = null;
  }

  handleInviteUser(e){
    var invitedUsers = this.state.invitedlist;
    invitedUsers.push(e);
    this.setState({
      invitedlist: invitedUsers,
      reset:false
    })
  }

  handleRequestHide(e){
    e.preventDefault();
    this.setState({
      cropperOpen: false,
      img:null
    })
  }

  handleCrop(dataURI) {
    this.setState({
      cropperOpen: false,
      img: dataURI
    });
  }

  getData(){
    getUserData(this.props.user,(userData)=>{
      this.setState({
        userData: userData
      })
    });
  }


  handleSubmit(e){
    e.preventDefault();
    if(this.state.type!=="------Select a Activity Type-----"&&
        this.state.title.trim()!=="" &&
        this.state.startTime!==null &&
        this.state.endTime!==null&&
        this.state.description.trim()!==""&&
        this.state.location.trim()!==""&&
        this.state.detail.trim()!==""
    ){
      //activity created succesfully
      var data = this.state;
      var type = "";
      switch (data.type) {
        case 1:
          type = "Event";
          break;
        case 2:
          type = "Entertainment";
          break;
        default:
          type = "Study";
          break;
      }
      data.type = type;
      createActivity(data,(data)=>{
        socket.emit('newActivity',{authorization:getToken(),user:this.props.user});
        this.state.invitedlist.map((targetid)=>{
          sendInviteActivityRequest(this.props.user,targetid,data._id,(success)=>{
            if(success){
              socket.emit('notification',{
                authorization:getToken(),
                sender: this.props.user,
                target: targetid
              });
            }
          });
        });
      });
      swal({
        title: "Go Check It Out!",
        type: "success",
        showCancelButton: false,
        confirmButtonColor: "#30E4A2",
        confirmButtonText: "Go",
        closeOnConfirm: true
      },
      function(){
        hashHistory.push('/activity');
      });
    }
    else{
      this.setState({alert:true})
    }
  }

  componentDidMount(){
    this.getData();
  }

  handlereset(e){
    e.preventDefault();
    this.setState({
      invitedlist: [],
      reset:true
    });
  }

  handleInvite(e){
    e.preventDefault();
    this.setState({
      reset:false
    })
  }

  handleTitle(e){
    e.preventDefault();
    this.setState({
      title: e.target.value
    })
  }

  handleStartDate(e,date){
    this.setState({
      startTime: date
    })
  }

  handleEndDate(e,date){
    this.setState({
      endTime: date
    })
  }

  handleLocation(e){
    e.preventDefault();
    this.setState({
      location: e.target.value
    })
  }
  handleDetail(e){
    e.preventDefault();
    this.setState({
      detail: e.target.value
    })
  }

  handleEvent(e,index,value){
    e.preventDefault();
    this.setState({
      type: value
    })
  }
  handleDescription(e){
    e.preventDefault();
    this.setState({
      description: e.target.value
    })
  }

  handleStartTime(e,date){
    var currentDate = this.state.startTime;
    currentDate.setHours(date.getHours(),date.getUTCMinutes());
    debug(currentDate);
    this.setState({
      startTime: currentDate
    })
  }

  handleEndTime(e,date){
    var currentDate = this.state.endTime;
    currentDate.setHours(date.getHours(),date.getUTCMinutes());
    debug(currentDate);
    this.setState({
      endTime: currentDate
    })
  }


  render() {
    return (
      <div className='postactivity' style={{marginTop:'70px'}}>
        {this.state.cropperOpen &&
          <AvatarCropper
            onRequestHide={(e)=>this.handleRequestHide(e)}
            cropperOpen={this.state.cropperOpen}
            onCrop={(e)=>this.handleCrop(e)}
            image={this.state.img}
            width={1200}
            height={500}
            />
        }
        <Navbar user={this.state.userData}/>
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
              <h4><span style={{
                  "marginRight":'10px'
                }}><i className="glyphicon glyphicon-list-alt" aria-hidden="true"></i></span>Create Activity</h4>
            </div>
          </div>
          <div className="row">
            <div className="
            col-md-8 col-md-offset-2
            col-sm-10 col-sm-offset-1
            infos">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <div className="row">
                    <div className="col-md-12">
                      <h4>Activity Info</h4>
                        <div className={hideElement(!this.state.alert)}>
                         <div className="alert alert-warning alert-dismissible" role="alert">
                                        <strong>Please fill in blanks</strong>
                                      </div>
                        </div>
                        <div className={hideElement(!this.state.sizealert)}>
                         <div className="alert alert-warning alert-dismissible" role="alert">
                                        <strong>File is too large</strong>
                                      </div>
                        </div>
                        <div className={"alert alert-warning alert-dismissible "+hideElement(!this.state.fileWrongType)} role="alert">
                          <strong>File is not a image file</strong>
                        </div>
                      <div className="row">
                        <div className="col-md-12">
                          <TextField
                            hintText="Title"
                            floatingLabelText="Title"
                            style={{width:'100%'}}
                            onChange={(e)=>this.handleTitle(e)}
                            floatingLabelStyle={{color:'#607D8B'}}
                            underlineFocusStyle={{borderColor:'#90A4AE'}}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <DatePicker hintText="Start Date" textFieldStyle={{width:'100%'}} onChange={(e,date)=>this.handleStartDate(e,date)}/>
                        </div>
                        <div className="col-md-6">
                          <div className="md-form">
                            <DatePicker hintText="End Date" textFieldStyle={{width:'100%'}} onChange={(e,date)=>this.handleEndDate(e,date)}/>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <TimePicker hintText="Start Time" textFieldStyle={{width:'100%'}} onChange={(e,date)=>this.handleStartTime(e,date)}/>
                        </div>
                        <div className="col-md-6">
                            <TimePicker hintText="End Time" textFieldStyle={{width:'100%'}} onChange={(e,date)=>this.handleEndTime(e,date)}/>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <TextField
                            hintText="Location"
                            floatingLabelText="Location"
                            style={{width:'100%'}}
                            onChange={(e)=>this.handleLocation(e)}
                            floatingLabelStyle={{color:'#607D8B'}}
                            underlineFocusStyle={{borderColor:'#90A4AE'}}
                          />
                        </div>
                        <div className="col-md-6">
                          <SelectField
                            value={this.state.type}
                            style={{width:'100%'}}
                            floatingLabelStyle={{color:'#607D8B'}}
                            selectedMenuItemStyle={{color:'#607D8B'}}
                            floatingLabelText="Select the type of your activity"
                            onChange={(e,index,value)=>{this.handleEvent(e,index,value)}}>
                            <MenuItem value={1} primaryText="Event" />
                            <MenuItem value={2} primaryText="Entertainment" />
                            <MenuItem value={3} primaryText="Study" />
                          </SelectField>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <TextField
                            rows={2}
                            multiLine={true}
                            rowsMax={2}
                            hintText="Description"
                            floatingLabelText="Description"
                            style={{width:'100%'}}
                            floatingLabelStyle={{color:'#607D8B'}}
                            underlineFocusStyle={{borderColor:'#90A4AE'}}
                            onChange={(e)=>this.handleDescription(e)}
                          />
                          <TextField
                            rows={4}
                            multiLine={true}
                            rowsMax={5}
                            hintText="Details"
                            floatingLabelText="Details"
                            style={{width:'100%'}}
                            onChange={(e)=>this.handleDetail(e)}
                            floatingLabelStyle={{color:'#607D8B'}}
                           underlineFocusStyle={{borderColor:'#90A4AE'}}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="panel-footer">
                    <div className="row">
                      <div className="col-md-6 nopadding">
                        <button type="button" className="btn btn-blue-grey pull-Left nomargin" onClick={(e)=>this.handleInvite(e)} name="button" data-toggle="modal" data-target="#invitemodal">Invite Friend</button>
                        <div className="modal fade " id="invitemodal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                          <div className="modal-dialog" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <button type="button" className="close"  data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h3 className="modal-title">Invite friends</h3>

                              </div>
                              <div className="modal-body " style={{
                                  "padding":'0px'
                                }}>
                                <ul className="media-list">
                                  {this.state.userData.friends === undefined ? null : this.state.userData.friends.map((friend,i)=>{
                                    return <PostActivityFriendItem data={friend} key={i} reset={this.state.reset} onInvite={(e)=>this.handleInviteUser(e)}/>
                                  })}
                                </ul>
                          </div>

                          <div className="modal-footer" style={{
                              'border':'none'
                            }}>
                            <button type="button" className="btn btn-primary btn-blue-grey" onClick={(e)=>this.handlereset(e)}>Reset</button>
                            <button type="button" className="btn btn-default btn-blue-grey" data-dismiss="modal">Confirm</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <label type="button" className="btn btn-blue-grey pull-left" name="button">
                      Upload activity header <input type="file" style={{"display":"none"}}
                      onClick={(e)=>this.handleFileClick(e)} onChange={(e)=>this.handleFile(e)}/>
                    </label>
                  </div>
                  <div className="col-md-6 nopadding">
                    <button type="button" className="btn btn-blue-grey pull-right nomargin" onClick={(e)=>this.handleSubmit(e)}>Submit</button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <img src={this.state.img} style={{marginTop:'20px'}} className={hideElement(this.state.cropperOpen)} width="100%"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
}
}
