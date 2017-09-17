import React from 'react';
import {hashHistory} from 'react-router';





import {getUserData} from '../../utils';

import {Navbar} from '../containers';

import {PostActivityFeed} from '../containers'


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
                userData: userData
            })
        });
    }
    componentDidMount(){
        this.getData();
    }


    render() {
        return (
            <div className='postactivity' style={{marginTop:'70px'}}>
                <Navbar user={this.state.userData}/>
                <PostActivityFeed user={this.props.user} />
            </div>
        )
    }
}
