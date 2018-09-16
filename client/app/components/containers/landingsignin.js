import React from 'react'
import {withRouter} from 'react-router-dom';
import {hideElement} from '../../utils';
import {login} from '../../utils';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


class LandingSignin extends React.Component{
    constructor(props){
        super(props);
        this.state={
            signInEmail:"",
            signInPass:"",
            failedLogin:false,
            submitted:false,
            open: false
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.open !== prevProps.open) {
            this.setState({
                open: this.props.open
            })
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
            <Dialog
            open={this.state.open}
            onClose={this.props.handleClose('loginOpen')}>
                <DialogTitle>{"Log in"}</DialogTitle>
                <DialogContent>
                    <div className={"alert alert-danger " + hideElement(!this.state.failedLogin)} role="alert">
                        <strong>Invalid email address or password.</strong>
                        <br/>
                        Please try a different email address or password, and try logging in again.
                        </div>
                    <FormControl style={{width:'100%', marginBottom: '20px'}}>
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
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" style={{fontSize:'14px'}} className='pull-right' disabled={this.state.submitted} 
                        onClick={(e)=>this.handleSignIn(e)}>
                            Log in
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withRouter(LandingSignin);
