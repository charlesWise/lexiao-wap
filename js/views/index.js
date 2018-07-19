'use strict'
import React, { Component } from 'react';
import Symbol from 'es6-symbol';
import BuildConfig from 'build-config';
import AppRegister from 'app-register';
import { createNavigator, StackRouter, addNavigationHelpers, NavigationActions } from 'react-navigation';
import { StoreManager } from 'mlux';
import StackNavigator from './components/StackNavigator';
import auth from './../controllers/auth';
import localLocation from './../controllers/localLocation';
import IndexStore from './../stores';
import PropTypes from 'prop-types';
import Routes from './routes/Routes';
import Authorize from './components/Authorize';
import Screen from './components/Screen';
import Bridge from './../util/bridge';

import Agreement from './pages/Agreement';
if(!window.Symbol){
    window.Symbol = Symbol;
}
const STORE_PREFIX = 'MLUX_STORAGE_'
if(BuildConfig.ENV=='prod'){
    window.alert = function(){

    }
}
StoreManager.setStorageTool({
    setter(key, value) {
        try {
            value = JSON.stringify(value);
        } catch (e) {

        }
        return Promise.resolve(localStorage.setItem(STORE_PREFIX + key, value));
    },
    getter(key) {
        var value = localStorage.getItem(STORE_PREFIX + key)
        try {
            value = JSON.parse(value);
        } catch (e) {

        }
        return Promise.resolve(value);
    }
})
function createNavigation(initialRouteName, initialRouteParams) {
    initialRouteName = initialRouteName || BuildConfig.ENV === 'DEBUG' ? 'PageList' : 'Main';
    return StackNavigator(Routes, {
        initialRouteName,
        initialRouteParams,
    });
}

class Entry extends Component {
    constructor(...props) {
        super(...props)
        window.APPContext = this;
        this.state = {
            inited: false,
            navigation: null,
            navigationKey: 0
        }
        this.navigationOptions = {
            header:null
        }
    }
    componentWillMount() {

    }
    _showProtocol=()=>{
        var popup;
        var hide = ()=>{
            this.getScreen().hidePopup(popup);
            return true;
        }   
        popup = this.getScreen().showPopup({
            content:<Agreement goBack={hide} />,
            onBackdropPress:()=>true
        });
    }
    _auth() {
        /**
         * todo
         * 逻辑移到controller里面
         */
        auth.needAuth().success((content, next, abort) => {
            if (content.data.authorize == 0) {
                var popup = this.getScreen().showPopup({
                    content:<Authorize 
                                onProtocol={()=>{
                                    this._showProtocol();
                                }}
                                onClose={()=>{
                                    Bridge.goBack();
                                }}
                                onConfirm = {
                                    ()=>{
                                        this.getScreen().hidePopup(popup);
                                        this._doAuth();
                                    }
                                }/>,
                    onBackdropPress:()=>true
                })
                // this._doAuth();
            }else if(content.data.authorize == 1){
                this._doAuth();
            }

        }).error((content, next, abort)=>{
            this._getLocal();
            next();
        })
    }
    _doAuth() {
        auth.auth().success((content, next, abort) => {
            console.log('登录成功')
            // StoreManager.user.set('info', content.data);
            StoreManager.user.set('isLogin', true);
            this._getLocal();
            next();
        }).error((content,next,abort)=>{
            console.log('登录失败')
            this._getLocal();
            next();
        })

    }
    _getLocal() {
        localLocation.locate().success(() => {
            setTimeout(() => this.setState({ inited: true }), 20);
        });
    }
    componentDidMount() {
        APPContext.Routes = Routes;

        StoreManager.load(IndexStore).then(() => {
            this.state.navigation = createNavigation();
            this._auth();
            // this.setState({ inited: true });
        })

    }
    resetNavigator(initialRouteName, initialRouteParams) {
        location.hash='#/';
        NavigatorFrame.reset();
        // this.setState({
        //     navigationKey: this.state.navigationKey + 1,
        //     navigation: createNavigation(initialRouteName, initialRouteParams)
        // });
    }
    render() {
        var Navigation = this.state.navigation;
        if (!this.state.inited) {
            return null;
            // return <img src='images/index/bg.png' style={{height:'100%',width:'100%'}}/>
        }
        return <Navigation  ref='navigation' key={this.state.navigationKey}/>
    }
}

var EntrySrceen = Screen(Entry)
AppRegister.register(<EntrySrceen />);