import React from "react";
import { uploadImg } from "../../utils";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
// var emojione = require('emojione');
let swal = require("sweetalert");

export default class ChatEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            imgs: []
        };
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({ text: emojione.shortnameToUnicode(e.target.value) });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (e.key === "Enter" || e.button === 0) {
            if (this.state.text.trim() !== "" || this.state.imgs.length != 0) {
                this.props.onPost(this.state.text.trim(), this.state.imgs);
                this.setState({ text: "", imgs: [] });
            }
        }
    }

    componentDidMount() {
        $("#chattext").jemoji({
            folder: "emojis/",
            btn: $("#openchatemoji"),
            container: $("#chattext")
                .parent()
                .parent(),
            navigation: false
        });
    }

    render() {
        return (
            <div className="panel-footer">
                <div className="row">
                    <div className="col-md-10 col-xs-10 col-sm-10">
                        <textarea
                            id="chattext"
                            className="form-control msg nohover non-active"
                            name="name"
                            rows="5"
                            value={this.state.text}
                            onChange={e => this.handleChange(e)}
                            onFocus={e => this.handleChange(e)}
                            cols="40"
                            placeholder="please type text"
                            onKeyUp={e => this.handleSubmit(e)}
                        />

                        <div
                            className="btn-group"
                            role="group"
                            aria-label="..."
                        >
                            <label
                                htmlFor="pics"
                                style={{ marginRight: "20px" }}
                            >
                                <a>
                                    <i
                                        className="fa fa-camera"
                                        aria-hidden="true"
                                    />
                                </a>
                            </label>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.gif"
                                id="pics"
                                multiple
                                onChange={e =>
                                    uploadImg(
                                        e,
                                        () => {
                                            swal(
                                                "Error",
                                                "Only 3 images at a time please",
                                                "error"
                                            );
                                        },
                                        () => {
                                            swal(
                                                "Error",
                                                "File size is too large",
                                                "error"
                                            );
                                        },
                                        () => {
                                            swal(
                                                "Error",
                                                "File type is wrong",
                                                "error"
                                            );
                                        },
                                        res => {
                                            var imgs = this.state.imgs;
                                            imgs.push(res.target.result);
                                            this.setState({
                                                imgs: imgs
                                            });
                                        }
                                    )
                                }
                            />
                            <a id="openchatemoji">
                                <span>
                                    <i
                                        className="far fa-smile"
                                        aria-hidden="true"
                                    />
                                </span>
                            </a>
                        </div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2 send">
                        <button
                            type="button"
                            className="btn btn-default btn-blue-grey pull-right"
                            name="button"
                            onClick={e => this.handleSubmit(e)}
                        >
                            Send
                        </button>
                    </div>
                </div>
                <div className="row">
                    <GridList cellHeight={160} cols={3}>
                        {this.state.imgs.map((img, idx) => {
                            return (
                                <GridListTile key={idx}>
                                    <img src={img} />
                                </GridListTile>
                            );
                        })}
                    </GridList>
                </div>
            </div>
        );
    }
}
