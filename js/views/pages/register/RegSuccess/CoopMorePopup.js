'use strict'
import React from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

export default class CoopMorePopup extends ScreenComponent {
    constructor(...props){
        super(...props);
    }
    _stopPropagation = (e) => {
        e.stopPropagation();
    }
    _onClose = () => {
        this.props.onClose&&this.props.onClose();
    }
    render(){
        return <div className="use-note-popup-content" onClick={this._stopPropagation}>
            <div className="popup-content">
                <p>关于投融家</p>
                <p className="about-trj">投融家介绍
                    <span>投融家隶属于杭州投融谱华互联网金融服务有限公司，为用户提供多样化资产配置，专注服务于新中产家庭的互联网金融服务平台。</span>
                </p>
                <p className="about-trj about-lx-trj">乐消与投融家
                    <span>乐消是一家开放的互联网营销平台，与投融家进行合作，围绕顾客“衣、食、住、行、玩”，为用户带去优惠和便利。</span>
                </p>
            </div>
            <p className="close">
                <a className="icon-white-close"
                    onClick={this._onClose}
                    ></a>
            </p>
        </div>
    }
}
