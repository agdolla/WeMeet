import React from 'react'
import {getUserData, changeEmail, ChangeAvatar} from '../../utils';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Cropper from 'react-cropper';
import 'node_modules/cropperjs/dist/cropper.css';
import {hideElement} from '../../utils';
var swal = require('sweetalert');
var emailAlert = null;


export default class SettingSystemInfo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userData:{},
            oldEmail:"",
            newEmail:"",
            img: null,
            cropperOpen: false,
            fileTooLarge:false,
            fileWrongType:false
        }
    }
    getData(){
        getUserData(this.props.user,(userData)=>{
            this.setState({
                userData:userData,
            });
        });
    }

    componentDidMount(){
        this.getData();
    }

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

    handleRequestHide(){
        this.setState({
            cropperOpen: false,
            img: null
        })
    }

    handleCrop(){
        this.setState({
            cropperOpen: false,
            img: this.refs.cropper.getCroppedCanvas().toDataURL()
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
                swal({
                  title: "Success!",
                  icon: "success",
                  button: "OK",
                })
                .then(()=>{
                    this.handleRequestHide();
                    location.reload();
                });
            });
        }
    }
    render(){
        const actions = [
          <FlatButton
            label="Cancel"
            primary={true}
            onClick={()=>this.handleRequestHide()}
          />,
          <FlatButton
            label="Submit"
            primary={true}
            keyboardFocused={true}
            onClick={()=>this.handleCrop()}
          />
        ];
        return(
            <div className="setting-system-info">
                {this.state.cropperOpen &&
                    <Dialog
                      title="Adjust your avatar image "
                      actions={actions}
                      modal={false}
                      open={this.state.cropperOpen}
                      onRequestClose={()=>this.handleRequestHide()}
                    >
                    <Cropper
                      ref='cropper'
                      src={this.state.img}
                      style={{height: 400, width: '100%'}}
                      aspectRatio={1/1}/>
                    </Dialog>
                }
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
                                                    <div className="thumbnail" style={{border: "1px dashed black", width: "100px", height: "120px" }}>
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
                                <button type="button" className="btn btn-blue-grey pull-right" name="button" onClick={(e)=>this.handleAvatarChange(e)}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
