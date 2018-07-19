'use strict'
import React from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import ProtocolPopup from './ProtocolPopup';

export default class Agreement extends ScreenComponent {
    constructor(...props) {
        super(...props);
    }
    _onCheck = () => {
        this.props.onCheck&&this.props.onCheck();
    }
    _onProtocolPopup = (e) => {
        e.stopPropagation();
        const PROTOCOLPOPUP = this.getScreen().showPopup({
            content: <ProtocolPopup onClose = {() => {
                        this.getScreen().hidePopup(PROTOCOLPOPUP);
                    }}
                />
        })
    }
    render() {
        return (
            <div className="er-code-agreement">
                <span onClick={this._onCheck}>
                    <i className={`${this.props.isCheck?'icon-agree':'icon-no-agree'}`}></i>
                    我已阅读并同意
                    <a href="javascript:;" onClick={this._onProtocolPopup}>《乐消注册服务协议》</a>
                </span>
            </div>
        )
    }
}
