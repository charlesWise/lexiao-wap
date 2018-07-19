'use strict'
import React from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

const verifyCodeUri = window.location.origin + '/api/User/User/verify';
export default class ValidateImg extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            codeImgUri: `${verifyCodeUri}?t=${new Date().getTime()}`
        }
    }
    _refreshCode = () => {
        let codeImgUri = `${verifyCodeUri}?t=${new Date().getTime()}`
        this.setState({codeImgUri});
    }
    render() {
        return (
            <span className="graphic-img" onClick={this._refreshCode}><img src={this.state.codeImgUri} /></span>
        );
    }
}