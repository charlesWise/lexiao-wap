'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import SearchNav from './SearchNav';
import WelfareList from './../../../components/WelfareList';
import api from './../../../../controllers/api';
class Result extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
        }
    }
    _renderEmpty() {
        return (
            <div className="no_result">
                <img src="/images/index/no_result.png" />
                <p className="text">暂时没有搜索结果哦</p>
            </div>
        );
    }
    _onItemClick = (item) => {
        api.addSearchWord({name:item.merchant_name})
        let navigation = this.getScreen().getNavigation();
        navigation.navigate('MerchantDetail', {
            id: item.merchant_id
        });
    }
    _onSelected = (fav, area, category, isfirst) => {
        this.props.onSelected && this.props.onSelected(fav, area, category, isfirst)
    }

    render() {
        if (this.props.hidden) {
            return null;
        }
        let { data } = this.props;
        let isEmptyList = !data || data.length < 1;
        let showNav = this.props.showNav;
        if (!showNav && isEmptyList) {
            return this._renderEmpty();
        } else {
            return (
                <section
                    style={{ height: '100%', position: 'relative' }}
                    className='search-result-section'>
                    <SearchNav
                        onSelected={this._onSelected} />
                    <div
                        style={{ position: 'absolute', top: '2rem', bottom: 0, left: 0, right: 0 }}>
                        {

                            showNav && isEmptyList ?
                                this._renderEmpty() :
                                <WelfareList
                                    onItemClick={this._onItemClick}
                                    data={this.props.data} />
                        }
                    </div>

                </section>
            );
        }
    }
}
export default Result;