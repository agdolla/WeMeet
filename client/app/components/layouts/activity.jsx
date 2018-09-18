import React, { Component } from "react";
import Link from "react-router-dom/Link";
import { ActivityFeed } from "../containers";
import { Navbar } from "../containers";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import JoinedActivity from "../containers/joinedActivities";

export default class Activity extends Component {
    render() {
        return (
            <div style={{ marginTop: "70px" }}>
                <Navbar activity="active" user={this.props.user} />
                <div className="container index">
                    <Link to="/createActivity" className="c-btn">
                        <Button
                            variant="fab"
                            style={{
                                backgroundColor: "#607D8B",
                                color: "white"
                            }}
                            aria-label="Add"
                        >
                            <AddIcon />
                        </Button>
                    </Link>
                    <div className="row">
                        <div className="col-md-5">
                            <JoinedActivity userId={this.props.user._id} />
                        </div>
                        <div className="col-md-7">
                            <ActivityFeed />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
