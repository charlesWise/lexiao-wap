'use strict'
//商户
import React from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import api from './../../../../controllers/api';
import Selection from './Selection';
import ReactDOM from 'react-dom';
import { StoreManager } from 'mlux';
const SEARCH_BG_REF = 'SEARCH_BG_REF';
const WRAPPER_REF = 'WRAPPER_REF';
const NAVREF = 'NAVREF';


class SearchNav extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            index: -1,
            area: {
                name: StoreManager['location'].get('city'),
                key: StoreManager['location'].get('city_code')
            },
            category: {
                name: '全部分类',
                key: ''
            },
            fav: {
                name: '离我最近',
                key: '1'
            },
            areas: [],
            categorys: [],
            favs: [
                {
                    name: '离我最近',
                    key: '1'
                },
                {
                    name: '人气最高',
                    key: '2'
                }
            ]
        }
    }
    componentDidMount() {
        this._resize();
        this._getArea();
        this._getCategory();
    }
    componentDidUpdate(prevProps, prevState) {
        this._resize();
    }
    _getArea() {
        var area_code = StoreManager['location'].get('city_code') || '';
        return api.getArea({ area_code }).success((content) => {
            var areas = content.data.map((item) => {
                return {
                    key: item.code,
                    name: item.name
                }
            })
            areas.unshift(this.state.area);
            this.state.areas = areas;
        })
    }
    _getCategory() {
        return api.getCategory().success((content) => {
            var categorys = content.data.list.map((item) => {
                return {
                    name: item.name,
                    key: item.id
                }
            })
            categorys.unshift(this.state.category);
            this.state.categorys = categorys;
            console.log(this.state.categorys)
        })
    }
    _resize() {
        var dom = this.refs[SEARCH_BG_REF] && ReactDOM.findDOMNode(this.refs[SEARCH_BG_REF]);
        if (dom) {
            let parentDOM = ReactDOM.findDOMNode(this.getParent()).parentNode;
            let navDOM = ReactDOM.findDOMNode(this.refs[NAVREF]);
            dom.style.height = parentDOM.clientHeight - navDOM.clientHeight + 'px';
        }
    }
    _renderNav() {
        return (
            <ul
                ref={NAVREF}
                className="nav">
                <li
                    onClick={() => this._onNavSelect(1)}
                    className='dropdown-toggle'>
                    <span className={1 === this.state.index ? 'active' : ''}>
                        {this.state.area.name}
                    </span>
                </li>
                <li
                    onClick={() => this._onNavSelect(2)}
                    className='dropdown-toggle'>
                    <span className={2 === this.state.index ? 'active' : ''}>
                        {this.state.category.name}
                    </span>
                </li>
                <li
                    onClick={() => this._onNavSelect(3)}
                    className='dropdown-toggle'>
                    <span className={3 === this.state.index ? 'active' : ''}>
                        {this.state.fav.name}
                    </span>
                </li>
            </ul>
        );
    }
    _onNavSelect(i) {
        if (i == this.state.index) {
            this.setState({ index: -1 })
        } else {
            this.setState({ index: i })
        }
    }
    _renderList() {
        if (this.state.index == -1) {
            return null;
        }
        var dataSource = [], initialValue;
        switch (this.state.index) {
            case 1:
                dataSource = this.state.areas;
                initialValue = this.state.area;
                break;
            case 2:
                dataSource = this.state.categorys;
                initialValue = this.state.category;
                break;
            case 3:
                dataSource = this.state.favs || [];
                initialValue = this.state.fav;
                break;
        }
        return (
            <section
                ref={SEARCH_BG_REF}
                className='dropdown-list-bg'
            >
                <Selection
                    onSelected={this._onSelectionSelected}
                    dataSource={dataSource}
                    initialValue={initialValue} />
            </section>
        );
    }
    _onSelectionSelected = (item) => {
        let { index } = this.state;
        var isfirst = '';
        switch (index) {
            case 1:
                this.state.area = item;
                break;
            case 2:
                this.state.category = item;
                break;
            case 3:
                this.state.fav = item;
                break;
        }
        this.setState({ index: -1 });
        let { fav, area, category } = this.state;
        if(area.key==this.state.areas[0].key){
            isfirst = 'first';
        }
        this.props.onSelected && this.props.onSelected(fav, area, category,isfirst);
    }
    render() {
        return (
            <div
                ref={WRAPPER_REF}
                style={{position:'absolute',top:0,left:0,right:0}}
                className="search-nav-bar">
                {this._renderNav()}
                {this._renderList()}
            </div>
        );
    }
}

export default SearchNav;