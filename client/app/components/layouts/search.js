import React from 'react';
import {SearchEntry} from '../containers';
import {Navbar} from '../containers';
import {getUserData} from '../../utils';

export default class Search extends React.Component{
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
            <div className="search" style={{marginTop:'70px'}}>
                <Navbar search="active" user={this.state}/>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 col-md-offset-2 main-feed">
                            <SearchEntry user={this.state}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
