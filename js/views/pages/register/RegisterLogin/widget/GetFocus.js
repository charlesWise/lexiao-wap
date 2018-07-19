'use strict'
import React from 'react';
import ScreenComponent from './../../../../components/ScreenComponent';

export default class GetFocus extends ScreenComponent {
    constructor(...props) {
        super(...props);
    }
    render() {
        return (
            <div className="get-focus">
                <p>登录<span>|</span>注册</p>
            </div>
        )
    }
}
