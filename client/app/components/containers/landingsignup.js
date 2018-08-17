import React from 'react';
import {withRouter} from 'react-router-dom';
import {hideElement} from '../../utils';
import {signup,login} from '../../utils';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

let zxcvbn = require('zxcvbn');

class LandingSignup extends React.Component{
    constructor(props){
        super(props);
        this.state={
            signUpEmail:"",
            signUpName:"",
            signUpPass:"",
            signUpPass2:"",
            failedLogin:false,
            failedSignUp:false,
            submitted:false,
            passwordStrength:0,
            passwordClass:"progress-bar-danger",
            passwordTooSimple:false
        }
    }


    handleSignUp(e){
        e.preventDefault();
        if(this.state.signUpName.trim()!==""&&
        this.state.signUpEmail!==""&&
        this.state.signUpPass!==""&&
        this.state.passwordStrength>=60&&
        this.state.signUpPass===this.state.signUpPass2&&(e.key==="Enter"||e.button===0)){
            this.setState({
                submitted:true
            });
            signup(this.state.signUpEmail,this.state.signUpName,this.state.signUpPass,(success)=>{
                if(success){
                    login(this.state.signUpEmail,this.state.signUpPass,(success)=>{
                        if(success){
                            this.setState({
                                signInPass:"",
                                signInEmail:"",
                                signUpEmail:"",
                                signUpPass:"",
                                signUpName:"",
                                failedLogin:false,
                                submitted:false,
                                passwordError:false
                            });
                            this.props.history.push('/activity');
                        }
                        else{
                            this.setState({
                                failedLogin:true,
                                submitted:false
                            })
                        }
                    });
                }
                else{
                    this.setState({
                        failedSignUp:true,
                        submitted:false
                    });
                }
            });
        }
        else if(this.state.passwordStrength<60 && this.state.signUpPass!==""&&(e.key==="Enter"||e.button===0)){
            this.setState({
                passwordTooSimple:true,
                submitted:false
            })
        }
        else if(this.state.signUpPass2!==this.state.signUpPass&&(e.key==="Enter"||e.button===0)){
            this.setState({
                passwordError:true,
                submitted:false
            })
        }
    }



    handleChange(field, e) {
        e.preventDefault();
        if(field==="signUpPass"){
            this.setState({
                passwordTooSimple:false
            });
            var strength = zxcvbn(e.target.value);
            switch (strength.score) {
                case 0:{
                    this.setState({
                        passwordStrength:20
                    })
                }
                break;
                case 1:{
                    this.setState({
                        passwordStrength:40
                    })
                }
                break;
                case 2:{
                    this.setState({
                        passwordStrength:60,
                        passwordClass:"progress-bar-success",
                        passwordTooSimple:false
                    })
                }
                break;
                case 3:{
                    this.setState({
                        passwordStrength:80,
                        passwordClass:"progress-bar-success",
                        passwordTooSimple:false
                    })
                }
                break;
                case 4:{
                    this.setState({
                        passwordStrength:100,
                        passwordClass:"progress-bar-success",
                        passwordTooSimple:false
                    })
                }
                break;
                default:
            }
            if(e.target.value===""){
                this.setState({
                    passwordStrength:0,
                    passwordClass:"progress-bar-danger"
                })
            }
        }
        var update = {};
        update[field] = e.target.value;
        this.setState(update);
    }



    render(){
        return(
            <div className="col-md-6 signup">
                <div className={hideElement(!this.state.failedSignUp) + " alert alert-danger"} role="alert"><strong>
                    Invalid account signup.</strong><br/>
                    1.It is possible that you already have an account with that particular email address<br/>
                    2.you didn't fill in all the blanks.<br/>
                    3.email format is not correct
                </div>
                <div className={hideElement(!this.state.passwordError) + " alert alert-danger"} role="alert"><strong>
                    Invalid account signup.</strong> two passwords don't match
                </div>
                <div className={hideElement(!this.state.passwordTooSimple) + " alert alert-danger"} role="alert"><strong>
                    Password is too simple</strong>
                </div>
                <div className="panel panel-primary">
                    <div className="panel-heading">
                        <h4>Sign up</h4>
                    </div>
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-md-7 col-md-offset-2">
                                <FormControl style={{width:'100%', marginBottom:'20px'}}>
                                    <InputLabel
                                    style={{color:'#607D8B'}}
                                    htmlFor="signUpUsername">
                                    Username
                                    </InputLabel>
                                    <Input
                                    id="signUpUsername"
                                    value={this.state.signUpName}
                                    onChange={(e)=>this.handleChange("signUpName",e)}
                                    onKeyUp={(e)=>this.handleSignUp(e)}
                                    />
                                </FormControl>
                            </div>
                            <div className="col-md-7 col-md-offset-2">
                                <FormControl style={{width:'100%', marginBottom:'20px'}}>
                                    <InputLabel
                                    style={{color:'#607D8B'}}
                                    htmlFor="signUpEmail">
                                    Email
                                    </InputLabel>
                                    <Input
                                    id="signUpEmail"
                                    value={this.state.signUpEmail}
                                    onChange={(e)=>this.handleChange("signUpEmail",e)}
                                    onKeyUp={(e)=>this.handleSignUp(e)}
                                    />
                                </FormControl>
                            </div>
                            <div className="col-md-7 col-md-offset-2">
                                <FormControl style={{width:'100%', marginBottom:'20px'}}>
                                    <InputLabel
                                    style={{color:'#607D8B'}}
                                    htmlFor="signUpPass">
                                    Password
                                    </InputLabel>
                                    <Input
                                    id="signUpPass"
                                    value={this.state.signUpPass}
                                    onChange={(e)=>this.handleChange("signUpPass",e)}
                                    onKeyUp={(e)=>this.handleSignUp(e)}
                                    />
                                </FormControl>
                                <div className="progress" style={{height:'6px', marginTop:'-15px',borderRadius:'0'}}>
                                    <div className={"progress-bar "+this.state.passwordClass}
                                    role="progressbar"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    style={{width:this.state.passwordStrength+"%"}}>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-7 col-md-offset-2">
                            <FormControl style={{width:'100%', marginBottom:'20px'}}>
                                <InputLabel
                                style={{color:'#607D8B'}}
                                htmlFor="signUpPass2">
                                Confirm password
                                </InputLabel>
                                <Input
                                id="signUpPass2"
                                value={this.state.signUpPass2}
                                onChange={(e)=>this.handleChange("signUpPass2",e)}
                                onKeyUp={(e)=>this.handleSignUp(e)}
                                />
                            </FormControl>
                        </div>
                    </div>
                </div>
                <div className="panel-footer">
                    <div className="row">
                        <div className="col-md-12">
                            <Button className='pull-right' style={{backgroundColor: '#403e3e', color:'white'}} 
                            variant='contained'
                            onClick={(e)=>this.handleSignUp(e)}>
                                Join us!
                            </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(LandingSignup)
