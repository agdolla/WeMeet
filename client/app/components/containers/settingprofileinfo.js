import React from 'react'
import {changeUserInfo} from '../../utils';
//mui
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { DatePicker } from 'material-ui-pickers';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

var moment = require('moment');
// const debug = require('react-debug');

export default class SettingProfileInfo extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userData:{
                fullname: "",
                nickname: "",
                description: ""
            },
            changeInfoFailed:false,
            open: false,
            snackBarMsg: "",
            snackBarColor: "",
            modified: false
        }
    }

    componentDidMount(){
        this.setState({
            userData: this.props.userData
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if(JSON.stringify(this.props.userData) !== JSON.stringify(prevProps.userData))
            this.setState({
                userData: this.props.userData
            })
    }
    

    handleChangeUserInfo(e){
        e.preventDefault();
        if(this.state.userData.fullname!=="" && this.state.userData.description!=="" && this.state.modified){
            changeUserInfo({
                userId: this.state.userData._id,
                fullname:this.state.userData.fullname,
                nickname: this.state.userData.nickname,
                description: this.state.userData.description,
                birthday:moment(this.state.userData.birthday).toDate()
            })
            .then(response=>{
                let userData = response.data;
                this.setState({
                    userData: userData,
                    changeInfoFailed:false,
                    snackBarMsg: "Successfully Changed Info!",
                    snackBarColor: "#2E7D32",
                    open:true,
                    modified: false
                });
            });
        }
        else if(this.state.modified){
            this.setState({
                changeInfoFailed:true,
                snackBarColor: "#d32f2f",
                snackBarMsg: "Your Name and About You can not be empty!",
                open: true,
                modified: false
            });
        }
    }

    handleChange(e){
        e.preventDefault();
        var updatedProfileInfo = Object.assign({},this.state.userData);
        updatedProfileInfo[e.target.id] = e.target.value;
        this.setState({
            userData: updatedProfileInfo,
            modified: true
        });
    }

    handleBirthday = (date) => {
        var updatedProfileInfo = Object.assign({},this.state.userData);
        updatedProfileInfo['birthday'] = date;
        this.setState({
            userData: updatedProfileInfo,
            modified: true
        });
    };

    handleSnackBarClose = () =>{
        this.setState({open:false});
    }

    render(){
        return(
            <MuiPickersUtilsProvider utils={MomentUtils}>
            <div className="setting-profile-info">
                <div className="col-md-7 col-md-offset-1 infos">
                    <h4><span><i className="fa fa-cog" aria-hidden="true"></i></span> Settings</h4>
                    <div className="panel panel-default personal-info-1">
                        <div className="panel-heading">
                            <div className="row">
                                <div className="col-md-12">
                                    <h4>Personal Info</h4>
                                    <div>
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
                                                    {this.state.changeInfoFailed?
                                                        <WarningIcon style={{fontSize: '20px', marginRight:'10px'}}/>:
                                                        <CheckCircleIcon style={{fontSize: '20px', marginRight:'10px'}}/>
                                                    }
                                                    {this.state.snackBarMsg}
                                                </span>
                                            }
                                            />
                                        </Snackbar>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <FormControl style={{width:'100%', marginBottom:'20px'}}>
                                                <InputLabel
                                                style={{color:'#607D8B'}}
                                                htmlFor="fullname">
                                                Your Name
                                                </InputLabel>
                                                <Input
                                                id="fullname"
                                                value={this.state.userData.fullname}
                                                onChange={(e)=>this.handleChange(e)}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <FormControl style={{width:'100%', marginBottom:'20px'}}>
                                                <InputLabel
                                                style={{color:'#607D8B'}}
                                                htmlFor="nickname">
                                                NickName
                                                </InputLabel>
                                                <Input
                                                id="nickname"
                                                value={this.state.userData.nickname}
                                                onChange={(e)=>this.handleChange(e)}
                                                />
                                            </FormControl>

                                            <DatePicker
                                                fullWidth
                                                format="MMM Do YY"
                                                style={{marginBottom: '20px'}}
                                                value={this.state.userData.birthday}
                                                onChange={this.handleBirthday}
                                                label="Birthday"
                                            />

                                            <FormControl style={{width:'100%', marginBottom:'20px'}}>
                                                <InputLabel
                                                style={{color:'#607D8B'}}
                                                htmlFor="description">
                                                About you
                                                </InputLabel>
                                                <Input multiline rows='4'
                                                id="description"
                                                value={this.state.userData.description}
                                                onChange={(e)=>this.handleChange(e)}
                                                />
                                            </FormControl>
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
            </div>
            </MuiPickersUtilsProvider>
        )
    }
}
