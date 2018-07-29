import React from 'react'
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import Snackbar from 'material-ui/Snackbar';
import {changeUserInfo} from '../../utils';

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
            snackBarColor: ""
        }
    }

    // componentDidMount(){
    //
    // }

    componentWillReceiveProps(nextProps) {
        this.setState({
            userData: nextProps.userData
        })
    }

    handleChangeUserInfo(e){
        e.preventDefault();
        if(this.state.userData.fullname!=="" && this.state.userData.description!==""){
            changeUserInfo({
                userId: this.state.userData._id,
                fullname:this.state.userData.fullname,
                nickname: this.state.userData.nickname,
                description: this.state.userData.description,
                birthday:moment(this.state.userData.birthday).toDate()
            },(userData)=>{
                this.setState({
                    userData: userData,
                    changeInfoFailed:false,
                    snackBarMsg: "Successfully Changed Info!",
                    snackBarColor: "#2E7D32",
                    open:true
                });
            });
        }
        else{
            this.setState({
                changeInfoFailed:true,
                snackBarColor: "#d32f2f",
                snackBarMsg: "Your Name and About You can not be empty!",
                open: true
            });
        }
    }

    handleChange(e){
        e.preventDefault();
        var updatedProfileInfo = Object.assign({},this.state.userData);
        updatedProfileInfo[e.target.id] = e.target.value;
        this.setState({
            userData: updatedProfileInfo
        });
    }

    handleBirthday = (e, date) => {
        var updatedProfileInfo = Object.assign({},this.state.userData);
        updatedProfileInfo['birthday'] = date;
        this.setState({
            userData: updatedProfileInfo
        });
    };

    handleSnackBarClose = () =>{
        this.setState({open:false});
    }

    render(){
        return(
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
                                            bodyStyle = {{
                                                backgroundColor:this.state.snackBarColor,
                                                textAlign:'center'
                                            }}
                                            open = {this.state.open}
                                            autoHideDuration = {3000}
                                            message = {this.state.snackBarMsg}
                                            onRequestClose={this.handleSnackBarClose}
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <TextField
                                                id="fullname"
                                                hintText="Your name"
                                                floatingLabelText="Your name"
                                                style={{width:'100%'}}
                                                value={this.state.userData.fullname}
                                                onChange={(e)=>this.handleChange(e)}
                                                floatingLabelStyle={{color:'#607D8B'}}
                                                underlineFocusStyle={{borderColor:'#90A4AE'}}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <TextField
                                                id="nickname"
                                                hintText="NickName"
                                                floatingLabelText="NickName"
                                                style={{width:'100%'}}
                                                value={this.state.userData.nickname}
                                                onChange={(e)=>this.handleChange(e)}
                                                floatingLabelStyle={{color:'#607D8B'}}
                                                underlineFocusStyle={{borderColor:'#90A4AE'}}
                                            />
                                            <div className="md-form">
                                                <h5>Birthday</h5>
                                                <DatePicker hintText="Choose your birthday" value={moment(this.state.userData.birthday).toDate()}
                                                onChange={(e,date)=>{this.handleBirthday(e,date)}} textFieldStyle={{width:"100%"}}/>
                                            </div>
                                            <TextField
                                                id="description"
                                                rows={4}
                                                multiLine={true}
                                                rowsMax={4}
                                                hintText="About you"
                                                floatingLabelText="About you"
                                                style={{width:'100%'}}
                                                value={this.state.userData.description}
                                                onChange={(e)=>this.handleChange(e)}
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
            </div>
        )
    }
}
