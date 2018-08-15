import React from 'react';
import {getPostFeedData} from '../../utils';
import {PostFeedItem} from '../presentations';
import Button from '@material-ui/core/Button';

export default class ProfileRecentPostFeed extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            contents: [],
            loadMore: true
        };
    }

    getData(user, refreshed){
        let count = refreshed? 0: this.state.contents.length
        getPostFeedData(user, count)
        .then(response=>{
            let activities = refreshed?response.data.contents:this.state.contents.concat(response.data.contents);
            this.setState({
                contents:activities,
                loadMore: response.data.contents.length > 0
            });
        });
    }

    componentDidMount(){
        this.getData(this.props.user);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.user !== this.props.user){
            this.getData(this.props.user,true);
        }
    }


    render(){
        return(
            <div style={{marginTop: '15px', marginBottom: '20px'}}>
                {this.state.contents.map((postItem)=>{
                    return <PostFeedItem key={postItem._id} data={postItem} currentUser={this.props.currentUser}/>
                })}
                {
                    <Button onClick={()=>{this.getData(this.props.user,false)}} 
                    fullWidth style={{backgroundColor:"#fdfdfd"}}
                    disabled={!this.state.loadMore}>
                        {this.state.loadMore? "Load More" : "Nothing more to load"}
                    </Button>
                }
            </div>
        );
    }
}
