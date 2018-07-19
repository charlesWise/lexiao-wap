'use strict'
import React from 'react';

export default class TipsPopup extends React.Component {
    constructor(...props){
        super(...props);
        this.state = {
        }
    }
    _stopPropagation = (e) => {
        e.stopPropagation();
    }
    _onClose = () => {
        this.props.onClose&&this.props.onClose();
    }
    render(){
        return <div className="tips-popup-content" onClick={this._stopPropagation}>
            <div className="popup-content">
                <i className="icon-lx-logo"></i>
                <p>此手机号已注册乐消</p>
            </div>
            <p className="close">
                <a className="icon-white-close"
                    onClick={this._onClose}
                    ></a>
            </p>
        </div>
    }
}
