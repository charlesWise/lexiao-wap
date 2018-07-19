'use strict'
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NavigationHeader from './../NavigationHeader';
import Content from './Content';

import Toast from './../Toast';
import Alert from './../Alert';
import Popup from './../Popup';


const MODAL_PREFIX = 'MODAL_PREFIX_';
const HEADER_REF = 'HEADER_REF';
const CONTENT_REF = 'CONTENT_REF';
const POPUP_REF = 'POPUP_REF';
const ALERT_REF = 'ALERT_REF';
const TOAST_REF = 'TOAST_REF';


var ID = 1;
var $CURRENT_SCREEN$;
const styles = {
    screen:{
        position:'relative'
    },
    content:{
        position:'absolute',
        bottom:0,
        left:0,
        right:0
    },
    header:{
        height:'44px',
        position:'relative'
    }
}
const SCREEN_SAGTE={
    'initial':'initial',
    'interactive:':'interactive',
    'complete':'complete',
    'reload':'reload'
}
function Screen(component) {
    class $Screen extends component {
        static childContextTypes = {
            screen:PropTypes.any,
            parent:PropTypes.any
        }
        static contextTypes = {
            screen:PropTypes.any,
            parent:PropTypes.any
        }
        constructor(...props) {
            super(...props);
            this._readyList = [];
            this._isReady = false;
            this._screenStage = SCREEN_SAGTE.initial;
            this.navigationOptions = this.navigationOptions||{header:null};
            Screen.setCurrentScreen(this);
        }
        
        componentWillMount() {
            this._screenStage=SCREEN_SAGTE.interactive;
            super.componentWillMount&&super.componentWillMount();
        }
        
        componentDidUpdate(prevProps, prevState) {
            if(this.props.isCurrent){
                Screen.setCurrentScreen(this);
            }
            if(this._screenStage==SCREEN_SAGTE.interactive){
                this._screenStage = SCREEN_SAGTE.complete;
                super.componentDidMount && super.componentDidMount()
            }
            if(this._screenStage==SCREEN_SAGTE.reload){
                this.forceUpdate();
                this._screenStage = SCREEN_SAGTE.interactive;
            }else{
                super.componentDidUpdate&&super.componentDidUpdate(prevProps, prevState);
            }
        }
        componentDidMount() {   
            this._isReady = true;
            this._fireReadyList();
            this._screenStage=SCREEN_SAGTE.complete;
            if (super.componentDidMount) {
                super.componentDidMount();
            }
        }
        isCurrent(){
            return this.props.isCurrent;
        }
        getScreen(){
            return this;
        }
        getParent(){
            return null;
        }
        getChildContext() {
            return {
                parent: this,
                screen: this
            }
        }
        getNavigation(){
            return this.props.navigation;
        }

        _ready(callback) {
            if (this._isReady) {
                callback();
            } else {
                this._readyList.push(callback);
            }
        }
        _fireReadyList() {
            var callback = this._readyList.shift();
            while (callback) {
                callback();
                callback = this._readyList.shift();
            }
        }
        reload() {
            super.componentWillUnmount && super.componentWillUnmount();
            super.componentWillMount && super.componentWillMount();
            this._screenStage=SCREEN_SAGTE.reload;
            this.forceUpdate();
        }
        alert(config) {
            this._ready(() => this.refs[ALERT_REF].show(config));
        }
        toast(message,timeout,callback,customStyle) {
            this._ready(() => this.refs[TOAST_REF].show(message,timeout,callback,customStyle));
        }
        showPopup(config) {
            var id = MODAL_PREFIX + (++ID);
            config.id = id;
            this._ready(() => {
                this.refs[POPUP_REF].showContent(config);
            })
            return id;
        }
        hidePopup(id) {
            this._ready(() => {
                this.refs[POPUP_REF].hideContent(id);
            })
        }
        updateHeader(props){
            this.refs[HEADER_REF]&&this.refs[HEADER_REF].update(props); 
            this.refs[CONTENT_REF]&&this.refs[CONTENT_REF].update(props);
        }
        render() {
            var navigation = this.props.navigation;
            var headerProps = {
                ...this.navigationOptions||{header:null},
                ...navigation&&navigation.state.params || {}
            }
            if(this._screenStage==SCREEN_SAGTE.reload){
                return <div style={{ height: '100%', width:'100%',position:'absolute',backgroundColor:'#f6f6f6',zIndex:'100' }} />
            }
            return <div
                    style={{ height: '100%', width:'100%',position:'absolute',backgroundColor:'#f6f6f6',zIndex:'100' }}>
                <NavigationHeader
                    ref = {HEADER_REF}
                    style = {styles.header}
                    navigation = {navigation}
                    {...headerProps}/>
                <Content 
                    ref = {CONTENT_REF}
                    header = {headerProps.header}
                    child = {super.render()}/>
                <Popup ref = {POPUP_REF}/>
                <Alert ref = {ALERT_REF}/>
                <Toast ref = {TOAST_REF}/>  
            </div>
        }
    }
    return $Screen
}
Screen.getCurrentScreen = function () {
    return $CURRENT_SCREEN$;
}

Screen.setCurrentScreen = function(screen){
    $CURRENT_SCREEN$ = screen;
}
export default Screen;


