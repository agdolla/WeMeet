import React from "react";
import ReactDOM from "react-dom";
import Loadable from "react-loadable";
import { Router, Route, Switch } from "react-router-dom";
import {
    getUserId,
    isUserLoggedIn,
    socket,
    updateCredentials
} from "./utils/credentials";
import history from "./utils/history";
import { getUserData } from "./utils";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

// const debug = require('react-debug');
// const swal = require('sweetalert');

const LoadableLanding = Loadable({
    loader: () => import("./components/layouts/landing"),
    loading: Loading
});

const LoadableActivity = Loadable({
    loader: () => import("./components/layouts/activity"),
    loading: Loading
});

const LoadableSettings = Loadable({
    loader: () => import("./components/layouts/settings"),
    loading: Loading
});

const LoadableActivityDetail = Loadable({
    loader: () => import("./components/layouts/activityDetail"),
    loading: Loading
});

const LoadablePost = Loadable({
    loader: () => import("./components/layouts/post"),
    loading: Loading
});

const LoadableCreateActivity = Loadable({
    loader: () => import("./components/layouts/createActivity"),
    loading: Loading
});

const LoadableProfile = Loadable({
    loader: () => import("./components/layouts/profile"),
    loading: Loading
});

const LoadableSearch = Loadable({
    loader: () => import("./components/layouts/search"),
    loading: Loading
});

const LoadableNotification = Loadable({
    loader: () => import("./components/layouts/notification"),
    loading: Loading
});

const LoadableChat = Loadable({
    loader: () => import("./components/layouts/chat"),
    loading: Loading
});

function Loading(props) {
    if (props.error) {
        return (
            <div>
                Error! <button onClick={props.retry}>Retry</button>
            </div>
        );
    } else {
        return <div>Loading...</div>;
    }
}

const theme = createMuiTheme({
    typography: {
        fontFamily: "inherit !important"
    },
    overrides: {
        MuiInput: {
            underline: {
                "&:after": {
                    borderBottomColor: "#90A4AE"
                }
            }
        }
    }
});

class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Switch>
                    <Route exact path="/" component={LoadableLanding} />
                    <WeMeet />
                </Switch>
            </MuiThemeProvider>
        );
    }
}

class WeMeet extends React.Component {
    componentDidMount() {
        let isFacebook = this.props.location.search !== "";
        if (isFacebook) {
            const rawData = new URLSearchParams(this.props.location.search).get(
                "data"
            );
            var data = JSON.parse(rawData);
            updateCredentials(data.user);
            history.push("/");
        }
        if (!isUserLoggedIn()) {
            history.push("/");
            location.reload();
            return;
        }
        let userId = getUserId();
        window.onload = () => {
            socket.emit("user", userId);
        };
        getUserData(userId).then(response => {
            this.setState(response.data);
        });
    }

    componentDidUpdate() {
        if (!isUserLoggedIn()) {
            history.push("/");
            location.reload();
        }
    }

    render() {
        if (this.state === null) return null;
        return (
            <Switch>
                <Route
                    path="/post"
                    component={() => {
                        return <LoadablePost user={this.state} />;
                    }}
                />
                <Route
                    path="/activity"
                    component={() => {
                        return <LoadableActivity user={this.state} />;
                    }}
                />
                <Route
                    path="/settings"
                    component={() => {
                        return <LoadableSettings user={this.state} />;
                    }}
                />
                <Route
                    path="/chat"
                    component={() => {
                        return <LoadableChat user={this.state} />;
                    }}
                />
                <Route
                    path="/notification"
                    component={() => {
                        return <LoadableNotification user={this.state} />;
                    }}
                />
                <Route
                    path="/profile/:user"
                    component={props => {
                        return (
                            <LoadableProfile
                                {...props}
                                user={props.match.params.user}
                                currUser={this.state}
                            />
                        );
                    }}
                />
                <Route
                    path="/activityDetail/:id"
                    component={props => {
                        return (
                            <LoadableActivityDetail
                                {...props}
                                activityId={props.match.params.id}
                                user={this.state}
                            />
                        );
                    }}
                />
                <Route
                    path="/search"
                    component={() => {
                        return <LoadableSearch user={this.state} />;
                    }}
                />
                <Route
                    path="/createActivity"
                    component={() => {
                        return <LoadableCreateActivity user={this.state} />;
                    }}
                />
                <Route
                    path="*"
                    component={() => {
                        return <LoadableActivity user={this.state} />;
                    }}
                />
            </Switch>
        );
    }
}

//render main
ReactDOM.render(
    <Router history={history}>
        <Route path="/" component={App} />
    </Router>,
    document.getElementById("container")
);
