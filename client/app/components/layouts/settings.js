import React from 'react';

//import presentations
import {Navbar} from '../presentations';
//import request function
import {getUserData,changeEmail,changeUserInfo,ChangeAvatar} from '../../utils';
//import util function
import {hideElement} from '../../utils';

var alert = null;
var emailAlert = null;
var moment = require('moment');
import AvatarCropper from "react-avatar-cropper";
var debug = require('react-debug');
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';

export default class Settings extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      userData: {},
      username:"",
      nickname: "",
      description: "",
      birthday:null,
      oldEmail:"",
      newEmail:"",
      img: null,
      cropperOpen: false,
      changeInfoFailed:false,
      fileTooLarge:false,
      fileWrongType:false
    }
  }

  handleFile(e){
    e.preventDefault();
    // Read the first file that the user selected (if the user selected multiple
    // files, we ignore the others).
    var reader = new FileReader();
    var file = e.target.files[0];
    // Called once the browser finishes loading the image.
    if(file.size > 1100000){
      return this.setState({
        fileTooLarge:true
      })
    }
    else if(!file.type.match('image.*')){
      return this.setState({
        fileWrongType:true
      })
    }
    reader.onload = (upload) => {
      this.setState({
        img: upload.target.result,
        cropperOpen:true,
        fileTooLarge:false,
        fileWrongType:false
      });
    };

    reader.readAsDataURL(file);
  }

  handleFileClick(e){
    e.target.value = null;
  }

  handleRequestHide(e){
    e.preventDefault();
    this.setState({
      cropperOpen: false,
      img: null
    })
  }

  handleCrop(dataURI) {
    this.setState({
      cropperOpen: false,
      img: dataURI
    });
  }

  handleAvatarChange(e){
    e.preventDefault();
    if(this.state.img !== null){
      ChangeAvatar(this.state.userData._id,this.state.img,(userData)=>{
        this.setState({userData: userData});
        var user = {};
        user._id = userData._id;
        user.avatar = userData.avatar;
        user.friends = userData.friends;
        user.fullname = userData.fullname;
        localStorage.setItem('user', JSON.stringify(user));
      });
    }
  }

  handleChangeUserInfo(e){
    e.preventDefault();
    if(this.state.username!==""&&
        this.state.nickname!==""&&
        this.state.description!==""){
          changeUserInfo({
            userId: this.state.userData._id,
            fullname:this.state.username,
            nickname: this.state.nickname,
            description: this.state.description,
            birthday:this.state.birthday
          },(userData)=>{
            alert = <div className={"alert alert-success alert-dismissible"} role="alert">
              <strong>Change info succeed!</strong>
            </div>
            this.setState({
              userData: userData,
              changeInfoFailed:false
            });
          });
        }
        else{
          alert = null;
          this.setState({
            changeInfoFailed:true
          });
        }

  }

  getData(){
    getUserData(this.props.user,(userData)=>{
        this.setState({
          userData:userData,
          username:userData.fullname,
          nickname: userData.nickname,
          description: userData.description,
          birthday: moment(userData.birthday).toDate()
        });
    });
  }

  handleUsername(e){
    e.preventDefault();
    this.setState({username: e.target.value});
  }


  handleNickname(e){
    e.preventDefault();
    this.setState({nickname: e.target.value});
  }

  handleDescription(e){
    e.preventDefault();
    this.setState({description: e.target.value});
  }
  handleBirthday = (event, date) => {
    this.setState({
      birthday: date,
    });
  };
  handleOldEmail(e){
    e.preventDefault();
    this.setState({oldEmail: e.target.value});
  }
  handleNewEmail(e){
    e.preventDefault();
    this.setState({newEmail: e.target.value});
  }
  handleEmailChange(e){
      e.preventDefault();
      if(this.state.oldEmail!=="" && this.state.newEmail!==""){
        changeEmail({
          userId: this.state.userData._id,
          oldEmail: this.state.oldEmail,
          newEmail: this.state.newEmail
        },(error)=>{
          if(error){
            emailAlert = (<div className="alert alert-warning" role="alert">
                          <strong>Old email is wrong or new email has wrong format</strong>
                        </div>);
          }
          else{
            emailAlert = (<div className="alert alert-success" role="alert">
                          <strong>Change email succeed!</strong>
                        </div>);
          }
          this.setState({
            oldEmail:"",
            newEmail:""
          })
        });
      }
      else{
        emailAlert = (<div className="alert alert-warning" role="alert">
                      <strong>Please fill in blanks</strong>
                    </div>);
      }

      this.setState({
        oldEmail:"",
        newEmail:""
      })
  }


  render(){
    return(
      <div style={{marginTop:'70px'}}>
        {this.state.cropperOpen &&
          <AvatarCropper
            onRequestHide={(e)=>this.handleRequestHide(e)}
            cropperOpen={this.state.cropperOpen}
            onCrop={(e)=>this.handleCrop(e)}
            image={this.state.img}
            width={512}
            height={512}
            />
        }
        <Navbar user={this.state.userData}/>
        <div className="container settings">
          <div className="row">
            <div className="col-md-7 col-md-offset-1 infos">
              <h4><span><i className="fa fa-cog" aria-hidden="true"></i></span> Settings</h4>
              <div className="panel panel-default personal-info-1">
                <div className="panel-heading">
                  <div className="row">
                    <div className="col-md-12">
                      <h4>Personal Info</h4>
                      <div>
                        {alert}
                        <div className={"alert alert-warning alert-dismissible "+hideElement(!this.state.changeInfoFailed)} role="alert">
                          <strong>Please fill in blanks</strong>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <TextField
                            hintText="Your name"
                            floatingLabelText="Your name"
                            style={{width:'100%'}}
                            value={this.state.username}
                            onChange={(e)=>this.handleUsername(e)}
                            floatingLabelStyle={{color:'#607D8B'}}
                            underlineFocusStyle={{borderColor:'#90A4AE'}}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <TextField
                            hintText="NickName"
                            floatingLabelText="NickName"
                            style={{width:'100%'}}
                            value={this.state.nickname}
                            onChange={(e)=>this.handleNickname(e)}
                            floatingLabelStyle={{color:'#607D8B'}}
                            underlineFocusStyle={{borderColor:'#90A4AE'}}
                          />
                          <div className="md-form">
                            <h5>Birthday</h5>
                            <DatePicker hintText="Choose your birthday" value={this.state.birthday}
                            onChange={(e,date)=>{this.handleBirthday(e,date)}} textFieldStyle={{width:"100%"}}/>
                          </div>
                          <TextField
                            rows={4}
                            multiLine={true}
                            rowsMax={4}
                            hintText="About you"
                            floatingLabelText="About you"
                            style={{width:'100%'}}
                            value={this.state.description}
                            onChange={(e)=>this.handleDescription(e)}
                            floatingLabelStyle={{color:'#607D8B'}}
                            underlineFocusStyle={{borderColor:'#90A4AE'}}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                </div>
                <div className="panel-footer">
                  <div className="row">
                    <div className="col-md-12">
                      <button type="button" className="btn btn-blue-grey pull-right" name="button"
                        onClick={(e)=>this.handleChangeUserInfo(e)}>Save</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 system-settings">
              <div className="list-group">
                <a className="list-group-item"data-toggle="collapse" data-parent="#accordion" href="#reset-password" aria-expanded="true" aria-controls="reset-password">
                  Change Password <span className="pull-right"><i className="fa fa-angle-right" aria-hidden="true"></i></span>
                </a>
                <div id="reset-password" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                  <div className="panel-body">
                    <TextField
                      hintText="Old password"
                      floatingLabelText="Old password"
                      style={{width:'100%'}}
                      type='password'
                      floatingLabelStyle={{color:'#607D8B'}}
                      underlineFocusStyle={{borderColor:'#90A4AE'}}
                    />

                    <TextField
                      hintText="New password"
                      floatingLabelText="New password"
                      style={{width:'100%'}}
                      type='password'
                      floatingLabelStyle={{color:'#607D8B'}}
                      underlineFocusStyle={{borderColor:'#90A4AE'}}
                    />

                    <TextField
                      hintText="Repeat password"
                      floatingLabelText="Repeat password"
                      style={{width:'100%'}}
                      type='password'
                      floatingLabelStyle={{color:'#607D8B'}}
                      underlineFocusStyle={{borderColor:'#90A4AE'}}
                    />
                    <button type="button" className="btn btn-blue-grey pull-right" name="button">Submit</button>
                  </div>
                </div>
                <a className="list-group-item"data-toggle="collapse" data-parent="#accordion" href="#reset-email" aria-expanded="true" aria-controls="reset-password">
                  Reset Email <span className="pull-right"><i className="fa fa-angle-right" aria-hidden="true"></i></span>
                </a>
                <div id="reset-email" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                  <div className="panel-body">
                    {emailAlert}
                    <TextField
                      hintText="Old Email"
                      floatingLabelText="Old Email"
                      style={{width:'100%'}}
                      value={this.state.oldEmail}
                      onChange={(e)=>this.handleOldEmail(e)}
                      floatingLabelStyle={{color:'#607D8B'}}
                      underlineFocusStyle={{borderColor:'#90A4AE'}}
                    />

                    <TextField
                      hintText="New Email"
                      floatingLabelText="New Email"
                      style={{width:'100%'}}
                      value={this.state.newEmail}
                      onChange={(e)=>this.handleNewEmail(e)}
                      floatingLabelStyle={{color:'#607D8B'}}
                      underlineFocusStyle={{borderColor:'#90A4AE'}}
                    />
                    <button type="button" className="btn btn-blue-grey pull-right" name="button" onClick={(e)=>this.handleEmailChange(e)}>Submit</button>
                  </div>
                </div>

                <a className="list-group-item"data-toggle="collapse" data-parent="#accordion" href="#change-avatar" aria-expanded="true" aria-controls="reset-password">
                  Change Avatar <span className="pull-right"><i className="fa fa-angle-right" aria-hidden="true"></i></span>
                </a>

                <div id="change-avatar" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                  <div className="panel-body">
                    <div className={"alert alert-warning alert-dismissible "+hideElement(!this.state.fileTooLarge)} role="alert">
                      <strong>File is too large</strong>
                    </div>
                    <div className={"alert alert-warning alert-dismissible "+hideElement(!this.state.fileWrongType)} role="alert">
                      <strong>File is not a image file</strong>
                    </div>
                    <div className="row">
                      <div className="col-md-8 col-md-offset-3">
                        <div className="btn-group" role="group">
                          <label htmlFor="pic">
                            <a>
                              <div className="thumbnail" style={{
                                  border: "1px dashed black",
                                  width: "100px",
                                  height: "110px"
                                }}>
                                <i className="fa fa-camera" aria-hidden="true"></i>
                                <img src={this.state.img} className={hideElement(this.state.cropperOpen)}
                                  width="100px" height="100px"/>
                              </div>
                            </a>
                          </label>
                          <input type="file" accept=".jpg,.jpeg,.png,.gif" id="pic" onClick={(e)=>this.handleFileClick(e)}
                            onChange={(e)=>this.handleFile(e)}></input>
                        </div>
                      </div>
                    </div>
                    <button type="button" className="btn btn-blue-grey pull-right" name="button"
                      onClick={(e)=>this.handleAvatarChange(e)}>Submit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  componentDidMount(){
    this.getData();
  }
}
