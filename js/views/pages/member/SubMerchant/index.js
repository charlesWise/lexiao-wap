'use strict'
import React, { Component } from 'react';
import api from './../../../../controllers/api';
import ScreenComponent from './../../../components/ScreenComponent';
import SearchRecord from "./SearchRecord";

class SubMerchant extends ScreenComponent {
    static pageConfig = {
        path: '/member/submerchant',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '子商户管理'
        }
        this.state = {
            status: 1, //状态 1 已绑定 2待确认 3 已拒绝 4 已解绑
            merchantList: [],
            name: '',
            hotDots: [],
            isSearched: false, //搜索
            isFocused: false,
            isClickItem: false,
            searchList: [],
            isOnComposition: false, //中文输入
        }
    }
    componentDidMount() {
        let { params } = this.getScreen().getNavigation().state;
        if (params && params.status) {
            this.setState({ status: params.status }, () => this._getSubMerchantList())
        } else {
            this._getSubMerchantList();
        }
        // this._getMerchantBind();
    }
    _getMerchantBind() {    //小红点数量
        api.merchantBind().success((content, next, abort) => {
            if (content.boolen == 1) {
                this.setState({ hotDots: content.data })
            }
        })
    }
    _getClickStatus() {
        api.clickStatus({ status: this.state.status }).success((content, next, abort) => {
            if (content.boolen == 1) { }
        })
    }
    _getSubMerchantList(data,isNotSearch) {
        api.subMerchantList({ status: this.state.status, name: data || '' }).success((content, next, abort) => {
            if (content.boolen == 1) {
                let merchantList = content.data || [];
                if (data && !isNotSearch) {
                    this.setState({ searchList: merchantList });
                } else {
                    this.setState({ merchantList });
                }
            }
        })
    }
    _tabSwitch(status) {
        if (this.state.status == status) return;
        //this.setState({ name: '' });
        this.setState({ status }, () => {
            this._getSubMerchantList(this.state.name,true);
            // this._getMerchantBind();
            // this._getClickStatus();
        });
    }
    _onInputSearch(e) {
        // let name = e.target.value;
        // this.setState({name}, () => {
        //     this._getSubMerchantList();
        // })
        let name = e.target.value;
        if (name) {
            this.setState({ isSearched: true });
            this._getSubMerchantList(name);
        } else {
            this.setState({ isSearched: false, searchList: [] });
        }
    }
    _subMerchantList() {
        return (
            <div className='submerchant-list'>
                {
                    this.state.merchantList && this.state.merchantList.length > 0 &&
                    this.state.merchantList.map((item, i) => {
                        return (
                            <div key={item.bind_id} className='submerchant-item'>
                                <a href={`#/member/submerchant/detail:bind_id=${item.bind_id}`}>
                                    <h3 className='name'>{item.merchant_name}</h3>
                                    <p className='props'><span>累计邀请：<em>{item.user_num || 0}</em>人</span><span>累计获利：<em>{item.money || 0}</em>元</span></p>
                                </a>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    _noData() {
        return (
            <div className='no-available-data'>
                <p><img src='/images/index/no_data.png' /></p>
                <p>无数据</p>
            </div>
        )
    }

    _onClick(e, type, data) {
        if (type === "input_clear") {
            this.input_search_ref.value = "";
            this.setState({ isSearched: false,name:"" });
        } else if (type === "input_cancel") {
            this.input_search_ref.value = "";
            this.setState({ isFocused: false, isSearched: false, isClickItem: false,name:"" });
            this._getSubMerchantList();
        } else if (type === "select_name") {
            this.input_search_ref.value = data;
            this.setState({ isSearched: false, isFocused: false, isClickItem: true,name:data });
            this._getSubMerchantList(data,true);
        }
    }

    render() {

        return (
            <div className='sub-merchant'>
                <header className='base-search-bar'>
                    <span className={(this.state.isFocused || this.state.isClickItem) ? "base-search-text" : "base-search-text base-search-text-fill"}>
                        {((this.state.isSearched || this.state.isClickItem) && this.state.isFocused) && (
                            <i
                                className="base-search-input-icon_del"
                                onClick={e => this._onClick(e, "input_clear")}
                            />
                        )}
                        <input type='text' placeholder='搜索子账户名称' ref={ref => (this.input_search_ref = ref)}
                            onFocus={() => {
                                this.setState({ isFocused: true })
                            }}
                            onChange={e => !this.state.isOnComposition && this._onInputSearch(e)}
                            onCompositionStart={() =>
                                this.setState({ isOnComposition: true })
                            }
                            onCompositionEnd={e => {
                                this.setState({ isOnComposition: false });
                                this._onInputSearch(e);
                            }} />
                    </span>
                    {(this.state.isFocused || this.state.isClickItem) && (
                        <a
                            className="head_cancel"
                            onClick={e => this._onClick(e, "input_cancel")}
                        >
                            取消
                        </a>
                    )}
                </header>
                {
                    !this.state.isSearched && <div className='tabs -notborder'>
                        <ul className='tab-nav'>
                            <li className={`tab-nav-item ${this.state.status == 1 && '-active'}`}
                                onClick={() => { this._tabSwitch(1) }}>已绑定
                            {
                                    // this.state.hotDots&&this.state.hotDots[0]&&!!this.state.hotDots[0]['ms_mun']&&
                                    // <i className='badge'>{this.state.hotDots[0]['ms_mun']}</i>
                                }
                            </li>
                            <li className={`tab-nav-item ${this.state.status == 2 && '-active'}`}
                                onClick={() => { this._tabSwitch(2) }}>待确认
                            {
                                    // this.state.hotDots&&this.state.hotDots[1]&&!!this.state.hotDots[1]['ms_mun']&&
                                    // <i className='badge'>{this.state.hotDots[1]['ms_mun']}</i>
                                }
                            </li>
                            <li className={`tab-nav-item ${this.state.status == 3 && '-active'}`}
                                onClick={() => { this._tabSwitch(3) }}>已拒绝
                            {
                                    // this.state.hotDots&&this.state.hotDots[2]&&!!this.state.hotDots[2]['ms_mun']&&
                                    // <i className='badge'>{this.state.hotDots[2]['ms_mun']}</i>
                                }
                            </li>
                            <li className={`tab-nav-item ${this.state.status == 4 && '-active'}`}
                                onClick={() => { this._tabSwitch(4) }}>已解绑
                            {
                                    // this.state.hotDots&&this.state.hotDots[3]&&!!this.state.hotDots[3]['ms_mun']&&
                                    // <i className='badge'>{this.state.hotDots[3]['ms_mun']}</i>
                                }
                            </li>
                        </ul>
                        <div className='tab-panel'>
                            {
                                this.state.merchantList && this.state.merchantList.length > 0 ? this._subMerchantList() : this._noData()
                            }
                        </div>
                    </div>
                }

                {!this.state.isSearched && <div className='fixed-bottom' style={{ zIndex: 2 }}><a href="#/member/submerchant/add">添加子商户</a></div>}
                {this.state.isFocused && !this.state.isSearched && <div className="mask search-zindex"></div>}
                {this.state.isSearched && <SearchRecord dataSource={this.state.searchList} onClick={(e, type, data) => { this._onClick(e, type, data) }} />}
            </div>
        )
    }
}

export default SubMerchant;