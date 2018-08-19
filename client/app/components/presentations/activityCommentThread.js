import React from 'react';
import {ActivityDetailCommentEntry} from './';
import Button from '@material-ui/core/Button';

export default class ActivityCommentThread extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }


    render(){
        return(
            <div className = "container">
                <div className="row">
                    <div className="col-lg-10 col-md-12 col-sm-12 col-xs-12 col-lg-offset-1">
                        <div className="panel panel-default body-comments">
                            <div className="panel-heading">
                                <font style={{color:"grey",fontSize:"20px"}}>Comments (
                                    {this.props.count}
                                )</font>
                                <ActivityDetailCommentEntry user={this.props.user} avatar ={this.props.avatar} onPost={this.props.onPost}/>
                                <hr/>
                                <ul className="media-list">
                                    {React.Children.map(this.props.children,function(child){
                                        return (
                                        <li className="media">
                                            {child}
                                        </li>
                                        );
                                    })}
                                </ul>
                                {
                                    this.props.loadMore &&
                                    <Button fullWidth disabled={!this.props.loadMore || this.props.count===0 ||
                                    this.props.count===this.props.children.length} onClick={()=>this.props.onLoadComments()}>
                                        Load Comments
                                    </Button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
