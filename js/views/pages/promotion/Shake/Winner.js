'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import api from './../../../../controllers/api';
import coupon from './../../../../util/coupon';
import string from './../../../../util/string';
import time from './../../../../util/time';
class Winner extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            winnerList: []
        }
        this.isShakeLog = true;
    }
    componentDidMount() {
        // this._getData();
        window.fortime = time.parse;
    }
    componentDidUpdate(prevProps, prevState) {
        if(!this.props.display){
            this.state.winnerList = [];
        }else if(this.props.display){
            if(this.isShakeLog) {
                this.isShakeLog = false;
                this._getData();
            }
        }
    }
    
    _getData() {
        var type = this.props.type;
        api.shakeLogList({type}).success((content,next,abort)=>{
            this.setState({
                winnerList:content.data.list||[]
            })
            next();
        });
    }
    _name(name,type,mony){
        name = string.limit(name,6,'...');
        return name+coupon.nameByType(type)+mony+'元'
    }
    _renderData() {
        let { winnerList } = this.state;
        if (winnerList.length > 0) {
            return (
                <ul className="win_record">
                    <li className="record_hu">奖品名称
                            <span>获奖时间</span>
                    </li>
                    {winnerList.map( (item, i)=> {
                        return (
                            <li
                                key={i}>
                                {this._name(item.merchant_name,item.coupon_type,item.discount_amount)}
                                <span>{item.ctime}</span>
                            </li>
                        )
                    })}
                </ul>
            )
        } else {
            return (
                <ul className="win_record win_no_record">
                    <img src="images/index/no_result.png" />
                    <p className="no_wu">暂无获奖记录</p>
                </ul>
            );
        }
    }
    render() {
        if (!this.props.display) {
            return null;
        }
        return (
            <div className="win_sucess">
                <h1>获奖记录</h1>
                {this._renderData()}
                <p>
                    <a
                        href='javascript:void(0)'
                        onClick={this.props.onClose}
                        className="win_btn">
                        确定
                    </a>
                </p>
            </div>
        );
    }
}
export default Winner;