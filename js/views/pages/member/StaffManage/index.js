'use strict'
import React, { Component } from 'react';
import api from './../../../../controllers/api';
import ScreenComponent from './../../../components/ScreenComponent';

class StaffManage extends ScreenComponent {
    static pageConfig = {
        path: '/member/staffmanage',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '职员管理',
            onBack: navigation => {
                this.props.navigation.navigate("MyMerchant");
                return true;
            }
        }
        this.state = {
            status: 1, //状态 1 已绑定 2待确认 3 已拒绝 4 已解绑
            staffManageList: [],
            mobile: '',
            hotDots: []
        }
    }
    componentDidMount() {
        let { params } = this.getScreen().getNavigation().state;
        if(params&&params.status) {
            this.setState({status: params.status}, () => this._getStaffManageList())
        }else {
            this._getStaffManageList();
        }
        
        this._getEmployeeBind();
    }
    _getEmployeeBind() {    //小红点数量
        api.employeeBind().success((content,next,abort)=>{
            if(content.boolen == 1) {
                this.setState({hotDots: content.data})
            }
        })
    }
    _getClickEmployeeStatus() {
        api.clickEmployeeStatus({status: this.state.status}).success((content,next,abort)=>{
            if(content.boolen == 1) {}
        })
    }
    _getStaffManageList() {
        api.staffList({status: this.state.status, mobile: this.state.mobile}).success((content,next,abort)=>{
            if(content.boolen == 1) {
                let staffManageList = content.data;
                this.setState({staffManageList});
            }
        })
    }
    _tabSwitch(status) {
        if(this.state.status == status) return;
        this.setState({mobile: ''});
        this.setState({status}, () => {
            this._getStaffManageList();
            this._getEmployeeBind();
            this._getClickEmployeeStatus();
        });
    }
    _onChangeMobile(e) {
        let mobile = e.target.value.replace(/[^\d]/g,'');
        if(mobile.length > 11) return;
        this.setState({mobile}, () => {
            this._getStaffManageList();
        })
    }
    _staffManageList(){
        return(
            <div className='submerchant-list'>
                {
                    this.state.staffManageList && this.state.staffManageList.length > 0 &&
                    this.state.staffManageList.map((item, i) => {
                        return (
                            <div key={'merchant'+i} className='submerchant-item'>
                                <a href={`#/member/staffmanage/detail:employee_id=${item.employee_id}`}>
                                    <h3 className='name'><span>{item.post}</span>{item.name}</h3>
                                    <p className='props'><span>累计邀请：<em>{item.user_num || 0}</em>人</span><span>累计获利：<em>{item.money || 0}</em>元</span></p>
                                    <p className='shop-name'>{item.merchant_name}</p>
                                </a>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    _noData() {
        return(
            <div className='no-available-data'>
                <p><img src='/images/index/no_data.png'/></p>
                <p>无数据</p>
            </div>
        )
    }
    render() {
        return (
            <div className='staff-manage'>
                <header className='base-search-bar'>
                    <span className='base-search-text base-search-text-fill'>
                        <input type="tel" placeholder='搜索职员手机号' value={this.state.mobile} onChange={e => this._onChangeMobile(e)} />
                    </span>
                </header>
                <div className='tabs -notborder'>
                    <ul className='tab-nav'>
                        <li className={`tab-nav-item ${this.state.status == 1 && '-active'}`}
                            onClick={() => {this._tabSwitch(1)}}>已绑定
                            {
                                this.state.hotDots&&this.state.hotDots[0]&&!!this.state.hotDots[0]['ms_mun']&&
                                <i className='badge'>{this.state.hotDots[0]['ms_mun']}</i>
                            }
                            </li>
                        <li className={`tab-nav-item ${this.state.status == 2 && '-active'}`}
                            onClick={() => {this._tabSwitch(2)}}>待确认
                            {
                                this.state.hotDots&&this.state.hotDots[1]&&!!this.state.hotDots[1]['ms_mun']&&
                                <i className='badge'>{this.state.hotDots[1]['ms_mun']}</i>
                            }
                            </li>
                        <li className={`tab-nav-item ${this.state.status == 3 && '-active'}`}
                            onClick={() => {this._tabSwitch(3)}}>已拒绝
                            {
                                this.state.hotDots&&this.state.hotDots[2]&&!!this.state.hotDots[2]['ms_mun']&&
                                <i className='badge'>{this.state.hotDots[2]['ms_mun']}</i>
                            }
                            </li>
                        <li className={`tab-nav-item ${this.state.status == 4 && '-active'}`}
                            onClick={() => {this._tabSwitch(4)}}>已解绑
                            {
                                this.state.hotDots&&this.state.hotDots[3]&&!!this.state.hotDots[3]['ms_mun']&&
                                <i className='badge'>{this.state.hotDots[3]['ms_mun']}</i>
                            }
                            </li>
                    </ul>
                    <div className='tab-panel'>
                        {
                            this.state.staffManageList && this.state.staffManageList.length > 0 ? this._staffManageList() : this._noData()
                        }
                    </div>
                </div>
                <div className='fixed-bottom'><a href="#/member/staffmanage/add">添加职员</a></div>
            </div>
        )
    }
}

export default StaffManage;