'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import search from './../../../../controllers/search';
import { StoreManager } from 'mlux';
import Title from './Title';
class History extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            data: []
        }
        this._listeners;
    }
    componentDidMount() {
        this._listeners = StoreManager.searchHistory.addListener('change', this._getData)
        this._getData();
    }

    componentWillUnmount() {
        this._listeners && this._listeners.remove();
    }
    _getData = () => {
        var data = StoreManager.searchHistory.get('shopList');
        this.setState({ data });
    }
    _removeItem(city) {
        search.removeShopSearchHistory(city)
    }
    _clear = () => {
        search.clearShopSearchHistory();
    }
    _renderData() {
        return this.state.data.map((item, i) => {
            return (
                <li
                    onClick={()=>this.props.onSelected(item.name)}
                    key={i}>
                    <a href="javascript:void(0)">
                        {item.name}
                    </a>
                    <p
                        onClick={(e) => {
                            e.stopPropagation();
                            this._removeItem(item.name)
                            }
                        }
                        >
                        <i
                            className="icon_del" />
                    </p>
                </li>);

        });
    }
    render() {
        if (this.props.hidden) {
            return null;
        }
        let { data } = this.state;
        if (!data || data.length < 1) {
            return null;
        }
        return (
            <section
                className='search_section'>
                <Title
                    title='历史搜索' />
                <ul className="search_list">
                    {this._renderData()}
                </ul>
                <a
                    className="search_history_clear"
                    onClick={this._clear}
                    href="javascript:void(0)">
                    清除全部搜索历史
                </a>
            </section>
        );
    }
}
export default History;