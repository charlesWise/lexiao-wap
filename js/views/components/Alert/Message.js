'use strict'
import React,{Component} from 'react';

class Message extends Component{
    constructor(...props){
        super(...props);
    }
    render(){
        if(!this.props.text){
            return null
        }else{
            return (
                <p 
                    className = 'screenui-alertui-message'
                    children = {this.props.text}
                    />
            );
        }
        return
    }
}

export default Message;