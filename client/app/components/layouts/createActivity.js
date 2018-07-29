import React from 'react';
import {Navbar} from '../containers';
import {CreateActivityFeed} from '../containers';
import {getUserData} from '../../utils';
// let debug = require('react-debug');

export default class CreateActivity extends React.Component {
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
        return (
            <div className='createActivity' style={{marginTop:'70px'}}>
                <Navbar user={this.state.userData}/>
                <CreateActivityFeed user={this.state.userData} />
            </div>
        )
    }
}
