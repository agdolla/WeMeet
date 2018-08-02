import React from 'react';
import {Link} from "react-router-dom";
import {ActivityFeedItem} from '../presentations';
import {getAllActivities, isBottom} from '../../utils';
// var debug = require('react-debug');


export default class ActivityFeed extends React.Component{

    constructor(props){
        super(props);
        this.state= {
            contents: [],
            moreToLoad:true,
            submitted:false
        }
    }

    getData(){
        getAllActivities((new Date()).getTime())
        .then(response=>{
            let activityFeedData = response.data;
            this.setState({
                contents:activityFeedData
            });
        })
    }

    handleLoadMore(){
        document.removeEventListener('scroll', this.trackScrolling);
        this.setState({
            submitted:true
        });
        var date = this.state.contents.length===0?(new Date()).getTime():
        this.state.contents[this.state.contents.length-1].postDate;
        getAllActivities(date)
        .then(response=>{
            let activities = response.data;
            if(activities.length===0){
                return this.setState({
                    moreToLoad:false,
                    submitted:false
                })
            }
            var newActivities = this.state.contents.concat(activities);
            this.setState({
                contents:newActivities,
                submitted:false
            },()=>{
                document.addEventListener('scroll', this.trackScrolling);
            });

        })
    }

    componentDidMount(){
        document.addEventListener('scroll', this.trackScrolling);
        this.getData();
    }

    componentWillUnmount(){
        document.removeEventListener('scroll', this.trackScrolling);
    }

    componentWillReceiveProps(){
        this.getData();
    }

    trackScrolling = () => {
        let wrappedElement = document.getElementById('activityFeed');
        if (isBottom(wrappedElement)) {
          this.handleLoadMore();
        }
    };

    render(){
        if(this.state.contents.length === 0){
            return(
                <div className="alert alert-info" role="alert">
                    No one has posted any activities yet.
                    Post your first activity
                    <Link to="/createActivity">
                        <strong>
                            here
                        </strong>
                    </Link>
                </div>
            );
        }
        return(
            <div id="activityFeed">
                {this.state.contents.map((activityFeedItem)=>{
                    return <ActivityFeedItem key={activityFeedItem._id} data={activityFeedItem}/>
                })}
                {
                    !this.state.moreToLoad &&
                    <div style = {{marginTop: '30px', marginBottom: '30px', textAlign: 'center'}}>
                        Nothing more to load
                    </div>
                }
            </div>
        );
    }
}
