'use strict'
import React, { Component } from 'react';
import api from './../../../../controllers/api';
import ScreenComponent from './../../../components/ScreenComponent';
import Popup from '../SubMerchant/Popup';

class StaffManageAdd extends ScreenComponent {
    static pageConfig = {
        path: '/member/staffmanage/add',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '添加职员'
        }
        this.state = {
            authList: [],
            mobile: '',
            name: '',
            post: '',
            merchantName: '',
            isShowPop: false,
            isShowReferPop: false
        }
    }
    componentDidMount() {
        this._getAuthList()
    }
    _getAuthList() {
        api.merchantAuthList({type: 2}).success((content,next,abort)=>{ //type: 2  职员权限
            if(content.boolen == 1) {
                let merchantAuthData = content.data,
                authList = merchantAuthData.list;
                for (const key in authList) {
                    authList[key]['auth_type'] = true;
                }
                this.setState({authList, merchantName: merchantAuthData.merchant_name})
            }
        })
    }
    _addAuth(item, index) {
        let authList = this.state.authList;
        for (let i = 0; i < authList.length; i++) {
            if(i == index) {
                authList[i]['auth_type'] = !authList[i]['auth_type'];
            }
        }
        this.setState({authList})
    }
    _onChangeVal(type) {
        if(type == 1) {
            let mobile = this.mobile.value.replace(/[^\d]/g,'');
            if(mobile.length > 11) return;
            this.setState({mobile})
        }else if(type == 2) {
            let name = this.name.value;
            this.setState({name})
        }else if(type == 3) {
            let post = this.post.value;
            this.setState({post})
        }
        // else if(type == 4) {
        //     let merchantName = this.merchantName.value;
        //     this.setState({merchantName})
        // }
    }
    _addSubMerchant() {
        let authList = this.state.authList,
            params = {}, authStr = [];
        if(!this.state.mobile) {
            this.setState({
                isShowPop: !this.state.isShowPop,
                showPopText: '请输入手机号'
            })
            return;
        }else {
            let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
            if(!reg.test(this.state.mobile)) {
                this.setState({
                    isShowPop: !this.state.isShowPop,
                    showPopText: '输入手机号不合法'
                })
                return;
            }
        }
        if(!this.state.name) {
            this.setState({
                isShowPop: !this.state.isShowPop,
                showPopText: '输入职员姓名'
            })
            return;
        }
        if(!this.state.post) {
            this.setState({
                isShowPop: !this.state.isShowPop,
                showPopText: '输入职员职位'
            })
            return;
        }
        for (const key in authList) {
            if(authList[key]['auth_type']) {
                authStr.push(authList[key]['auth_id'])
            }
        }
        params = {
            name: this.state.name,
            post: this.state.post,
            mobile: this.state.mobile,
            auth_str: authStr.join(',')
        };
        api.saveSatff(params).success((content,next,abort)=>{
            if(content.boolen == 1) {
                this.setState({
                    isShowReferPop: !this.state.isShowReferPop,
                    showPopReferText: '添加申请已提交，等待职员确认'
                })
            }
        }).error((content) => {
            this.setState({
                isShowPop: !this.state.isShowPop,
                showPopText: content.message
            })
        })
    }
    _closePop(type) {
        this.setState({
            isShowPop: false,
            isShowReferPop: false
        })
        if(type == 2) {
            this.props.navigation.navigate("StaffManage", {
                status: 2
            });
        }
    }
    render() {
        return (
            <div className='staff-manage-detail'>
                <div className='cell -right-line -notborder'>
                    <div className='cell-item -mb18'>
                        <label className='-label'>手机号</label>
                        <span className='-value'>
                            <input type="tel" placeholder='输入职员手机号'
                                ref={v => this.mobile = v}
                                value={this.state.mobile}
                                onChange={() => this._onChangeVal(1)} />
                        </span>
                    </div>
                    <div className='cell-item'>
                        <label className='-label'>姓名</label>
                        <span className='-value'>
                            <input type='text' placeholder='输入职员姓名'
                                ref={v => this.name = v}
                                value={this.state.name}
                                onChange={() => this._onChangeVal(2)} />
                        </span>
                    </div>
                    <div className='cell-item'>
                        <label className='-label'>职位</label>
                        <span className='-value'>
                            <input type='text' placeholder='输入职员职位'
                                ref={v => this.post = v}
                                value={this.state.post}
                                onChange={() => this._onChangeVal(3)} />
                        </span>
                    </div>
                    <div className='cell-item -mb18'>
                        <label className='-label'>所属门店</label>
                        <span className='-value'>
                            {/* <input type='text' placeholder='肯德基新安店'
                                ref={v => this.merchantName = v}
                                value={this.state.merchantName}
                                onChange={() => this._onChangeVal(4)} /> */}
                            { this.state.merchantName }
                        </span>
                    </div>

                    <div className='permission'>
                        <div className='title'>拥有权限</div>
                        <div className='content'>
                            <ul className='permission-group'>
                                {
                                    this.state.authList && this.state.authList.length > 0 && this.state.authList.map((item, i) => {
                                        return (
                                            <li key={'add'+i}
                                                className={`${item.auth_type && '-selected'}`}
                                                onClick={() => {this._addAuth(item, i)}}
                                                >{item.auth_name}</li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className='cell-control -bg-gray'>
                        <button className='btn-primary' onClick={() => {this._addSubMerchant()}}>添加</button>
                    </div>
                </div>
                {
                    this.state.isShowPop && <Popup text={this.state.showPopText} btnText={'确认'} closePop={() => this._closePop(1)}/>
                }
                {
                    this.state.isShowReferPop && <Popup title={'信息已提交'} text={this.state.showPopReferText} btnText={'我知道了'} closePop={() => this._closePop(2)}/>
                }
            </div>
        )
    }
}


export default StaffManageAdd;