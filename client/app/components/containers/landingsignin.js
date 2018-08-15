import React from 'react'
import {withRouter} from 'react-router-dom';
//util function
import {hideElement} from '../../utils';
//request function
import {login} from '../../utils';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';


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
                                <FormControl style={{width:'100%', marginBottom:'20px'}}>
                                    <InputLabel
                                    style={{color:'#607D8B'}}
                                    htmlFor="signInEmail">
                                    Email
                                    </InputLabel>
                                    <Input
                                    id="signInEmail"
                                    value={this.state.signInEmail}
                                    onChange={(e)=>this.handleChange("signInEmail",e)}
                                    onKeyUp={(e)=>this.handleSignIn(e)}
                                    />
                                </FormControl>
                            </div>
                            <div className="col-md-7 col-md-offset-2">
                                <FormControl style={{width:'100%'}}>
                                    <InputLabel
                                    style={{color:'#607D8B'}}
                                    htmlFor="signInPass">
                                    Password
                                    </InputLabel>
                                    <Input
                                    id="signInPass"
                                    value={this.state.signInPass}
                                    onChange={(e)=>this.handleChange("signInPass",e)}
                                    onKeyUp={(e)=>this.handleSignIn(e)}
                                    type="password"
                                    />
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <div className="panel-footer">
                        <div className="row">
                            <div className="col-md-12">
                            <Button variant="contained" style={{fontSize:'14px'}} className='pull-right' disabled={this.state.submitted} 
                            onClick={(e)=>this.handleSignIn(e)}>
                                Log in
                            </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default withRouter(LandingSignin);
