'use strict'
import api from './api';
import Http from './../util/Http';
import { StoreManager } from 'mlux';
import BuildConfig from 'build-config';

function login() {
    if(BuildConfig.ENV==='dev'){
        return api.login({ mobile: '18943612801' })
    }else{
        return Http.fake({content:'1',content:[]});
    }
}
function getAuthInfo() {
    var search = location.search.slice(1);
    var params = search.split('&');
    var maps = {}
    params.forEach(function (param) {
        var pair = param.split('=');
        maps[pair[0]] = pair[1];
    });
    var uid = maps.uid;
    var token = maps.token;
    if (!uid) {
        uid = StoreManager['auth'].get('uid');
        token = StoreManager['auth'].get('token');
    } else {
        StoreManager['auth'].set('uid', uid);
        StoreManager['auth'].set('token', token);
    }
    return {
        uid,
        token
    }
}
function needAuth() {
    try {
        // var {
        //     uid,
        //     token
        // } = getAuthInfo();
        // if (uid) {
        return api.isAuthorize().error((content, next, abort) => {
            login().success(next)
            // next();
        })
        // } else {
        //     return Http.fake({boolen:'1',data:{authorize:1}});
        // }
    } catch (e) {
        return 
    } finally {

    }
}

function auth() {
    try {
        // var {
        //     uid,
        //     token
        // } = getAuthInfo();
        return api.lexiaoAuthorize()
        // if (uid) {
            
        // } else {
        //     return login();
        // }

    } catch (e) {
        return login();
    } finally {

    }
}
export default {
    auth,
    needAuth
}