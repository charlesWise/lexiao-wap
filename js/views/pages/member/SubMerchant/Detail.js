'use strict'
import React, { Component } from 'react';
import api from './../../../../controllers/api';
import ScreenComponent from './../../../components/ScreenComponent';
import Popup from './Popup';

class SubMerchantDetail extends ScreenComponent {
    static pageConfig = {
        path: '/member/submerchant/detail',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '子商户详情'
        }
        this.state = {
            merchantInfo: {},
            isShowPop: false,
            isRepeatPop: false,
            showPopText: ''
        }
    }
    componentDidMount() {
        this._subMerchantInfo();
    }
    _subMerchantInfo() {
        let { bind_id } = this.getScreen().getNavigation().state.params;
        api.subMerchantInfo({ bind_id }).success((content, next, abort) => {
            if(content.boolen == 1) {
                let merchantInfo = content.data,
                    auth = merchantInfo['auth'];
                this.setState({merchantInfo, bind_id})
            }
        })
    }
    _returnStatus(status) {
        // status: 1已绑定、2待确认、3已拒绝、4已解绑
        switch(status) {
            case '1': return '已绑定';
            case '2': return '待确认';
            case '3': return '已拒绝';
            case '4': return '已解绑';
        }
    }
    _renderInvite(merchantInfo) {
        if(merchantInfo.status == '1' || merchantInfo.status == '4') {
            return (
                <div>
                    <div className='cell-item'>
                        <label className='-label'>累计邀请</label>
                        <span className='-value'>{merchantInfo.user_num}人</span>
                    </div>
                    <div className='cell-item'>
                        <label className='-label'>累计获利</label>
                        <span className='-value'>{merchantInfo.money || 0}元</span>
                    </div>
                </div>
            )
        }
    }
    _itemModifyAuth(auth, index) {
        for (let i = 0; i < auth.length; i++) {
            if(i == index) {
                auth[i]['auth_type'] = !auth[i]['auth_type'];
            }
        }
    }
    _modifyAuth(item, index) {
        let merchantInfo = this.state.merchantInfo,
            auth = merchantInfo['auth'];
        if(merchantInfo.status == 1&&item.code!='MONEY_MANAGEMENT') {
            this._itemModifyAuth(auth, index);
            this.setState({merchantInfo})
        }else if(merchantInfo.status == 3&&merchantInfo.is_bind != 1) {
            this._itemModifyAuth(auth, index);
            this.setState({merchantInfo})
        }
    }
    _modifySubMerchant() {
        let merchantInfo = this.state.merchantInfo,
            auth = merchantInfo['auth'],
            params = {}, authStr = [];
        for (const key in auth) {
            if(auth[key]['auth_type']) {
                authStr.push(auth[key]['id'])
            }
        }
        params = {bind_id: this.state.bind_id, mobile: this.state.merchantInfo.mobile,auth_str: authStr.join(',')};
        api.saveSubMerchant(params).success((content,next,abort)=>{
            if(content.boolen == 1) {
                this.setState({
                    showPopText: content.data,
                    isRepeatPop: !this.state.isRepeatPop
                })
            }
        })
    }
    _unbundSubMerchant() {
        api.applyMerUnbind({mid: this.state.merchantInfo.mid}).success((content,next,abort)=>{
            if(content.boolen == 1) {
                this.setState({
                    isShowPop: !this.state.isShowPop
                })
                this.props.navigation.navigate("SubMerchant");
            }
        }).error((content) => {
            this.getScreen().toast(content.message)
        })
    }
    render() {
        let merchantInfo = this.state.merchantInfo,
            auth = merchantInfo.auth;
        return (
            <div className='sub-merchant-detail'>
                <div className='cell -right-line'>
                    <div className='cell-item'>
                        <label className='-label'>手机号</label>
                        <span className='-value'>{merchantInfo.mobile}</span>
                        <i className='status'>{this._returnStatus(merchantInfo.status)}</i>
                    </div>
                    <div className='cell-item'>
                        <label className='-label'>子商户</label>
                        <span className='-value'>{merchantInfo.name}</span>
                    </div>
                    <div className='cell-item'>
                        <label className='-label'>商户地址</label>
                        <span className='-value'>{merchantInfo.province}{merchantInfo.city}{merchantInfo.district}{merchantInfo.address}</span>
                    </div>
                    <div className='cell-item'>
                        <label className='-label'>添加时间</label>
                        <span className='-value'>{merchantInfo.ctime}</span>
                    </div>
                    {
                        merchantInfo.status == '4' && <div className='cell-item'>
                            <label className='-label'>解绑时间</label>
                            <span className='-value'>{merchantInfo.mtime}</span>
                        </div>
                    }
                    {this._renderInvite(merchantInfo)}
                </div>
                <div className='permission'>
                    <div className='title'>拥有权限</div>
                    <div className='content'>
                        <ul className='permission-group'>
                            {
                                auth && auth.length > 0 &&
                                auth.map((item, i) => {
                                    return (
                                        <li key={'detail'+i}
                                            className={`
                                                ${item.auth_type == 1 && '-selected'}
                                                ${item.code=='MONEY_MANAGEMENT'&&(item.auth_type== 1?merchantInfo.is_bind != 1?'':'-disabled':merchantInfo.is_bind != 1?'':'-sub-suffix')}
                                                `}
                                            onClick={() => {this._modifyAuth(item, i)}}
                                            >
                                            {item.name}</li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div className='control'>
                    {   
                        //1已绑定 解绑/保存/编辑
                        merchantInfo&&merchantInfo.status == 1&&
                        <button className='btn-primary-hollow' onClick={() => {
                            this.setState({
                                isShowPop: !this.state.isShowPop
                            })
                        }}>解绑该商户</button>
                    }
                    {
                        //1已绑定 3已拒绝 保存/编辑
                        merchantInfo&&(merchantInfo.status == 1||merchantInfo.status == 3)&&
                        <button className='btn-primary' onClick={() => {this._modifySubMerchant()}}>
                            {merchantInfo.status == 3 ? '重新提交' : '保存'}
                        </button>
                    }
                    </div>
                </div>
                {
                    this.state.isShowPop && 
                    <Popup title={'确定要解除与该商户的绑定吗？'} 
                        text={`商户名称：${merchantInfo.name}`} 
                        btnText={'取消'} 
                        goBtnText={'确定'} 
                        closePop={() => {
                            this.setState({
                                isShowPop: !this.state.isShowPop
                            })
                        }}
                        unbundSubMerchant={() => this._unbundSubMerchant()}
                        />
                }
                {
                    this.state.isRepeatPop && <Popup text={this.state.showPopText} btnText={'确认'} 
                    closePop={() => {
                        if(merchantInfo.status == 3) {
                            this.props.navigation.navigate("SubMerchant", {
                                status: 2
                            });
                        }else {
                            this.props.navigation.navigate("SubMerchant");
                        }
                        this.setState({
                            isRepeatPop: !this.state.isRepeatPop
                        })
                    }}/>
                }
            </div>
        )
    }
}

	
export default SubMerchantDetail;