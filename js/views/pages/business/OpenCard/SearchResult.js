'use strict'
import React  from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

export default class SearchResult extends ScreenComponent{
    constructor(...props){
        super(...props);
        this.state = {
        }
    }
    _itemName(bankName) {
        return (
            <p>
                {bankName&&bankName.split(this.props.searchName)[0]}
                <span>{this.props.searchName}</span>
                {bankName&&bankName.split(this.props.searchName)[1]}
            </p>
        )
    }
    _haveResult() {
        let searchResultList = this.props.searchResultList;
        return (
            <ul>
            {
                searchResultList.map((item, i) => {
                    return (
                        <li key={'search'+i}
                            onClick={() => {
                                if(this.props.sign == 'bank') {
                                    this.props.onClick("bank", item)
                                }else if(this.props.sign == 'branch') {
                                    this.props.onClick("branch", item)
                                }
                            }}>
                            {
                                this._itemName(item.code_name||item.bank_name)
                            }
                        </li>
                    )
                })
            }
            </ul>
        )
    }
    _noResult() {
        return (
            <p className="no-result">无搜索结果</p>
        )
    }
    render(){
        if(this.props.searchResultList&&this.props.searchResultList.length>0) {
            return (
                <div className="search-bank-result">
                    {this._haveResult()}
                </div>
            )
        }else if(this.props.searchName&&!this.props.searchResultList) {
            return (
                <div className="search-bank-result">
                    {this._noResult()}
                </div>
            )
        }else {
            return null;
        }
    }
}