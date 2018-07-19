'use strict'
import React,{Component} from 'react';

class Toast extends Component{
    constructor(...props){
        super(...props);
        this.state = {
            message:'',
            customStyle: {}
        }
        this._timeout
    }
    componentWillUnmount() {
        this._clear();
    }
   
    _clear(){
        clearTimeout(this._timeout);
    }
    _close=(duration,callback)=>{
        duration = duration||2000;
        this._timeout =  setTimeout(()=>{
            this.setState({message:''});
            callback && callback();
        },duration)
    }
    show(message,duration,callback,customStyle){
        if(message=='404'||!message||message=='请登录'){
            return;
        }
        this._clear();
        this.setState({message, customStyle});
        this._close(duration,callback);
    }
    render(){
        if(this.state.message){
            if(!!this.state.customStyle&&Object.keys(this.state.customStyle).length>0) {
                return <p className = 'screenui-toast' style={this.state.customStyle} children = {this.state.message}/>
            }else {
                return <p className = 'screenui-toast' children = {this.state.message}/>
            }
        }else{
            return null;
        }
        
    }
}

export default Toast;