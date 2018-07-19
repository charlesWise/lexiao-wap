'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

class MyMerchantInformationRegister extends ScreenComponent {
    static pageConfig = {
        path: '/member/merchant/information_register',
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
                    <li className='tab-nav-item'>基本信息</li>
                    <li className='tab-nav-item -active'>注册信息</li>
                </ul>
                <div className='tab-panel'>
                    <div className='cell -m-information -notborder -notborder-item'>
                        <div className='cell-item'>
                            <div className='-label'>手机号</div>
                            <div className='-value -c-gray'>13629389797</div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label'>法人</div>
                            <div className='-value -c-gray'>王二</div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label'>法人手机</div>
                            <div className='-value -c-gray'>13629389797</div>
                        </div>
                        <div className='cell-item -gallery'>
                            <div className='-label'>身份证</div>
                            <div className='-value'></div>
                            <div className='-gallery-box'>
                                <ul>
                                    <li><img src='//aecpm.alicdn.com/simba/img/TB14ab1KpXXXXclXFXXSutbFXXX.jpg_q50.jpg' /></li>
                                    <li><img src='//aecpm.alicdn.com/simba/img/TB14ab1KpXXXXclXFXXSutbFXXX.jpg_q50.jpg' /></li>
                                </ul>
                            </div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label'>持卡人</div>
                            <div className='-value -c-gray'>王马栋</div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label'>银行卡号</div>
                            <div className='-value -c-gray'>1234 2234 4323 3432</div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label'>开户行</div>
                            <div className='-value -c-gray'>浙江省杭州市西湖分支行</div>
                        </div>
                        <div className='cell-item -gallery'>
                            <div className='-label'>营业执照</div>
                            <div className='-value -c-gray'>402398798471947</div>
                            <div className='-gallery-box'>
                                <ul>
                                    <li><img src='//aecpm.alicdn.com/simba/img/TB14ab1KpXXXXclXFXXSutbFXXX.jpg_q50.jpg' /></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MyMerchantInformationRegister;   