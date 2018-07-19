'use strict'
import React, { Component } from 'react';
import Modal from './Modal';
class Popup extends Component{
    constructor(...props){
        super(...props);
        this._configs = {};
        this._contents = [];
    }
    _renderContent(){
        var configs = this._configs;
        return this._contents.map((id)=>{
            let config = configs[id];
            return (
                <Modal 
                    key = {id}
                    children = {config.content}
                    isVisible = {config.isVisible}
                    backgroundColor = {config.backgroundColor}
                    onBackdropPress = {()=>this._onBackdropPress(id)}
                    onModalShow={()=>this._onModalShow(id)}
                    onModalClose={()=>this._onModalClose(id)}
                    />
            );
        })
    }
    _onBackdropPress(id){
        var config = this._configs[id];
        var onBackdropPress = config.onBackdropPress;
        if(!onBackdropPress||!onBackdropPress()){
            config.isVisible = false;
            this.forceUpdate();
        };
    }
    _onModalShow(id){
        var config = this._configs[id];
        config.onModalShow && config.onModalShow();
    }
    _onModalClose(id){
        var config = this._configs[id];
        config.onModalClose && config.onModalClose();
        this._contents.splice(this._contents.indexOf(id),1);
        delete this._configs[id];
        this.forceUpdate();
    }
    showContent(config){
        config.isVisible = true;
        this._configs[config.id] = config;
        this._contents.push(config.id);
        this.forceUpdate();
    }
    hideContent(id){
        var config = this._configs[id];
        config.isVisible = false;
        this.forceUpdate();
    }
    render(){
        if(this._contents.length==0){
            return null;
        }else{
            return (
                <div>
                    {this._renderContent()}
                </div>
            )
        }
    }
}
export default Popup;