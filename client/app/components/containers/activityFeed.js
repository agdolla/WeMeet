import React from 'react';
import Link from "react-router-dom/Link";
import {ActivityFeedItem} from '../presentations';
import {getAllActivities, isBottom} from '../../utils';
import CircularProgress from '@material-ui/core/CircularProgress';
// var debug = require('react-debug');


export default class ActivityFeed extends React.Component{

    constructor(props){
        super(props);
        this.state= {
            contents: [],
            moreToLoad:true,
            submitted:false,
            loading: true
        }
    }

    handleLoad(init){
        document.removeEventListener('scroll', this.trackScrolling);
        this.setState({
            loading:init
        });
        var date = init || this.state.contents.length===0?(new Date()).getTime():
        this.state.contents[this.state.contents.length-1].postDate;
        getAllActivities(date)
        .then(response=>{
            let activities = response.data;
            if(activities.length===0){
                return this.setState({
                    moreToLoad:false,
                    loading:false
                })
            }
            var newActivities = (init ? []:this.state.contents).concat(activities);
            this.setState({
                contents:newActivities,
                moreToLoad:true,
                loading:false
            },()=>{
                document.addEventListener('scroll', this.trackScrolling);
            });

        })
    }

    componentDidMount(){
        this.handleLoad(true);
    }

    componentWillUnmount(){
        document.removeEventListener('scroll', this.trackScrolling);
    }
    
    // componentDidUpdate(prevProps, prevState) {
    //     if(JSON.stringify(this.state.contents) !== JSON.stringify(prevState.contents))
    //         this.getData;
    // }
    

    trackScrolling = () => {
        let wrappedElement = document.getElementById('activityFeed');
        if (wrappedElement!==null && isBottom(wrappedElement)) {
          this.handleLoad(false);
        }
    }

    render(){
        return(
            <div id="activityFeed">
                {
                    this.state.loading? <div style={{textAlign:'center', color:'#61B4E4', marginTop:'30px', marginBottom:'30px'}}>
                    <CircularProgress size={30} />
                    </div>:<div></div>
                }
                {
                    !this.state.loading&&this.state.contents.length===0?
                    <div className="alert alert-info" role="alert">
                        No one has posted any activities yet.
                        Post your first activity 
                        <Link to="/createActivity">
                            <strong>
                             here
                            </strong>
                        </Link>
                    </div>
                    :this.state.contents.map((activityFeedItem)=>{
                        return <ActivityFeedItem key={activityFeedItem._id} data={activityFeedItem}/>
                    })
                }
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
