'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import api from './../../../../controllers/api';

export default class CashOutList extends ScreenComponent {
    static pageConfig = {
        path: '/member/cash/cashoutlist'
    }

    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '提现明细'
        }
        this.state = {
            cashList: []
        }
    }
    componentDidMount() {
        this._getCashOutList()
    }
    _getCashOutList() {
        api.cashOutList({}).success((conent) => {
            this.setState({
                cashList: conent.data
            })
        }).error((conent) => {
            this.getScreen().toast(conent.message)
        })
    }
    _onDetailPopup = (id) => {
        const CASHDETAILPOPUP = this.getScreen().showPopup({
            content: <CashDetailPopup 
                        id={id}
                        onClose = {() => {
                            this.getScreen().hidePopup(CASHDETAILPOPUP);
                        }}
                    />
        })
    }
    _renderStatus(status) {
        if(status == 1) { //1：待审核，2：审核驳回，4：提现成功
            return (
                <p>银行处理中</p>
            )
        }else if(status == 2) {
            return (
                <p className="red">提现失败</p>
            )
        }else if(status == 4) {
            return (
                <p>提现成功</p>
            )
        }
    }
    _notRecord() {
        return (
            <div className="not-record welfare-record"><img src='/images/index/cash_no_record.png' /><span>暂无提现记录</span></div>
        )
    }
    render() {
        let cashList = this.state.cashList;
        return (
            <div className='cash-out-list'>
                {
                    cashList.length == 0&&this._notRecord()
                }
                {
                    cashList.length>0&&<ul>
                    {
                        cashList.map((item, i) => {
                            return (
                                <li key={'cash'+i} onClick={() => {
                                    this._onDetailPopup(item.id)
                                }}>
                                    <span>
                                        <p>提现</p>
                                        <p>{item.time}</p>
                                    </span>
                                    <span>
                                        <p>-{item.money}</p>
                                        {item.status!=4&&this._renderStatus(item.status)}
                                    </span>
                                </li>
                            )
                        })
                    }
                    </ul>
                }
            </div>
        )
    }
}

class CashDetailPopup extends Component {
    constructor(...props) {
        super(...props);
        this.state = {
            detailInfo: {}
        }
    }
    componentDidMount() {
        this._getCashOutList()
    }
    _getCashOutList() {
        api.getCashOutDetail({id: this.props.id}).success((conent) => {
            this.setState({
                detailInfo: conent.data
            })
        }).error((conent) => {
            this.getScreen().toast(conent.message)
        })
    }
    _renderStatus(status) {
        if(status == 1) { //1：待审核，2：审核驳回，4：提现成功
            return (
                <p className="tip red">银行处理中</p>
            )
        }else if(status == 2) {
            return (
                <p className="tip red">提现失败</p>
            )
        }else if(status == 4) {
            return (
                <p className="tip" style={{color: 'rgba(81,179,65,1)'}}>提现成功</p>
            )
        }
    }
    _feeTip(status, fee) {
        if(status == 1) { //1：待审核，2：审核驳回，4：提现成功
            return `${fee}元`;
        }else if(status == 2) {
            return `${fee}元手续费已返还`;
        }else if(status == 4) {
            return `${fee}元`;
        }
    }
    render(){
        const detailInfo = this.state.detailInfo;
        return (
            <div className="cash-datail-popup" onClick={e => {e.stopPropagation();}}>
                <div className="popup-content">
                    <div className="datail-top">
                        <p className="number">-{detailInfo.money}</p>
                        {this._renderStatus(detailInfo.status)}
                        <i className="icon-close" onClick={() => {
                            this.props.onClose&&this.props.onClose()
                        }}></i>
                    </div>
                    <div className="cash-info">
                        <ul>
                            <li><span>账单分类</span><span>提现</span></li>
                            <li><span>提现时间</span><span>{detailInfo.time}</span></li>
                            {
                                detailInfo.status != 2&&<li><span>到账时间</span><span>{detailInfo.get_data}</span></li>
                            }
                            <li><span>提现手续费</span><span>{this._feeTip(detailInfo.status, detailInfo.fee)}</span></li>
                            <li><span>提现到</span><span>{detailInfo.bank_name}({detailInfo.account_no&&detailInfo.account_no.slice(-4)}) {detailInfo.account_name}</span></li>
                            <li><span>提现发起人</span><span>{detailInfo.create_name}</span></li>
                            {
                                detailInfo.status == 2&&<li><span>失败原因</span><span style={{paddingRight: '1.2rem'}}>{detailInfo.remark}</span></li>
                            }
                        </ul>
                    </div>
                    {
                        detailInfo.status == 2&&<div className="fail">
                            <p>提现金额和提现手续费已返还至账户</p>
                        </div>
                    }
                </div>
            </div>
        )
    }
}