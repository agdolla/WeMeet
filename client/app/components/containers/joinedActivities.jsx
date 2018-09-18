import React, { Component } from "react";
import Link from "react-router-dom/Link";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getJoinedActivity } from "../../utils/activityitem";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";

// const debug = require("react-debug");
const moment = require("moment");

class JoinedActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activities: [],
      currentTime: new Date().getTime()
    };
  }

  componentDidMount() {
    getJoinedActivity(this.props.userId).then(res => {
      this.setState({
        activities: res.data
      });
    });

    setInterval(this.tick, 1000);
  }

  tick = () => {
    this.setState({
      currentTime: new Date().getTime()
    });
  };

  componentWillUnmount() {
    clearInterval(this.tick, 1000);
  }

  render() {
    return this.state.activities.length === 0 ? (
      <Card
        style={{
          boxShadow: "0 10px 28px 0 rgba(137,157,197,.12)"
        }}
      >
        <CardContent>
          <h4>You have no upcoming activities</h4>
        </CardContent>
      </Card>
    ) : (
      <div style={{ marginBottom: 30 }}>
        {this.state.activities.map((activity, i) => {
          const timeDiff = activity.startTime - this.state.currentTime;
          if (timeDiff <= 0) {
            return null;
          }
          const duration = moment.duration(timeDiff, "milliseconds");
          const days = moment.duration(duration).days();
          const hours = moment.duration(duration).hours();
          const minutes = moment.duration(duration).minutes();
          const seconds = moment.duration(duration).seconds();
          const color = days === 0 ? "#ef5350" : "black";
          const isHost = activity.author === this.props.userId;

          return (
            <ExpansionPanel
              key={i}
              style={{
                boxShadow: "0 10px 28px 0 rgba(137,157,197,.12)"
              }}
            >
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container spacing={24} alignItems={"center"}>
                  <Grid item sm>
                    <h3 style={{ fontWeight: "bold" }}>
                      {isHost && (
                        <Icon
                          style={{ marginRight: 5 }}
                          className="fas fa-user"
                        />
                      )}
                      {activity.title}
                    </h3>
                  </Grid>
                  <Grid item sm>
                    <Chip
                      avatar={
                        <Avatar>
                          <Icon
                            style={{
                              fontSize: "20px",
                              color: color
                            }}
                            className="fas fa-clock"
                          />
                        </Avatar>
                      }
                      label={
                        <h4>
                          {days +
                            " : " +
                            hours +
                            " : " +
                            minutes +
                            " : " +
                            seconds}
                        </h4>
                      }
                    />
                  </Grid>
                </Grid>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Card style={{ width: "100%" }}>
                  <Link to={"/activityDetail/" + activity._id}>
                    <CardActionArea style={{ width: "100%" }}>
                      <CardMedia
                        style={{ height: "300px" }}
                        image={activity.img}
                      />
                    </CardActionArea>
                  </Link>
                  <CardContent>
                    <h4>{activity.contents.text}</h4>
                    <Chip
                      avatar={
                        <Avatar>
                          <Icon
                            style={{ fontSize: "20px" }}
                            className="fas fa-location-arrow"
                          />
                        </Avatar>
                      }
                      label={activity.location}
                    />
                  </CardContent>
                </Card>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}
      </div>
    );
  }
}

export default JoinedActivity;
