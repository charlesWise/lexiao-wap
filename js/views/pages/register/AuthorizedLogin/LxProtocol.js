'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import api from './../../../../controllers/api';

export default class LxProtocol extends ScreenComponent {
    static pageConfig = {
        path: '/register/lxprotocol'
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '乐消注册服务协议'
        }
        this.state = {
            lxProtocolData: {}
        }
    }
    componentDidMount() {
        api.lxProtocol({type: 0}).success((res) => {
            this.setState({
                lxProtocolData: res.data || {}
            })
        }).error((data) => {
            this.getScreen().toast(data.message)
        })
    }
    render() {
        const { content } = this.state.lxProtocolData;
        return (
            <div className="trj-protocol-content">
                <div className="protocol-content">
                    <p style={{color: '#333'}} dangerouslySetInnerHTML={{__html: content}}></p>
                </div>
            </div>
        );
    }
}