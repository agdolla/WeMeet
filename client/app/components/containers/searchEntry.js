import React from 'react';
import {searchquery} from '../../utils';
import {ActivityFeedItem} from '../presentations';
import {SearchFeedUserFeedItem} from '../presentations';
import {PostFeedItem} from '../presentations';
//mui
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';


// var debug = require('react-debug');

export default class SearchEntry extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: "",
            searchDataResult:{},
            title: ""
        }
    }
    handleChange(e) {
        e.preventDefault();
        this.setState({ value: e.target.value });
    }

    handleKeyUp(e) {
        e.preventDefault();
        if (e.key === "Enter") {
            var query = this.state.value.trim();
            if (query !== "") {
                searchquery(query)
                .then(response=>{
                    let searchData = response.data;
                    this.setState({
                        searchDataResult:searchData,
                        title: "Search result for "+query+": "
                    });
                });
            }
        }
    }


render(){
    return(
        <div>
            <div className="panel panel-default">
                <div className="panel-heading">
                    <div className="media">
                        <div className="media-body">
                            <FormControl style={{width:'100%', marginBottom:'10px', paddingTop: '8px'}}>
                                <InputLabel
                                style={{color:'#607D8B'}}
                                htmlFor="search">
                                Search...
                                </InputLabel>
                                <Input
                                style={{paddingBottom: '5px'}}
                                id="search"
                                value={this.state.value}
                                onChange={(e)=>this.handleChange(e)}
                                onKeyUp={(e)=>this.handleKeyUp(e)}
                                type="search"
                                />
                            </FormControl>
                        </div>
                    </div>
                </div>
            </div>
            <h4 style={{marginBottom:'10px'}}>{this.state.title}</h4>
            {
                this.state.searchDataResult.users=== undefined ? [] : this.state.searchDataResult.users.map((user,i)=>{
                    return (
                    <SearchFeedUserFeedItem key={i} data={user} currentUser={this.props.user}/>
                    )
                })
            }

            {
                this.state.searchDataResult.activities === undefined ? [] : this.state.searchDataResult.activities.map((activity,i)=>{
                    return (
                    <ActivityFeedItem key={i} data={activity}/>
                    )
                })
            }
            {
                this.state.searchDataResult.posts === undefined ? [] : this.state.searchDataResult.posts.map((post,i)=>{
                    return (
                    <PostFeedItem key={i} data={post} currentUser={this.props.user._id}/>
                    )
                })
            }
        </div>
    );
}
}
