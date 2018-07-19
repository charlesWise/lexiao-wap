'use strict'
import React, { Component } from 'react';
import { createNavigator, StackRouter, addNavigationHelpers, NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import Screen from './../Screen';
import CardStack from './CardStack';
const SEARCH_CODE = ':';
const SCREEN_REF = 'SCREEN_REF';

/**
 * 
 * hashchange-action-dispatch--render
 * action-dispatch-change-hash-render
 */
function parseParams(queryString){
    if(!queryString){
        return {};
    }
    let params = {};
    decodeURI(queryString).split('&').forEach(function(item){
        item = item.split('=');
        params[item[0]] = item[1];
    })
    return params;
}
function stringifyParams(params){
    let string = []
    if(params){
        for(let o in params){
            let s = o+'='+params[o];
            string.push(s)
        }
        return string.join('&');
    }
    return '';
}
function getPathFromHash() {
    if (!location || !location.hash || location.hash == '#') {
        return {path:'/',params:{}};
    }
    var uri = decodeURI(location.hash).slice(1).split(SEARCH_CODE);
    var path = uri[0];
    var params = parseParams(uri[1]);

    return {path,params};
}
function routerActionForPathAndParams(router, path, params) {
    var action = router.getActionForPathAndParams(path, params);
    if (action == null) {
        return NavigationActions.navigate({ routeName: '404', key: '404', params: { path } })
    }
    return action;
}
class NavigatorFrame extends Component {
    constructor(...props) {
        super(...props);
        const { router } = this.props;

        var {path,params} = getPathFromHash();
        var initAction = routerActionForPathAndParams(router,path,params );
        this.state = router.getStateForAction(initAction);
        /*for resetNavigator 后面最好改掉*/
        window.NavigatorFrame = this;
    }
    componentDidMount() {
        window.onhashchange = this._onpopstate;
    }
    componentWillUnmount() {
        window.onpopstate = null;
    }
    componentDidUpdate(prevProps, prevState) {
    }

    componentWillReceiveProps(nextProps) {
    }
    reset(){
        const { router } = this.props;

        // var {path,params} = getPathFromHash();
        // var initAction = routerActionForPathAndParams(router,path,params );
        // let state = router.getStateForAction(initAction);
        this.state = undefined;
    }
    _onpopstate = (e) => {
        e.preventDefault();
        const { router } = this.props;
        let action = this._nextAction;
        this._nextAction = undefined;
        if(!action){
            let {path,params} = getPathFromHash();
            action = this.getAction(router, path,params);
        }
        const state = this.state;
        if(state&&state.index){
            const preRoute = state.routes[state.index-1];
            if(preRoute&&preRoute.routeName==action.routeName){
                action = NavigationActions.back(action);
            }
        }
        // action.reason = 'hashchange';
        // this.dispatch(action);
        this._askForRender(action);
    }
    getNavigation = () => {
        const { router } = this.props;
        const state = this.state;
        const navigation = addNavigationHelpers({
            state: state.routes[state.index],
            routerState: this.state,
            dispatch: this.dispatch,
        })
        const screenNavigation = addNavigationHelpers({
            ...navigation,
            state: state.routes[state.index],
        });
        const options = router.getScreenOptions(screenNavigation, {});
        // this.pushState(router, state, options);
        return navigation;
    }
    getURIForAction = (action) => {
        const { router } = this.props;
        const state = router.getStateForAction(action, this.state) || this.state;
        const { path } = router.getPathAndParamsForState(state);
        return path;
    }
    getActionForPathAndParams = (path, params) => {
        const { router } = this.props;
        return routerActionForPathAndParams(path, params);
    }
    getAction = (router, path, params) => {
        return routerActionForPathAndParams(router, path, params);
    }
    pushState = (router, state, options) => {
        const { path, params } = router.getPathAndParamsForState(state);
        const uri = `#${path}${SEARCH_CODE+stringifyParams(params)}`;
        if (window.location.hash !== uri) {
            // window.history.pushState({}, state.title, uri);
            // location.hash = uri;
        }
    }
    _askForRender(action){
        const { router } = this.props;
        const state = router.getStateForAction(action, this.state);
        const isChange = state && state !== this.state;
        // const { path, params } = router.getPathAndParamsForState(state);
        // const uri = `#${path}${SEARCH_CODE+stringifyParams(params)}`;
        isChange ? this.setState(state) : undefined;
        return (isChange || !state);
    }
    dispatch = (action) => {
        const { router } = this.props;
        const state = router.getStateForAction(action, this.state);


        const { path, params } = router.getPathAndParamsForState(state);
        const uri = `#${path}${SEARCH_CODE+stringifyParams(params)}`;
        this._nextAction = action;
        if(action.type==='Navigation/BACK'){
            history.back();
        }else if (window.location.hash !== uri) {
            // window.history.pushState({}, state.title, uri);
            location.hash = uri;
        }
        // this._askForRender(action);
    }
    render() {
        const { router } = this.props;
        const Screen = router.getComponentForState(this.state);
        const navigation = this.getNavigation();
        const state = this.state;
        return (
            <CardStack 
                router = {router}
                navigation = {navigation}
                routes = {this.state.routes}
                index = {this.state.index}/> 
        );
    }
}

export default NavigatorFrame;