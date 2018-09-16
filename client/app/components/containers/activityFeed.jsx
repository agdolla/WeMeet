import React from 'react';
import Link from "react-router-dom/Link";
import { ActivityFeedItem } from '../presentations';
import { getAllActivities, isBottom } from '../../utils';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { socket } from '../../utils/credentials';
// var debug = require('react-debug');


export default class ActivityFeed extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            contents: [],
            moreToLoad: true,
            submitted: false,
            loading: true,
            new: false
        }
    }

    handleLoad(init) {
        document.removeEventListener('scroll', this.trackScrolling);
        if (init) {
            this.setState({
                new: false,
                loading: true
            })
        } else {
            this.setState({
                loading: false,
            });
        }
        var date = init || this.state.contents.length === 0 ? (new Date()).getTime() :
            this.state.contents[this.state.contents.length - 1].postDate;
        getAllActivities(date)
            .then(response => {
                let activities = response.data;
                if (activities.length === 0) {
                    return this.setState({
                        moreToLoad: false,
                        loading: false,
                    })
                }
                var newActivities = (init ? [] : this.state.contents).concat(activities);
                this.setState({
                    contents: newActivities,
                    moreToLoad: true,
                    loading: false,
                }, () => {
                    document.addEventListener('scroll', this.trackScrolling);
                });

            })
    }

    componentDidMount() {
        this.handleLoad(true);
        socket.on('newActivity', this.onNewActivity);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
        socket.removeEventListener('newActivity', this.onNewActivity);
    }

    onNewActivity = () => {
        this.setState({
            new: true
        });
    }

    handleNew = () => {
        this.handleLoad(true);
        window.scrollTo(0, 0);
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if(JSON.stringify(this.state.contents) !== JSON.stringify(prevState.contents))
    //         this.getData;
    // }


    trackScrolling = () => {
        let wrappedElement = document.getElementById('activityFeed');
        if (wrappedElement !== null && isBottom(wrappedElement)) {
            this.handleLoad(false);
        }
    }

    render() {
        return (
            <div id="activityFeed">
                {this.state.new &&
                    <Button variant="extendedFab" color="primary" style={{
                        position: 'fixed',
                        zIndex: 100,
                        left: '45%'
                    }} onClick={this.handleNew}>
                        <Icon style={{ marginRight: '5px' }} className="fas fa-arrow-alt-circle-up" />
                        new activities
                    </Button>
                }

                {
                    this.state.loading && <div style={{ textAlign: 'center', color: '#61B4E4', marginTop: '30px', marginBottom: '30px' }}>
                        <CircularProgress size={30} />
                    </div>
                }
                {
                    !this.state.loading && this.state.contents.length === 0 ?
                        <div className="alert alert-info" role="alert">
                            No one has posted any activities yet.
                            Post your first activity
                        <Link to="/createActivity">
                                <strong>
                                    here
                            </strong>
                            </Link>
                        </div>
                        : this.state.contents.map((activityFeedItem) => {
                            return <ActivityFeedItem key={activityFeedItem._id} data={activityFeedItem} />
                        })
                }
                {
                    !this.state.moreToLoad &&
                    <div style={{ marginTop: '30px', marginBottom: '30px', textAlign: 'center' }}>
                        Nothing more to load
                    </div>
                }
            </div>
        );
    }
}
