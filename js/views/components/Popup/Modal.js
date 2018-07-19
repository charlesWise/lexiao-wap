'use strict'
import React, { Component } from 'react';
import PropTypes from 'prop-types';
class Modal extends Component{
    static propsTypes = {
        isVisible:PropTypes.bool,
        backgroundColor:PropTypes.string,
        onBackdropPress:PropTypes.func,
        onModalShow:PropTypes.func,
        onModalClose:PropTypes.func
    }
    static defaultProps = {
        backgroundColor:'rgba(120,120,120,0.5)'
    }
    constructor(...props){
        super(...props);
    }
    componentDidMount() {
        if(this.props.isVisible){
            this._onModalShow();
        }
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.isVisible!==this.props.isVisible){
            if(this.props.isVisible){
                this._onModalShow();
            }else{
                this._onModalClose();
            }
        }
    }
    _onModalShow(){
        this.props.onModalShow&&this.props.onModalShow();
    }
    _onModalClose(){
        this.props.onModalClose&&this.props.onModalClose();
    }
    render(){
        var style = {backgroundColor:this.props.backgroundColor}
        if(!this.props.isVisible){
            return null;
        }
        return (
            <div 
                onClick = {this.props.onBackdropPress}
                className = 'screenui-modal'
                style = {style}
                >
                {this.props.children}
            </div>
        )
    }
}
export default Modal;