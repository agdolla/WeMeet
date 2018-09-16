import React from 'react';
import { withRouter } from 'react-router-dom';
import { createActivity } from '../../utils';
import { socket } from '../../utils/credentials';
import { hideElement } from '../../utils';
import Cropper from 'react-cropper';
import 'node_modules/cropperjs/dist/cropper.css';
//mui
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { DateTimePicker } from 'material-ui-pickers';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

// var debug = require('react-debug');
var swal = require('sweetalert');

class CreateActivityFeed extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: 1,
            title: "",
            img: null,
            cropperOpen: false,
            startTime: null,
            endTime: null,
            description: "",
            location: "",
            detail: "",
            alert: false,
            sizealert: false,
            fileWrongType: false,
        }
    }

    handleFile(e) {
        e.preventDefault();
        // Read the first file that the user selected (if the user selected multiple
        // files, we ignore the others).
        var reader = new FileReader();
        var file = e.target.files[0];
        if (!file.type.match('image.*')) {
            this.setState({ fileWrongType: true });
        }
        else if (file.size < 1100000) {
            // Called once the browser finishes loading the image.
            reader.onload = (upload) => {
                this.setState({
                    img: upload.target.result,
                    cropperOpen: true
                });
            };
            reader.readAsDataURL(file);
            this.setState({ sizealert: false });
            this.setState({ fileWrongType: false });
        }
        else {
            this.setState({ sizealert: true });
        }
    }

    handleFileClick(e) {
        e.target.value = null;
    }

    handleRequestHide = () => {
        this.setState({
            cropperOpen: false,
            img: null
        })
    }

    handleCrop = () => {
        this.setState({
            cropperOpen: false,
            img: this.refs.cropper.getCroppedCanvas().toDataURL()
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.type !== "------Select a Activity Type-----" &&
            this.state.title.trim() !== "" &&
            this.state.startTime !== null &&
            this.state.endTime !== null &&
            this.state.description.trim() !== "" &&
            this.state.location.trim() !== "" &&
            this.state.detail.trim() !== ""
        ) {
            //activity created succesfully
            var data = Object.assign({}, this.state);
            data.userData = this.props.user;
            var type = "";
            switch (data.type) {
                case 1:
                    type = "Event";
                    break;
                case 2:
                    type = "Entertainment";
                    break;
                default:
                    type = "Study";
                    break;
            }
            data.type = type;
            createActivity(data)
                .then(response => {
                    return swal({
                        title: "Success",
                        icon: "success",
                        button: "OK",
                    });
                })
                .then(() => {
                    socket.emit('newActivity');
                    this.props.history.push('/activity');
                })
                .catch(err => {
                    return swal({
                        title: "Create Activity Failed",
                        icon: "error",
                        button: "OK"
                    });
                })
        }
        else {
            this.setState({ alert: true })
        }
    }

    handleTitle(e) {
        e.preventDefault();
        this.setState({
            title: e.target.value
        })
    }

    handleStartTime = (date) => {
        this.setState({
            startTime: date
        })
    }

    handleEndTime = (date) => {
        this.setState({
            endTime: date
        })
    }

    handleLocation(e) {
        e.preventDefault();
        this.setState({
            location: e.target.value
        })
    }
    handleDetail(e) {
        e.preventDefault();
        this.setState({
            detail: e.target.value
        })
    }

    handleEvent = (e) => {
        this.setState({
            type: e.target.value
        })
    }

    handleDescription(e) {
        e.preventDefault();
        this.setState({
            description: e.target.value
        })
    }

    render() {
        return (
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <div className="container">
                    {this.state.cropperOpen &&
                        <Dialog
                            open={this.state.cropperOpen}
                            onClose={this.handleRequestHide}>
                            <DialogTitle>Crop your image</DialogTitle>
                            <DialogContent>
                                <Cropper
                                    ref='cropper'
                                    src={this.state.img}
                                    style={{ height: 400, width: '100%' }}
                                    aspectRatio={18 / 9} />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleRequestHide} color="primary">
                                    Cancel
                            </Button>
                                <Button onClick={this.handleCrop} color="primary">
                                    Submit
                            </Button>
                            </DialogActions>
                        </Dialog>
                    }

                    <div className="row">
                        <div className="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
                            <h4><span style={{
                                "marginRight": '10px'
                            }}><i className="glyphicon glyphicon-list-alt" aria-hidden="true"></i></span>Create Activity</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 infos">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h4>Activity Info</h4>
                                            <div className={hideElement(!this.state.alert)}>
                                                <div className="alert alert-warning alert-dismissible" role="alert">
                                                    <strong>Please fill in blanks</strong>
                                                </div>
                                            </div>
                                            <div className={hideElement(!this.state.sizealert)}>
                                                <div className="alert alert-warning alert-dismissible" role="alert">
                                                    <strong>File is too large</strong>
                                                </div>
                                            </div>
                                            <div className={"alert alert-warning alert-dismissible " + hideElement(!this.state.fileWrongType)} role="alert">
                                                <strong>File is not a image file</strong>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <FormControl fullWidth style={{ marginBottom: '20px' }}>
                                                        <InputLabel
                                                            style={{ color: '#607D8B' }}
                                                            htmlFor="activityTitle">
                                                            Title
                                                    </InputLabel>
                                                        <Input
                                                            id="activityTitle"
                                                            value={this.state.title}
                                                            onChange={(e) => this.handleTitle(e)}
                                                        />
                                                    </FormControl>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <DateTimePicker fullWidth
                                                        style={{ marginBottom: '20px' }}
                                                        value={this.state.startTime}
                                                        onChange={this.handleStartTime}
                                                        label="Start Time"
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <DateTimePicker
                                                        fullWidth
                                                        style={{ marginBottom: '20px' }}
                                                        value={this.state.endTime}
                                                        onChange={this.handleEndTime}
                                                        label="End Time"
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <FormControl fullWidth style={{ marginBottom: '20px' }}>
                                                        <InputLabel
                                                            style={{ color: '#607D8B' }}
                                                            htmlFor="activityLocation">
                                                            Location
                                                    </InputLabel>
                                                        <Input
                                                            id="activityLocation"
                                                            value={this.state.location}
                                                            onChange={(e) => this.handleLocation(e)}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <div className="col-md-6">
                                                    <FormControl fullWidth style={{ marginBottom: '20px' }}>
                                                        <InputLabel style={{ color: '#607D8B' }} htmlFor="type">
                                                            Select the type of your activity
                                                    </InputLabel>
                                                        <Select
                                                            value={this.state.type}
                                                            onChange={this.handleEvent}
                                                            inputProps={{ id: 'type' }}>
                                                            <MenuItem value={1}>Event</MenuItem>
                                                            <MenuItem value={2}>Entertainment</MenuItem>
                                                            <MenuItem value={3}>Study</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <FormControl fullWidth style={{ marginBottom: '20px' }}>
                                                        <InputLabel
                                                            style={{ color: '#607D8B' }}
                                                            htmlFor="activityDescription">
                                                            Description
                                                    </InputLabel>
                                                        <Input multiline
                                                            rows='2'
                                                            id="activityDescription"
                                                            value={this.state.description}
                                                            onChange={(e) => this.handleDescription(e)}
                                                        />
                                                    </FormControl>
                                                    <FormControl fullWidth style={{ marginBottom: '20px' }}>
                                                        <InputLabel
                                                            style={{ color: '#607D8B' }}
                                                            htmlFor="activityDetails">
                                                            Details
                                                    </InputLabel>
                                                        <Input multiline
                                                            rows='4'
                                                            id="activityDetails"
                                                            value={this.state.detail}
                                                            onChange={(e) => this.handleDetail(e)}
                                                        />
                                                    </FormControl>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-footer">
                                        <div className="row">
                                            <div className="col-md-6 nopadding">
                                                <label type="button" className="btn btn-blue-grey pull-left" name="button">
                                                    Upload activity header <input type="file" style={{ "display": "none" }}
                                                        onClick={(e) => this.handleFileClick(e)} onChange={(e) => this.handleFile(e)} />
                                                </label>
                                            </div>
                                            <div className="col-md-6 nopadding">
                                                <button type="button" className="btn btn-blue-grey pull-right nomargin" onClick={(e) => this.handleSubmit(e)}>Submit</button>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <img src={this.state.img} style={{ marginTop: '20px' }} className={hideElement(this.state.cropperOpen)} width="100%" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MuiPickersUtilsProvider>
        )
    }
}

export default withRouter(CreateActivityFeed)
