'use strict'
import React from 'react';
import ScreenComponent from './../../../../components/ScreenComponent';

export default class NotGetFocus extends ScreenComponent {
    constructor(...props) {
        super(...props);
    }
    render() {
        return (
            <div className="not-get-focus">
                <aside><img src="/images/register/lx_logo.png" /></aside>
                <p>使用手机号登录/注册</p>
            </div>
        )
    }
}
