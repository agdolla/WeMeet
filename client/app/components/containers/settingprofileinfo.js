import React from 'react'

import {getUserData,changeUserInfo} from '../../utils';


var alert = null;
var moment = require('moment');

import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

import {hideElement} from '../../utils';

export default class SettingProfileInfo extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userData:{},
            profileInfo:{
                username:"",
                nickname: "",
                description: "",
                birthday:null,
            },
            changeInfoFailed:false,
        }
    }

    getData(){
        getUserData(this.props.user,(userData)=>{
            this.setState({
                userData:userData,
                profileInfo:{
                    username:userData.fullname,
                    nickname: userData.nickname,
                    description: userData.description,
                    birthday: moment(userData.birthday).toDate()
                }
            });
        });
    }
    componentDidMount(){
        this.getData();
    }



    handleChangeUserInfo(e){
        e.preventDefault();
        if(this.state.username!==""&&
        this.state.nickname!==""&&
        this.state.description!==""){
            changeUserInfo({
                userId: this.state.userData._id,
                fullname:this.state.profileInfo.username,
                nickname: this.state.profileInfo.nickname,
                description: this.state.profileInfo.description,
                birthday:this.state.profileInfo.birthday
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

    handleChange(e){
        e.preventDefault();
        var updateProfileInfo=Object.assign({},this.state.profileInfo);
        updateProfileInfo[e.target.id]=e.target.value;
        this.setState({profileInfo:updateProfileInfo});
    }

    handleBirthday = (e, date) => {
        this.setState({
            birthday: date,
        });
    };

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
                                        {alert}
                                        <div className={"alert alert-warning alert-dismissible "+hideElement(!this.state.changeInfoFailed)} role="alert">
                                            <strong>Please fill in blanks</strong>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <TextField
                                                id="username"
                                                hintText="Your name"
                                                floatingLabelText="Your name"
                                                style={{width:'100%'}}
                                                value={this.state.profileInfo.username}
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
                                                value={this.state.profileInfo.nickname}
                                                onChange={(e)=>this.handleChange(e)}
                                                floatingLabelStyle={{color:'#607D8B'}}
                                                underlineFocusStyle={{borderColor:'#90A4AE'}}
                                            />
                                            <div className="md-form">
                                                <h5>Birthday</h5>
                                                <DatePicker hintText="Choose your birthday" value={this.state.profileInfo.birthday}
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
                                                value={this.state.profileInfo.description}
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
