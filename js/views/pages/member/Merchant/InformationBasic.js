'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

class MyMerchantInformationBasic extends ScreenComponent {
    static pageConfig = {
        path: '/member/merchant/information_basic',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '商户信息'
        }
    }
    render() {
        return (
            <div className='tabs'>
                <ul className='tab-nav'>
                    <li className='tab-nav-item -active'>基本信息</li>
                    <li className='tab-nav-item'>注册信息</li>
                </ul>
                <div className='tab-panel'>
                    <div className='cell -m-information -notborder -notborder-item'>
                        <div className='cell-item'>
                            <div className='-label'>商户logo</div>
                            <div className='-value -merchant-logo'><img src="//gw1.alicdn.com/bao/uploaded/i3/51609912/TB2cl8AgwRkpuFjy1zeXXc.6FXa_!!51609912.jpg_210x210.jpg" alt=""/></div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label'>商户名</div>
                            <div className='-value -c-gray'>王马栋集团公司</div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label'>商户电话</div>
                            <div className='-value -c-gray'>13629389797</div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label'>商户地址</div>
                            <div className='-value -c-gray'>浙江省杭州市西湖区大关路100号</div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label'>所属分类</div>
                            <div className='-value -c-gray'>美食 - 小吃</div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label'>商户面积</div>
                            <div className='-value -c-gray'>100m2</div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label'>员工人数</div>
                            <div className='-value -c-gray'>100人</div>
                        </div>
                        <div className='cell-item -gallery'>
                            <div className='-label'>宣传图片</div>
                            <div className='-value'></div>
                            <div className='-gallery-box'>
                                <ul>
                                    <li><img src='//aecpm.alicdn.com/simba/img/TB14ab1KpXXXXclXFXXSutbFXXX.jpg_q50.jpg' /></li>
                                    <li><img src='//aecpm.alicdn.com/simba/img/TB14ab1KpXXXXclXFXXSutbFXXX.jpg_q50.jpg' /></li>
                                    <li><img src='//aecpm.alicdn.com/simba/img/TB14ab1KpXXXXclXFXXSutbFXXX.jpg_q50.jpg' /></li>
                                    <li><img src='//aecpm.alicdn.com/simba/img/TB14ab1KpXXXXclXFXXSutbFXXX.jpg_q50.jpg' /></li>
                                </ul>
                            </div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label'>商户介绍</div>
                            <div className='-value -c-gray'>这是一个好商户这是一个好商户这是一个好商户这是一个好商户这是一个好商户这是一个好商户这是一个好商户这是一个好商户</div>
                        </div>

                        <div className='cell-control'>
                            <button className='btn-primary'>修改商户基本信息</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MyMerchantInformationBasic;   