'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

import api from './../../../../controllers/api';

var PICKER_ID;

class MyMerchantInformation extends ScreenComponent {
    static pageConfig = {
        path: '/member/merchant/fundrecord',
        permission: true
    }

    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '资金记录'
        }
        this.state = {
            list: [],
            type: 0,
            show: false
        }
    }

    componentDidMount() {
        this._getList();
    }

    _getList(type,page) {
        api.capitalRecordList({
            type: type || 0,
            page: page || 1
        }).success((res) => {
            this.setState({
                list: (res.data && res.data.list) || []
            })
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _FundRecordList(list){
        let self = this;
        return(
            <div className='fundrecord-list'>
                {
                    list.map((item,i)=>{
                        return (
                            <div key={item.account_id} className='fundrecord-item' onClick={self._showDetail.bind(this,item)}>
                                <span className='time'>{item.time}</span>
                                <span className='name'>{item.name}</span>
                                <span className='sum'>{item.in_or_out == 1 ? '+' : '-'}{item.money}</span>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    _onClick(type){
        this._getList(type);
        this._scrollTo(type);
        this.setState({
            type: type,
            show: false
        })
    }

    _scrollTo(index){
        let tabContainer = document.getElementsByClassName('head')[0];
        let clientWidth = tabContainer.clientWidth;
        var tab = document.getElementsByClassName('tab')[0]
        var tabWidth = tab.offsetWidth;
        var ulWidth = tabWidth/6;
        if (index > 2) {
            tabContainer.scrollLeft = clientWidth
        }
        if (index < 3) {
            if ((ulWidth * index) < clientWidth) {
                tabContainer.scrollLeft = 0
            }
        }
    }

    _showDetail(data) {
        PICKER_ID = this.getScreen().showPopup({
            content: <Detail
                dataSource={data}
                type={data.type}
                onClose={() => {
                    this.getScreen().hidePopup(PICKER_ID)
                }}
            />
        })
    }
    
    render() {
        let list = this.state.list
        return (
            <div className='fundrecord'>
                <div className={'head'}>
                    <ul className='tab'>
                        <li onClick={this._onClick.bind(this,0)} className={this.state.type == 0 ? '-active' : ''}>全部</li>
                        <li onClick={this._onClick.bind(this,1)} className={this.state.type == 1 ? '-active' : ''}>提现</li>
                        <li onClick={this._onClick.bind(this,2)} className={this.state.type == 2 ? '-active' : ''}>邀请注册奖励</li>
                        <li onClick={this._onClick.bind(this,3)} className={this.state.type == 3 ? '-active' : ''}>邀请首投奖励</li>
                        <li onClick={this._onClick.bind(this,4)} className={this.state.type == 4 ? '-active' : ''}>福利券奖励</li>
                        <li onClick={this._onClick.bind(this,5)} className={this.state.type == 5 ? '-active' : ''}>用户买单实付</li>
                    </ul>
                    <div className='btn-more' onClick={()=>{ this.setState({ show: !this.state.show }) }}></div>
                </div>

                <div className='body'>
                    {this._FundRecordList(list)}
                </div>

                <div className="mask-wrap" style={this.state.show ? {display: 'block'} : {display: 'none'}}>
                    <ul className="mask-ul">
                        <li onClick={this._onClick.bind(this, 0)} className={this.state.type == 0 ? '-active' : ''}>全部</li>
                        <li onClick={this._onClick.bind(this, 1)} className={this.state.type == 1 ? '-active' : ''}>提现</li>
                        <li onClick={this._onClick.bind(this, 2)} className={this.state.type == 2 ? '-active' : ''}>邀请注册奖励</li>
                        <li onClick={this._onClick.bind(this, 3)} className={this.state.type == 3 ? '-active' : ''}>邀请首投奖励</li>
                        <li onClick={this._onClick.bind(this, 4)} className={this.state.type == 4 ? '-active' : ''}>福利券奖励</li>
                        <li onClick={this._onClick.bind(this, 5)} className={this.state.type == 5 ? '-active' : ''}>用户买单实付</li>
                    </ul>
                    <div className='mask-index' style={{ zIndex: 3}} onClick={() => { this.setState({ show: !this.state.show }) }} />
                </div>
            </div>
        )
    }
}

export default MyMerchantInformation;

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: {}
        }
    }

    componentDidMount() {
        let data = this.props.dataSource || {}
        this._getDetail(data.account_id);
    }

    _getDetail(account_id) {
        api.capitalRecordInfo({
            account_id: account_id
        }).success((res) => {
            this.setState({
                detail: res.data || {}
            })
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }
    
    render(){
        let detail = this.state.detail;
        if(Object.keys(detail)&&Object.keys(detail).length>0) {
            return (
                <div className="trade-pop">
                    <div className="trade-money">
                        <p><i className="icon-close" onClick={()=>{
                            this.props.onClose && this.props.onClose()
                        }}></i></p>
                        {
                            detail.in_or_out != 1 ? <p style={{color: '#51b341'}}>{`-${detail.money || 0}`}</p> : <p>{`-${detail.money || 0}`}元</p>
                        }
                        {
                            detail.in_or_out != 1 ? <p style={{color: '#51b341'}}>提现成功</p> : <p>交易成功</p>
                        }
                    </div>
                    {
                        (this.props.type == '4' || this.props.type == '5') && this._renderOrder(detail)
                    }
                    {
                        (this.props.type == '2' || this.props.type == '3') && this._renderInvite(detail)
                    }
                    {
                        this.props.type == '1' && this._renderCash(detail)
                    }
                </div>
            )
        }else {
            return null;
        }
    }

    _renderOrder(detail){
        return (
            <ul className="trade-ul">
                <li><span>账单分类</span><span>{detail.name}</span></li>
                <li><span>来源用户</span><span>{detail.mobile}</span></li>
                <li><span>消费时间</span><span>{detail.ctime}</span></li>
                <li><span>消费金额</span><span>{detail.money_amount}元</span></li>
                <li><span>优惠券金额</span>
                    <span>
                        {detail.discount_amount}元
                        {detail.need_amount > 0 ? `（满${detail.need_amount}元可用）` : ''}
                    </span>
                </li>
                <li><span>实付金额</span><span>{(this.props.type == 4 ? detail.real_money : detail.money) || 0}元</span></li>
                <li><span>消费门店</span><span>{detail.merchant_name}</span></li>
                <li><span>到账时间</span><span>{detail.mtime}</span></li>
            </ul>
        )
    }

    _renderInvite(detail) {
        return (
            <ul className="trade-ul">
                <li><span>账单分类</span><span>{detail.name}</span></li>
                <li><span>来源用户</span><span>{detail.mobile}</span></li>
                <li><span>{this.props.type == '' ? '用户注册时间' : '首投时间'}</span><span>{detail.ctime}</span></li>
                <li><span>消费门店</span><span>{detail.merchant_name}</span></li>
                <li><span>到账时间</span><span>{detail.mtime}</span></li>
            </ul>
        )
    }

    _renderCash(detail) {
        return (
            <ul className="trade-ul">
                <li><span>账单分类</span><span>{detail.name}</span></li>
                <li><span>提现时间</span><span>{detail.ctime}</span></li>

                <li><span>到账时间</span><span>{detail.mtime}</span></li>
                <li><span>提现手续费</span><span>{detail.fee}元</span></li>

                <li><span>提现到</span><span>{detail.account_name}</span></li>
                <li><span>提现发起人</span><span>{detail.user_name}</span></li>
            </ul>
        )
    }
}