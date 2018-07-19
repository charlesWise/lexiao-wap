'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import Banner from '../QrCodeReg/Banner';
import EnterInput from './EnterInput';

class WxBillLog extends ScreenComponent {
    static pageConfig = {
        path: '/register/wxbilllog'
    }
    constructor(...props) {
        super(...props);
    }
    render() {
        return (
            <section className="er-code-reg-wrapper">
                <Banner />
                <EnterInput />
            </section>
        );
    }
}

export default WxBillLog;