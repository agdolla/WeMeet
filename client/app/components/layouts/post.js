import React from 'react';
import {PostFeed} from '../containers';
import {Navbar} from '../containers';
import {getUserData} from '../../utils'

export default class Post extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount() {
        getUserData(this.props.userId)
        .then(response=>{
            this.setState(response.data);
        })
    }
    
    render(){
        if(this.state===null) return null;
        return(
            <div style={{marginTop:'70px'}}>
                <Navbar post="active" user={this.state}/>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 main-feed">
                            <PostFeed user={this.state}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
