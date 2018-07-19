'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import SearchBar from './../../../components/SearchBar'
import Popular from './Popular';
import History from './History';
import Suggestion from './Suggestion';
import Result from './Result';
import search from './../../../../controllers/search'
import api from './../../../../controllers/api';
const SUGGESTION_REF = 'SUGGESTION_REF';
class MerchantSearch extends ScreenComponent {
    static pageConfig = {
        path: '/search/merchant',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.state = {
            popularHidden: false,
            historyHidden: false,
            suggestionHidden: true,
            resultHidden: true,
            showNav:false,
            inputValue: '',
            searchResult: [],
            searchValue:''
        }
        this.navigationOptions = {
            title: '搜索商家'
        }
    }
    componentDidMount() {
        window.addEventListener('keypress', this._onKeyPress, false);
    }
    componentWillUnmount() {
        window.removeEventListener('keypress', this._onKeyPress, false);
        clearTimeout(this._suggestionHiddenTimeout);
    }

    _onKeyPress = (e) => {
        if (e.keyCode === 13) {
            this.state.showNav = false;
            this._doSearch(this.state.inputValue);
        }
    }
    _inputOnFocus = () => {
        this.setState(
            {
                popularHidden: true,
                historyHidden: true,
                suggestionHidden: false,
                resultHidden:true
            }
        )
    }
    _inputOnBlur = () => {
        // if (!this.state.resultHidden) {
        //     setTimeout(() => {
        //         this.setState(
        //             {
        //                 suggestionHidden: true,
        //             }
        //         )
        //     }, 500);
        //     return;
        // } else {
        //     this._suggestionHiddenTimeout = setTimeout(() => {
        //         if(this._onSearch){
        //             return
        //         }
        //         this._onSearch = false;
        //         this.setState(
        //             {
        //                 suggestionHidden: true,
        //                 popularHidden: false,
        //                 historyHidden: false,
        //                 resultHidden: true
        //             }
        //         )
        //     }, 500);
        // }

        this.setState(
            {
                suggestionHidden: true,
                popularHidden: false,
                historyHidden: false,
                resultHidden: true
            }
        )
    }
    _inputOnChange = (e) => {
        var value = e.target.value;
        this.state.inputValue = value;
        if(!value||/^\s+$/.test(value)){
            this._inputOnBlur();
        }else{
            this._inputOnFocus();
            this.refs[SUGGESTION_REF] && this.refs[SUGGESTION_REF].suggest(this.state.inputValue);
        }
    }
    _onCancel = () => {
        //统一返回首页
        this.getScreen().getNavigation().goBack();
        // this.setState(
        //     {
        //         popularHidden: false,
        //         historyHidden: false,
        //         suggestionHidden: true,
        //         resultHidden: true
        //     }
        // )
        // return true;
    }
    _doSearch = (inputValue,fav,area,category,isfirst) => {
        if(!inputValue||/^\s+$/.test(inputValue)){
            return;
        }
        this.state.merchant_name = inputValue;
        search.searchMerchant({
            merchant_name: inputValue,
            type:isfirst,
            area_id: area||'',
            merchant_type_id: category||'',
            order_by: fav||'',
        }).success((content, next, abort) => {
            this.setState({
                searchResult: content.data,
                popularHidden: true,
                historyHidden: true,
                suggestionHidden: true,
                resultHidden: false
            })
        });
        this.refs.SearchBarRef.setInputValue(inputValue);

    }
    _onSearch(name) {
        clearTimeout(this._suggestionHiddenTimeout);
        this.state.showNav = false;
        this._onSearch = true;
        this.refs.SearchBarRef && this.refs.SearchBarRef.setInputValue(name);
        this._doSearch(name);
    }
    _onNavSelected=(fav,area,category,isfirst)=>{
        this.state.showNav = true;
        this._doSearch(
            this.state.merchant_name,
            fav.key,
            area.key,
            category.key,
            isfirst
        );
    }
    render() {
        return (
            <div className="search_container">
                <SearchBar
                    placeholder='请输入商户名'
                    type='input'
                    ref='SearchBarRef'
                    onCancel={this._onCancel}
                    onChange={this._inputOnChange}
                />
                <div className="base-search-bar-after background-white">
                    <Popular
                        onSelect={(...args)=>{
                            this.state.showNav = false;
                            this._doSearch(...args);
                        }}
                        hidden={this.state.popularHidden} />
                    <History
                        onSelected={(...args)=>{
                            this.state.showNav = false;
                            this._doSearch(...args);
                        }}
                        hidden={this.state.historyHidden} />
                    <Suggestion
                        ref={SUGGESTION_REF}
                        onSearch={(...args)=>{
                            this.state.showNav = false;
                            this._doSearch(...args);
                        }}
                        hidden={this.state.suggestionHidden} />
                    <Result
                        onSelected={this._onNavSelected}
                        data={this.state.searchResult}
                        showNav={this.state.showNav}
                        hidden={this.state.resultHidden} />
                </div>
            </div>
        )
    }
}

export default MerchantSearch;   