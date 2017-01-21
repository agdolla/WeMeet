import React from 'react';
import {searchquery} from '../server';
import ActivityFeedItem from '../activity/activityFeedItem';
import SearchFeedUserFeedItem from './searchFeedUserFeedItem';
import PostFeedItem from '../post/postFeedItem';
import TextField from 'material-ui/TextField';

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
        searchquery(query,(searchData)=>
            this.setState(
              {
                searchDataResult:searchData,
                title: "Search result for "+query+": "
              }
            )
        )
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
                  <TextField
                    hintText="Search..."
                    floatingLabelText="Welcome to We Meet, please search"
                    style={{width:'100%'}}
                    onChange={(e)=>this.handleChange(e)}
                    onKeyUp={(e)=>this.handleKeyUp(e)}
                    floatingLabelStyle={{color:'#607D8B'}}
                    underlineFocusStyle={{borderColor:'#90A4AE'}}
                  />
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
