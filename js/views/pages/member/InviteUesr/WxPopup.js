'use strict'
import React from 'react';

export default class WxPopup extends React.Component {
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
                <p>点击右上角按钮分享给好友</p>
            </div>
            <p className="close">
                <a className="icon-white-close"
                    onClick={this._onClose}
                    ></a>
            </p>
        </div>
    }
}
