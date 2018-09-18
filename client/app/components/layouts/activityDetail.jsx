import React from "React";
import { Navbar } from "../containers";
import { ActivityDetailBody } from "../containers";

export default class ActivityDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{ marginTop: "70px" }}>
                <Navbar activity="active" user={this.props.user} />
                <ActivityDetailBody
                    id={this.props.activityId}
                    avatar={this.props.user.avatar}
                    currentUser={this.props.user._id}
                    friends={this.props.user.friends}
                />
            </div>
        );
    }
}
