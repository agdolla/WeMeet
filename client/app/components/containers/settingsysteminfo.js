import React from 'react'
import {changeEmail, ChangeAvatar} from '../../utils';
import 'node_modules/cropperjs/dist/cropper.css';
import {hideElement} from '../../utils';
import Cropper from 'react-cropper';
//mui
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

var swal = require('sweetalert');
let debug = require('react-debug');

export default class SettingSystemInfo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userData: props.userData,
            oldEmail:"",
            newEmail:"",
            img: null,
            cropperOpen:false,
            snackBarColor:"",
            snackBarMsg:"",
            open: false,
            changeEmailFailed: false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            userData: nextProps.userData
        });
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
            })
            .then(response=>{
                debug(response);
                var msg = "";
                var color = "";
                if(response.data){
                    msg = "Old email is wrong or new email has wrong format";
                    color = "#d32f2f"
                }
                else{
                    msg = "Successfully Changed  Email";
                    color = "#43A047"
                }
                this.setState({
                    oldEmail: "",
                    newEmail: "",
                    snackBarColor: color,
                    snackBarMsg: msg,
                    open: true
                });
            });
        }
        else{
            this.setState({
                oldEmail: "",
                newEmail: "",
                snackBarColor: "#d32f2f",
                snackBarMsg: "Please fill in blanks",
                open: true,
                changeEmailFailed: true
            });
        }
    }

    handleFile(e){
        e.preventDefault();
        // Read the first file that the user selected (if the user selected multiple
        // files, we ignore the others).
        var reader = new FileReader();
        var file = e.target.files[0];
        // Called once the browser finishes loading the image.
        if(file.size > 1100000 || !file.type.match('image.*')){
            let msg = file.size > 1100000 ? "File should be less than 1.1 MB" : "File is not an image file";
            this.setState({
                snackBarColor: "#d32f2f",
                snackBarMsg: msg,
                open: true
            });
            return;
        }
        reader.onload = (upload) => {
            this.setState({
                img: upload.target.result,
                cropperOpen:true
            });
        };
        reader.readAsDataURL(file);
    }

    handleFileClick(e){
        e.target.value = null;
    }

    handleRequestHide = ()=>{
        this.setState({
            cropperOpen: false,
            img: null
        });
    }

    handleCrop = ()=>{
        this.setState({
            cropperOpen: false,
            img: this.refs.cropper.getCroppedCanvas().toDataURL()
        });
    }

    handleSnackBarClose = () =>{
        this.setState({open:false});
    }

    handleAvatarChange(e){
        e.preventDefault();
        if(this.state.img !== null){
            ChangeAvatar(this.state.userData._id,this.state.img)
            .then(response=>{
                let userData = response.data;
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
        return(
            <div className="setting-system-info">
                {this.state.cropperOpen &&
                    <Dialog
                    open={this.state.cropperOpen}
                    onClose={this.handleRequestHide}>
                        <DialogTitle>Adjust your avatar image</DialogTitle>
                        <DialogContent>
                            <Cropper
                            ref='cropper'
                            src={this.state.img}
                            style={{height: 400, width: '100%'}}
                            aspectRatio={1/1}/>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleRequestHide} color="primary">
                            Cancel
                            </Button>
                            <Button onClick={this.handleCrop} color="primary">
                            Submit
                            </Button>
                        </DialogActions>
                    </Dialog>
                }
                <Snackbar
                autoHideDuration={4000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                open={this.state.open}
                onClose={this.handleSnackBarClose}>
                    <SnackbarContent
                    style={{
                        backgroundColor: this.state.snackBarColor
                    }}
                    message={
                        <span style={{                        
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                            {this.state.changeEmailFailed?
                                <WarningIcon style={{fontSize: '20px', marginRight:'10px'}}/>:
                                <CheckCircleIcon style={{fontSize: '20px', marginRight:'10px'}}/>
                            }
                            {this.state.snackBarMsg}
                        </span>
                    }
                    />
                </Snackbar>
                <div className="col-md-3 system-settings">
                    <div className="list-group">
                        <a className="list-group-item"data-toggle="collapse" data-parent="#accordion" href="#reset-password" aria-expanded="true" aria-controls="reset-password">
                            Change Password <span className="pull-right"><i className="fa fa-angle-right" aria-hidden="true"></i></span>
                        </a>
                        <div id="reset-password" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                            <div className="panel-body">
                                <FormControl fullWidth style={{marginBottom:'20px'}}>
                                    <InputLabel
                                    style={{color:'#607D8B'}}
                                    htmlFor="oldpass">
                                    Old password
                                    </InputLabel>
                                    <Input
                                    id="oldpass"
                                    />
                                </FormControl>
                                <FormControl fullWidth style={{marginBottom:'20px'}}>
                                    <InputLabel
                                    style={{color:'#607D8B'}}
                                    htmlFor="newpass">
                                    New Password
                                    </InputLabel>
                                    <Input
                                    id="newpass"
                                    />
                                </FormControl>
                                <FormControl fullWidth style={{marginBottom:'20px'}}>
                                    <InputLabel
                                    style={{color:'#607D8B'}}
                                    htmlFor="confirmpass">
                                    Confirm Password
                                    </InputLabel>
                                    <Input
                                    id="confirmpass"
                                    />
                                </FormControl>
                                <button type="button" className="btn btn-blue-grey pull-right" name="button">Submit</button>
                            </div>
                        </div>
                        <a className="list-group-item"data-toggle="collapse" data-parent="#accordion" href="#reset-email" aria-expanded="true" aria-controls="reset-password">
                            Reset Email <span className="pull-right"><i className="fa fa-angle-right" aria-hidden="true"></i></span>
                        </a>
                        <div id="reset-email" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                            <div className="panel-body">
                                <FormControl fullWidth style={{marginBottom:'20px'}}>
                                    <InputLabel
                                    style={{color:'#607D8B'}}
                                    htmlFor="oldemail">
                                    Old Email
                                    </InputLabel>
                                    <Input
                                    id="oldemail"
                                    value={this.state.oldEmail}
                                    onChange={(e)=>this.handleOldEmail(e)}
                                    />
                                </FormControl>

                                <FormControl fullWidth style={{marginBottom:'20px'}}>
                                    <InputLabel
                                    style={{color:'#607D8B'}}
                                    htmlFor="newemail">
                                    New Email
                                    </InputLabel>
                                    <Input
                                    id="newemail"
                                    value={this.state.newEmail}
                                    onChange={(e)=>this.handleNewEmail(e)}
                                    />
                                </FormControl>
                                <button type="button" className="btn btn-blue-grey pull-right" name="button" onClick={(e)=>this.handleEmailChange(e)}>Submit</button>
                            </div>
                        </div>

                        <a className="list-group-item"data-toggle="collapse" data-parent="#accordion" href="#change-avatar" aria-expanded="true" aria-controls="reset-password">
                            Change Avatar <span className="pull-right"><i className="fa fa-angle-right" aria-hidden="true"></i></span>
                        </a>

                        <div id="change-avatar" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                            <div className="panel-body">
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
