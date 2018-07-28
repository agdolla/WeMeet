import React from 'react';
import {Navbar} from '../containers';
import {PostActivityFeed} from '../containers';
import {getUserData} from '../../utils';
let debug = require('react-debug');

export default class PostActivity extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userData: {}
        }
    }

    getData(){
        getUserData(this.props.user,(userData)=>{
            this.setState({
                userData:userData
            });
        });
    }

    componentDidMount(){
        this.getData();
    }

    render() {
        debug(this.props);
        return (
            <div className='postactivity' style={{marginTop:'70px'}}>
                <Navbar user={this.state.userData}/>
                <PostActivityFeed user={this.state.userData} />
            </div>
        )
    }
}
