import React from 'react';
import {Link} from 'react-router';
import {hideElement} from '../util';
// var debug = require('react-debug');

export default class PostEntry extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      text: "",
      img: [],
      fileTooLarge:false,
      fileWrongType:false
    }
  }

  handleChange(e){
    e.preventDefault();
    this.setState({text:e.target.value});
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

  uploadImg(e){
    e.preventDefault();
    var files = e.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0; i<files.length; i++) {
      var file = files[i];

      if(file.size > 1500000){
        return this.setState({
          fileTooLarge:true
        })
      }
      else if(!file.type.match('image.*')){
        return this.setState({
          fileWrongType:true
        })
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (() => {
        return (e) => {
          var img = this.state.img;
          img.push(e.target.result);
          this.setState({
            img:img
          })
        };
      })(file);

      // Read in the image file as a data URL.
      reader.readAsDataURL(file);
    }
  }

  render(){
    return(
      <div className="panel panel-default post-send">
        <div className="panel-heading">
          <div className="media">
            <div className="media-left">
              <Link to={"profile/"+this.props.userData._id}>
                <img className="media-object" src={this.props.userData.avatar} height="50px" alt="..."></img>
              </Link>
            </div>
            <div className="media-body">
              <textarea name="name" rows="8" cols="40" placeholder="What's on your mind"
                value={this.state.text} onChange={(e)=>this.handleChange(e)}></textarea>
              <div className="btn-group" role="group" aria-label="...">
                <label htmlFor="pic">
                  <a><i className="fa fa-camera" aria-hidden="true"></i></a>
                </label>
                <input type="file" accept=".jpg,.jpeg,.png,.gif" id="pic" onChange={(e)=>this.uploadImg(e)} multiple></input>
              </div>
              <button type="button" className="btn btn-blue-grey pull-right" name="button" onClick={(e)=>this.handlePost(e)}>Submit</button>
            </div>
            <div className="media-footer">
              <div className={"alert alert-warning alert-dismissible "+hideElement(!this.state.fileWrongType)} role="alert">
                <strong>File is not a image file</strong>
              </div>
              <div className={"alert alert-warning alert-dismissible "+hideElement(!this.state.fileTooLarge)} role="alert">
                <strong>File is too large</strong>
              </div>
              <div className="postImg">
                {
                  this.state.img.map((element, index) =>{
                    return(
                        <a style={{"width":"calc("+(100/(this.state.img.length>2?2:this.state.img.length))+"% - 4px)"}}>
                          <img src={element} key={index} alt="" style={{'width':"100%"}}/>
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
