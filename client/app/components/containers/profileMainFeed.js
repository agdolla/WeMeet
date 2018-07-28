import React from 'react';

export default class ProfileMainFeed extends React.Component{

    constructor(props){
        super(props);
        this.state = props.user;
    }

    componentWillReceiveProps(newProps){
        this.setState(newProps.user);
    }

    render(){
            return(
                <div className="panel panel-default main-panel">
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-md-4">
                                <center>
                                    <img src={this.state.avatar} alt="" />
                                </center>
                            </div>
                            <div className="col-md-8">
                                <div className="media" style={{textAlign:'center'}}>
                                    <h3>{this.state.fullname}</h3>
                                    {this.state.description}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
