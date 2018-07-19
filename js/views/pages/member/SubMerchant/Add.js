'use strict'
import React, { Component } from 'react';
import api from './../../../../controllers/api';
import ScreenComponent from './../../../components/ScreenComponent';
import Popup from './Popup';

class SubMerchantAdd extends ScreenComponent {
    static pageConfig = {
        path: '/member/submerchant/add',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '添加子商户'
        }
        this.state = {
            authList: [],
            mobile: '',
            isShowPop: false,
            isShowReferPop: false
        }
    }
    componentDidMount() {
        this._getAuthList();
    }
    _getAuthList() {
        api.merchantAuthList({type: 1}).success((content,next,abort)=>{ //type: 1  职员权限
            if(content.boolen == 1) {
                let merchantAuthData = content.data,
                    authList = merchantAuthData.list;
                for (const key in authList) {
                    authList[key]['auth_type'] = true;
                }
                this.setState({authList})
            }
        })
    }
    _onChangeMobile(e) {
        let mobile = e.target.value.replace(/[^\d]/g,'');
        if(mobile.length > 11) return;
        this.setState({mobile})
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
        for (const key in authList) {
            if(authList[key]['auth_type']) {
                authStr.push(authList[key]['auth_id'])
            }
        }
        params = {mobile: this.state.mobile,auth_str: authStr.join(',')};
        api.saveSubMerchant(params).success((content,next,abort)=>{
            if(content.boolen == 1) {
                this.setState({
                    isShowReferPop: !this.state.isShowReferPop,
                    showPopReferText: content.message
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
            this.props.navigation.navigate("SubMerchant", {
                status: 2
            });
        }
    }
    render() {
        return (
            <div className='sub-merchant-detail'>
                <div className='cell -right-line'>
                    <div className='cell-item'>
                        <label className='-label'>手机号</label>
                        <span className='-value'>
                        <input type="tel" placeholder='输入子商户手机号' value={this.state.mobile} onChange={e => this._onChangeMobile(e)} />
                        </span>
                    </div>
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
                        <div className='control'><button className='btn-primary' onClick={() => {this._addSubMerchant()}}>添加子商户</button></div>
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

	
export default SubMerchantAdd;