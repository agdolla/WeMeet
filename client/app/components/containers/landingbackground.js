import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

export default class LandingBackground extends React.Component{


    handleClick(e){
        this.props.onclick(e)
    }

    render(){
        var btn_style={
          margin:'10px'
        }
        return(
            <div className="bg">
              <div className="text-vertical-center">
                <h1 style={{color:'white'}}><span><img src="../img/logo/mipmap-xxxhdpi/ic_launcher.png" width="70px"/></span> WeMeet</h1>
                <h2 style={{color:'white'}}>Join nearby activities and make friends!</h2>
                <br/>
                <RaisedButton onClick={(e)=>this.handleClick(e)} label="Sign up free today" backgroundColor='#607D8B' labelColor="white" style={btn_style}/>
                <RaisedButton onClick={(e)=>this.handleClick(e)} label="Log in" primary={true} labelColor="white" style={btn_style}/>
                <RaisedButton href="/auth/facebook" label="FACEBOOK"
                icon={<i className="fa fa-facebook" aria-hidden="true" style={{marginRight:'5px',color:'white'}}></i>}
                labelColor="white" style={btn_style} backgroundColor="#3b5998"/>
              </div>
            </div>
        )
    }


}