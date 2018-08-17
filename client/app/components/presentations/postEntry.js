import React from 'react';
import {Link} from 'react-router-dom';
import {uploadImg} from '../../utils';

// var debug = require('react-debug');
var emojione = require('emojione');
let swal = require('sweetalert');

export default class PostEntry extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            text: "",
            img: [],
            fileTooLarge:false,
            fileWrongType:false,
            tooManyFiles: false
        }
    }

    handleChange(e){
        e.preventDefault();
        this.setState({text:emojione.shortnameToUnicode(e.target.value)});
    }

    handlePost(e){
        e.preventDefault();
        var text = this.state.text.trim();
        if(text !== ""){
            this.props.onPost(text,this.state.img);
            this.setState(
                {
                    text:"",
                    img:[]
                }
            );
        }
    }

    componentDidMount(){
        $('#inputtext').jemoji({
            folder: 'emojis/',
            btn: $('#openEmoji'),
            container:  $('#inputtext').parent()
        });
    }

    render(){
        return(
            <div className="panel panel-default post-send">
                <div className="panel-heading">
                    <div className="media">
                        <div className="media-left">
                            <Link to={"/profile/"+this.props.userData._id}>
                                <img className="media-object" src={this.props.userData.avatar} height="50px" alt="..."></img>
                            </Link>
                        </div>
                        <div className="media-body">
                            <textarea name="name" id="inputtext" rows="8" cols="40" placeholder="What's on your mind"
                            value={this.state.text} onChange={(e)=>this.handleChange(e)} onFocus={(e)=>this.handleChange(e)}></textarea>
                            <div className="btn-group" role="group" aria-label="...">
                                <label htmlFor="pic">
                                    <a><i className="fa fa-camera" aria-hidden="true"></i></a>
                                </label>
                                <input type="file" accept=".jpg,.jpeg,.png,.gif" id="pic" onChange={(e)=>
                                    uploadImg(e,()=>{
                                        swal("Error", "Only 3 images at a time please", "error");
                                    },()=>{
                                        swal("Error", "File size is too large", "error");
                                    },()=>{
                                        swal("Error", "File type is wrong", "error");
                                    },(res)=>{
                                        var img = this.state.img;
                                        img.push(res.target.result);
                                        this.setState({
                                            img:img
                                        })
                                    })} multiple></input>
                                <a id="openEmoji"><span><i className="fa fa-lg fa-smile-o" aria-hidden="true"></i></span></a>
                            </div>
                            <button type="button" className="btn btn-blue-grey pull-right" name="button" onClick={(e)=>this.handlePost(e)}>Submit</button>
                        </div>
                        <div className="media-footer">
                            <div className="postImg">
                                {
                                    this.state.img.map((element, index) =>{
                                        return(
                                        <a key={index} style={{"width":"calc("+(100/(this.state.img.length>2?2:this.state.img.length))+"% - 4px)"}}>
                                            <img src={element} alt="" style={{'width':"100%"}}/>
                                        </a>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
