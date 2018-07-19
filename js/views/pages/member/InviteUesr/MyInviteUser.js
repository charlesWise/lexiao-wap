'use strict'
import React, { Component } from 'react';
import api from './../../../../controllers/api';
import DatePicker from './../../../components/DatePicker'
import ScreenComponent from './../../../components/ScreenComponent';

let PICKER_ID = null;
class MyInviteUser extends ScreenComponent {
    static pageConfig = {
        path: '/member/my-invite-user',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '邀请记录'
        }
        this.state = {
            inviteData: {},
            inviteList: [],
            isPop: false,
            time: '',
            type: 1 //1降 2增
        }
    }
    componentDidMount() {
        this._getInviteData();
    }
    _getInviteData() {
        let params = {
            time: this.state.time,
            type: this.state.type
        }
        api.investList(params).success((content, next, abort) => {
            if(content.boolen == 1) {
                this.setState({
                    inviteData: content.data,
                    inviteList: content.data.list
                })
            }
        })
    }
    _showDate() {
        this.setState({
            isPop: !this.state.isPop
        })
        PICKER_ID = this.getScreen().showPopup({
            content: <DatePicker
                isFooter = {1}
                onReset={() => {
                    this.getScreen().hidePopup(PICKER_ID);
                    this.setState({
                        isPop: !this.state.isPop,
                        time: ''
                    }, () => {
                        this._getInviteData();
                    })
                }}
                onSelected={(data) => {
                    this.getScreen().hidePopup(PICKER_ID);
                    let time = data.year + '-' + data.month + '-' + data.day;
                    this.setState({time, isPop: !this.state.isPop}, () => {
                        this._getInviteData();
                    });
                }}
            />
        })
    }
    _firstAmount() {
        if(this.state.type == 1) {
            this.setState({type: 2}, () => {
                this._getInviteData();
            });
        }else if(this.state.type == 2) {
            this.setState({type: 1}, () => {
                this._getInviteData();
            });
        }
    }
    _notRecord() {
        return (
            <div className='not-record -bg-gary'>
                <img src='/icon/icon_not_record.png' /><span>暂无邀请记录，快去邀请吧</span>
                <a href="#/member/invite-user" className='btn-primary'>立即邀请</a>
            </div>
        )
    }
    _myInviteUser(inviteData, inviteList){
        return(
            <div className='my-invite-main'>
                <div className='-total'>
                    <dl>
                        <dt>我的奖励(元)</dt>
                        <dd>{inviteData.money || 0}元</dd>
                    </dl>
                    <ul>
                        <li>已注册：{inviteData.register_num || 0}人</li>
                        <li>已投资：{inviteData.pay_num || 0}人</li>
                    </ul>
                </div>
                <div className='-filter'>
                    <ul>
                        <li className="date-li">
                            <span className={`${this.state.isPop && 'active'}`}
                            onClick={() => this._showDate()}>邀请日期<i></i></span>
                        </li>
                        <li className="money-li">
                            <span onClick={() => this._firstAmount()}>首投金额
                                <i className={`${this.state.type == 1 && 'active'}`}></i>
                                <i className={`${this.state.type == 2 && 'active'}`}></i>
                            </span>
                        </li>
                    </ul>
                </div>
                <table className='-data'>
                    <thead>
                        <tr>
                            <th>用户手机号</th>
                            <th>首投金额</th>
                            <th>注册时间</th>
                            <th>奖励</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            inviteList && inviteList.length > 0 && inviteList.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.mobile}</td>
                                        <td>{item.first_money}元</td>
                                        <td>{item.ctime}</td>
                                        <td>{item.reward_money}元</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
    render() {
        let inviteData = this.state.inviteData,
            inviteList = this.state.inviteList;
        return (
            <div className='my-invite-user'>
                {
                    inviteData.register_num != 0 ? this._myInviteUser(inviteData, inviteList) : this._notRecord()
                }
            </div>
        )
    }
}

export default MyInviteUser;