'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

import api from './../../../../controllers/api';

export default class Progress extends ScreenComponent {
    static pageConfig = {
        path: '/member/progress',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.state = {}
    }

    componentWillMount() {
        this._unbind();
    }
    
    _unbind() {
        api.unbind({

        }).success((res) => {
            console.log('onsuccess>>>>', res)
            let data = res.data;
            if (data) {
                this.getScreen().getNavigation().navigate('RemoveMerchant', {
                    data: data
                })
            }else{
                this._bind()
            }
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _bind() {
        api.inviteMerStaffInfo({

        }).success((res) => {
            console.log('onsuccess>>>>', res)
            let data = res.data;
            if (data) {
                this.getScreen().getNavigation().navigate('Invitation', {
                    data: data
                })
            } else {
                this.getScreen().getNavigation().navigate('MyMerchant')
            }
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    render(){
        return <div/>;
    }
}