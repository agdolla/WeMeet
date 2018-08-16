import React from 'react';
import {Link} from 'react-router-dom';
import { ActivityFeed } from '../containers';
import { Navbar } from '../containers';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import {getUserData} from '../../utils';

export default class Activity extends React.Component{
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
        if(this.state === null) return null;
        return(
            <div style={{marginTop:'70px'}}>
                <Navbar activity="active" user={this.state}/>
                <div className="container index">
                    <Link to="/createActivity" className="c-btn">
                        <Button variant="fab" style={{backgroundColor:"#607D8B", color:'white'}} aria-label="Add">
                            <AddIcon />
                        </Button>
                    </Link>
                    <div className="row">
                        <div className="col-lg-8 col-lg-offset-2
                                        col-md-8 col-md-offset-2
                                        col-sm-8 col-sm-offset-2 col-xs-12">
                            <ActivityFeed/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
