import React from 'react'
import {withRouter} from 'react-router-dom';
//util function
import {hideElement} from '../../utils';
//request function
import {login} from '../../utils';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


class LandingSignin extends React.Component{
    constructor(props){
        super(props);
        this.state={
            signInEmail:"",
            signInPass:"",
            failedLogin:false,
            submitted:false
        }
    }


    handleChange(field, e) {
        e.preventDefault();
        var update = {};
        update[field] = e.target.value;
        this.setState(update);
    }

    handleSignIn(e){
        e.preventDefault();
        if(this.state.signInPass!==""&&this.state.signInEmail!==""&& (e.key==="Enter"||e.button===0)){
            this.setState({
                submitted:true
            });
            login(this.state.signInEmail,this.state.signInPass,(success)=>{
                if(success){
                    this.setState({
                        signInPass:"",
                        signInEmail:"",
                        failedLogin:false,
                        submitted:false
                    });
                    this.props.history.push("/activity");
                }
                else{
                    this.setState({
                        failedLogin:true,
                        submitted:false
                    });
                }
            });
        }
    }



    render(){
        return(
            <div className="col-md-6 signin">
                <div className={"alert alert-danger " + hideElement(!this.state.failedLogin)} role="alert">
                    <strong>Invalid email address or password.</strong> Please try a different email address or password, and try logging in again.
                </div>
                <div className="panel panel-primary">
                    <div className="panel-heading">
                        <h4>Log in</h4>
                    </div>
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-md-7 col-md-offset-2">
                                <TextField
                                hintText="Email"
                                floatingLabelText="Email"
                                style={{width:'100%'}}
                                onChange={(e)=>this.handleChange("signInEmail",e)}
                                onKeyUp={(e)=>this.handleSignIn(e)}
                                floatingLabelStyle={{color:'#607D8B'}}
                                underlineFocusStyle={{borderColor:'#90A4AE'}}
                                />
                            </div>
                            <div className="col-md-7 col-md-offset-2">
                                <TextField
                                hintText="Password"
                                type='password'
                                floatingLabelText="Password"
                                style={{width:'100%'}}
                                onChange={(e)=>this.handleChange("signInPass",e)}
                                onKeyUp={(e)=>this.handleSignIn(e)}
                                floatingLabelStyle={{color:'#607D8B'}}
                                underlineFocusStyle={{borderColor:'#90A4AE'}}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="panel-footer">
                        <div className="row">
                            <div className="col-md-12">
                                <RaisedButton className="pull-right" default={true} disabled={this.state.submitted} label="Welcome Back" onClick={(e)=>this.handleSignIn(e)}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default withRouter(LandingSignin);
