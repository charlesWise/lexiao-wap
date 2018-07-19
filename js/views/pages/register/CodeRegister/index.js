'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import Banner from './../QrCodeReg/Banner';
import CodeRegArea from './CodeRegArea';

class CodeRegister extends ScreenComponent {
    static pageConfig = {
        path: '/register/coderegister'
    }
    constructor(...props) {
        super(...props);
    }
    render() {
        return (
            <section className="er-code-reg-wrapper">
                <Banner />
                <CodeRegArea />
            </section>
        );
    }
}

export default CodeRegister;