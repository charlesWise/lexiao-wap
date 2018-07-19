'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

import api from './../../../../controllers/api';

class Entry extends ScreenComponent {
    static pageConfig = {
        path: '/business/entry',
        permission: true
    }

    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '入职申请资料'
        }
        this.state = {}
    }

    componentWillMount() {
        this._getInfo();
    }

    _getInfo() {
        api.subBDInfo({
        }).success((res) => {
            console.log('onsuccess>>>>', res)
            let data = res.data;
            this.setState({
                data: res.data
            })
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _getArea(data){
        let addr = '';
        let areas = data.areas;
        if(!areas) return null;
        return areas.map((item,i)=>{
            return (
                <div key={'area'+i} className='cell-item'>
                    <label className='-label'>{i == 0 ? '负责区域' : ''}</label>
                    <span className='-value'>{item.province_name}{item.city_name}{item.district_name}</span>
                </div>
            )
        })
    }
    
    render() {
        let data = this.state.data || {}
        return (
            <div className='sub-merchant-detail'>
                <div className='cell -right-line'>
                    <div className='cell-item'>
                        <label className='-label'>手机号</label>
                        <span className='-value -state-bind'>{data.mobile}</span>
                    </div>
                    <div className='cell-item'>
                        <label className='-label'>姓名</label>
                        <span className='-value'>{data.name}</span>
                    </div>
                    <div className='cell-item'>
                        <label className='-label'>银行卡号</label>
                        <span className='-value'>{data.card_no}</span>
                    </div>
                    <div className='cell-item'>
                        <label className='-label'>开户行</label>
                        <span className='-value'>{data.card_of_deposit}</span>
                    </div>
                    <div className='cell-item'>
                        <label className='-label'>身份证号</label>
                        <span className='-value'>{data.identity_id}</span>
                    </div>
                    {
                        this._getArea(data)
                    }
                </div>

                <div className='permission'>
                    <div className='title'>子账户权限</div>
                    <div className='content'>
                        <ul className='permission-group'>
                            {
                                data.auth_names && data.auth_names.map((item, i)=>{
                                    return <li key={'auth'+i} className='-default'>{item}</li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

	
export default Entry;