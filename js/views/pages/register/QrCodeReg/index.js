'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import Banner from './Banner';
import InputInfo from './InputInfo';

class QrCodeReg extends ScreenComponent {
    static pageConfig = {
        path: '/register/ercode'
    }
    constructor(...props) {
        super(...props);
    }
    componentDidMount() {
        
    }
    render() {
        return (
            <section className="er-code-reg-wrapper">
                <Banner />
                <InputInfo />
            </section>
        );
    }
}

export default QrCodeReg;