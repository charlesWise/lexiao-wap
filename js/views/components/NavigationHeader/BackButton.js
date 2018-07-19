'use strict'
import React,{Component} from 'react';
import Button from './Button';
import Bridge from './../../../util/bridge';
class BackButton extends Component{
    constructor(...props){
        super(...props);
    }
    _render(){
        return <div className='goback' onClick = {this._goBack}></div>
    }
    _goBack = ()=>{
        var navigation = this.props.navigation;
        var {routerState} = this.props.navigation;
        if(this.props.onBack){
            this.props.onBack(navigation);
        }else if(routerState.index==0){
            Bridge.goBack();
        }else{
            navigation.goBack();
        }  
    }
    render(){
        var {routerState} = this.props.navigation;
        if(routerState.index==0&&typeof LEXIAO_APP!=='undefined'){
            return null;
        }
        // if(routerState.index==0&&!Bridge.isAppClient){
        //     return null;
        // }
        return <Button child = {this._render()}/>
    }
}
export default BackButton;