'use strict'
import React, { Component } from 'react';
import api from './../../../../controllers/api';
import ScreenComponent from './../../../components/ScreenComponent';
import Popup from '../SubMerchant/Popup';

class StaffManageDetail extends ScreenComponent {
    static pageConfig = {
        path: '/member/staffmanage/detail',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '职员详情'
        }
        this.state = {
            staffInfo: {},
            isShowPop: false,
            isRepeatPop: false,
            showPopText: ''
        }
    }
    componentDidMount() {
        this._getStaffInfo();
    }
    _getStaffInfo() {
        let { employee_id } = this.getScreen().getNavigation().state.params;
        api.staffInfo({ bind_id: employee_id }).success((content, next, abort) => {
            if(content.boolen == 1) {
                let staffInfo = content.data,
                auth = staffInfo['auth'];
                this.setState({staffInfo, employee_id})
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
    _renderInvite(staffInfo) {
        if(staffInfo.status == '1' || staffInfo.status == '4') {
            return (
                <div>
                    <div className='cell-item'>
                        <label className='-label'>累计邀请</label>
                        <span className='-value'>{staffInfo.user_num}人</span>
                    </div>
                    <div className='cell-item'>
                        <label className='-label'>累计获利</label>
                        <span className='-value'>{staffInfo.money || 0}元</span>
                    </div>
                </div>
            )
        }
    }
    _modifyAuth(item, index) {
        let staffInfo = this.state.staffInfo,
            auth = staffInfo['auth'];
        for (let i = 0; i < auth.length; i++) {
            if(i == index) {
                auth[i]['auth_type'] = !auth[i]['auth_type'];
            }
        }
        this.setState({staffInfo})
    }
    _modifyStaffInfo() {
        let staffInfo = this.state.staffInfo,
            auth = staffInfo['auth'],
            params = {}, authStr = [];
        for (const key in auth) {
            if(auth[key]['auth_type']) {
                authStr.push(auth[key]['id'])
            }
        }
        params = {employee_id: this.state.employee_id, mobile: staffInfo.mobile, auth_str: authStr.join(',')};
        api.saveSatff(params).success((content,next,abort)=>{
            if(content.boolen == 1) {
                this.setState({
                    showPopText: content.data,
                    isRepeatPop: !this.state.isRepeatPop
                })
            }
        })
    }
    _unbundSubMerchant() {
        api.applyStaffUnbind({employee_id: this.state.employee_id}).success((content,next,abort)=>{
            if(content.boolen == 1) {
                this.setState({
                    isShowPop: !this.state.isShowPop
                })
                this.props.navigation.navigate("StaffManage");
            }
        }).error((content) => {
            this.getScreen().toast(content.message)
        })
    }
    render() {
        let staffInfo = this.state.staffInfo,
            auth = staffInfo.auth;
        return (
            <div className='staff-manage-detail'>
                <div className='cell -right-line -notborder'>
                    <div className='cell-item -mb18'>
                        <label className='-label'>姓名</label>
                        <span className='-value -state-unbind'>{staffInfo.employee_name}</span>
                        <i className='status'>{this._returnStatus(staffInfo.status)}</i>
                    </div>
                    <div className='cell-item'>
                        <label className='-label'>手机号</label>
                        <span className='-value'>{staffInfo.mobile}</span>
                    </div>
                    <div className='cell-item'>
                        <label className='-label'>职位</label>
                        <span className='-value'>{staffInfo.post}</span>
                    </div>
                    <div className='cell-item -mb18'>
                        <label className='-label'>所属门店</label>
                        <span className='-value'>{staffInfo.name}</span>
                    </div>
                    <div className='cell-item -mb18'>
                        <label className='-label'>添加时间</label>
                        <span className='-value'>{staffInfo.ctime}</span>
                    </div>
                    {
                        staffInfo.status == '4' && <div className='cell-item -mb18'>
                            <label className='-label'>解绑时间</label>
                            <span className='-value'>{staffInfo.mtime}</span>
                        </div>
                    }
                    {this._renderInvite(staffInfo)}

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
                                                    ${item.auth_type == 1 && '-selected'}`}
                                                onClick={() => {
                                                    (staffInfo.status == 1||staffInfo.status == 3)&&this._modifyAuth(item, i)}}
                                                >
                                                {item.name}</li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className='cell-control -bg-gray'>
                    {   
                        //1已绑定 解绑/保存/编辑
                        staffInfo&&staffInfo.status == 1&&
                        <button className='btn-primary-hollow' onClick={() => {
                            this.setState({
                                isShowPop: !this.state.isShowPop
                            })
                        }}>解绑改职员</button>
                    }
                    {
                        //1已绑定 3已拒绝 保存/编辑
                        staffInfo&&(staffInfo.status == 1||staffInfo.status == 3)&&
                        <button className='btn-primary' onClick={() => {this._modifyStaffInfo()}}>
                            {staffInfo.status == 3 ? '重新提交' : '保存'}
                        </button>
                    }
                    </div>
                </div>
                {
                    this.state.isShowPop && 
                    <Popup title={'确定要解除与该职员的绑定吗？'} 
                        text={`职员姓名：${staffInfo.employee_name}`} 
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
                        if(staffInfo.status == 3) {
                            this.props.navigation.navigate("StaffManage", {
                                status: 2
                            });
                        }else {
                            this.props.navigation.navigate("StaffManage");
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

	
export default StaffManageDetail;