'use strict'
import React,{Component} from 'react';
class Content extends Component{
    constructor(...props){
        super(...props);
        this.state = {
            header:this.props.header
        }
    }
    update(state){
        if(state.header===this.state.header){
            return;
        }
        this.setState(state);
    }
    render(){
        var style = this.state.header===null?{top:0}:{};
        if(!this.props.child){
            return null;
        }
        var child = React.cloneElement(this.props.child,{
            className:'screen-content '+(this.props.child.props.className||''),
            style:{
                ...this.props.child.props.style,
                ...style
            }
        })
        return child;
    }
}
export default Content;