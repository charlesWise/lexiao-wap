'use strict'
import React,{Component} from 'react';


class Button extends Component{
    constructor(...props){
        super(...props);
    }
    render(){
        var child = this.props.child;  
        
        var style = {
            ...this.props.style,
            ...child.props&&child.props.style||{}
        }
        var props = {
            ...this.props,
            style
        }   
        return React.cloneElement(child,props);
    }
}

export default Button;