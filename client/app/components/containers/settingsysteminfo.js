import React from 'react'
import {changeEmail, ChangeAvatar, changePassword} from '../../utils';
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
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
var swal = require('sweetalert');
// let debug = require('react-debug');

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
            changeEmailFailed: false,
            oldPass: "",
            newPass: "",
            newPass2: "",
            passwordStrength:0,
            passwordClass:"progress-bar-danger",
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(JSON.stringify(this.props.userData) !== JSON.stringify(prevProps.userData))
            this.setState({
                userData: this.props.userData
            })
    }
    

    handleOldEmail(e){
        e.preventDefault();
        this.setState({oldEmail: e.target.value});
    }

    handleNewEmail(e){
        e.preventDefault();
        this.setState({newEmail: e.target.value});
    }

    handleOldPass(e){
        this.setState({oldPass: e.target.value});   
    }
    
    handleNewPass(e){
        switch (zxcvbn(e.target.value).score) {
            case 0:
                this.setState({
                    passwordStrength:0,
                    newPass: e.target.value,
                    passwordClass: 'progress-bar-danger'
                })
                break;
            case 1:
                this.setState({
                    passwordStrength:40,
                    newPass: e.target.value,
                    passwordClass: 'progress-bar-danger'
                })
                break;
            case 2:
                this.setState({
                    passwordStrength:60,
                    newPass: e.target.value,
                    passwordClass:"progress-bar-success"
                })
                break;
            case 3:
                this.setState({
                    passwordStrength:80,
                    newPass: e.target.value,
                    passwordClass:"progress-bar-success"
                })
                break;
            case 4:
                this.setState({
                    passwordStrength:100,
                    newPass: e.target.value,
                    passwordClass:"progress-bar-success"
                })
                break;
            default:
                break;
        }
    }

    handleNewPass2(e){
        this.setState({newPass2: e.target.value});
    }

    //1.password is strong, two passwords match
    handleChangePass() {
        if(this.state.oldPass==="" || this.state.newPass==="" || this.state.newPass2===""){
            swal('Error', 'Please fill all the fields', 'error');
            return;
        }
        let data = {
            oldPass: this.state.oldPass,
            newPass: this.state.newPass
        }
        if(data.oldPass === data.newPass){
            swal('Error', "New password can't be the same as the old one", 'error');
            return;
        }
        if(this.state.passwordStrength >= 60 && this.state.newPass === this.state.newPass2){
            changePassword(this.state.userData._id, data)
            .then(response=>{
                let err = response.data;
                if(err){
                    swal('Error', 'Old password is wrong', 'error');
                }
                else{
                    swal('Success', '', 'success');
                }
            });
        }
        else{
            if(this.state.passwordStrength < 60)
                swal('Error', 'Password is too simple', 'error');
            else swal('Error', "Comfirm your password", 'error');
        }
    }

    handleEmailChange(e){
        e.preventDefault();
        if(this.state.oldEmail!=="" && this.state.newEmail!==""){
            changeEmail(this.state.userData._id,{
                oldEmail: this.state.oldEmail,
                newEmail: this.state.newEmail
            })
            .then(response=>{
                var msg = "";
                var color = "";
                var invalid = false;
                if(response.data){
                    msg = "Old email is wrong or new email has wrong format";
                    color = "#d32f2f";
                    invalid = true;
                }
                else{
                    msg = "Successfully Changed  Email";
                    color = "#43A047";
                    invalid = false;
                }
                this.setState({
                    oldEmail: "",
                    newEmail: "",
                    snackBarColor: color,
                    snackBarMsg: msg,
                    open: true,
                    changeEmailFailed: invalid
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
                    {'facebookID' in this.state.userData ? null:<ExpansionPanel style={{boxShadow: '0 10px 28px 0 rgba(137,157,197,.12)'}}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            Change Password
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div className='row'>
                            <FormControl fullWidth style={{marginBottom:'20px'}}>
                                <InputLabel
                                style={{color:'#607D8B'}}
                                htmlFor="oldpass">
                                Old password
                                </InputLabel>
                                <Input
                                type="password"
                                id="oldpass"
                                onChange={(e)=>this.handleOldPass(e)}
                                />
                            </FormControl>
                            <FormControl fullWidth style={{marginBottom:'20px'}}>
                                <InputLabel
                                style={{color:'#607D8B'}}
                                htmlFor="newpass">
                                New Password
                                </InputLabel>
                                <Input
                                type="password"
                                id="newpass"
                                onChange={(e)=>this.handleNewPass(e)}
                                />
                            </FormControl>
                            <div className="progress" style={{height:'6px', marginTop:'-20px',borderRadius:'0'}}>
                                <div className={"progress-bar "+this.state.passwordClass}
                                role="progressbar"
                                aria-valuemin="0"
                                aria-valuemax="100"
                                style={{width:this.state.passwordStrength+"%"}}>
                                </div>
                            </div>
                            <FormControl fullWidth style={{marginBottom:'20px'}}>
                                <InputLabel
                                style={{color:'#607D8B'}}
                                htmlFor="confirmpass">
                                Confirm Password
                                </InputLabel>
                                <Input
                                type="password"
                                id="confirmpass"
                                onChange={(e)=>this.handleNewPass2(e)}
                                />
                            </FormControl>
                            <button type="button" onClick={()=>this.handleChangePass()} 
                            className="btn btn-blue-grey pull-right" name="button">Submit</button>
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>}
                    <ExpansionPanel style={{boxShadow: '0 10px 28px 0 rgba(137,157,197,.12)'}}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            Change Email
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div className='row'>
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
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel style={{boxShadow: '0 10px 28px 0 rgba(137,157,197,.12)'}}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            Change Avatar
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div className='row'>
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
                                <div className='col-md-12'>
                                    <button type="button" className="btn btn-blue-grey pull-right" name="button" onClick={(e)=>this.handleAvatarChange(e)}>Submit</button>
                                </div>
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </div>
            </div>
        )
    }
}
