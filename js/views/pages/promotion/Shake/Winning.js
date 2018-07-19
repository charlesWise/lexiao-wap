'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import coupon from './../../../../util/coupon';

class Winning extends ScreenComponent {

    constructor(...props) {
        super(...props);
    }
    _name(name,type){
        return name+coupon.nameByType(type);
    }
    render() {
        if(!this.props.display){
            return null
        }
        let info = this.props.info;
        return (
            <div className="Winning">
                <div className="win_sucess">
                    <h1>恭喜您中奖啦 </h1>
                    <div className="win_cont">
                        <div className="win_cont_l">
                            <img src={info.logo}/>
                            <p className="win_text">{this._name(info.merchant_name,info.type)}</p>
                            <p className="win_bot">有效期至：{info.end_time}</p>
                        </div>
                        <div className="win_cont_r">
                            <p className="win_red">￥ <em>{info.discount_amount}</em></p>
                            {info.type!='1'&&<p className="win_small">满{info.need_amount}可用</p>}
                        </div>
                    </div>
                    <p>
                        <a 
                            href="javascript:"
                            onClick={this.props.onClose}>低调领取</a>
                        {
                            // <a 
                            // onClick={this.props.onShining}
                            // href="javascript:">炫耀一下</a>
                        }
                    </p>
                </div>
                <div className="mask"></div>
            </div>
        );
    }
}

export default Winning;