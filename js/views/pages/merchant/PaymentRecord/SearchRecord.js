'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

class SearchRecord extends ScreenComponent {
    constructor(...props) {
        super(...props);
    }

    _handerMoble(mobile) {
        if (mobile.length === 11) {
            let head = mobile.substr(0, 3);
            let tail = mobile.substr(mobile.length - 4, 4);
            return head + "****" + tail;
        }
    }

    render() {
        return (
            <div className="base-search-bar-after background-white">
                <section style={{ position: 'relative', width: '100%' }} className='search_section'>
                    {
                        this.props.dataSource.length != 0 && <ul style={{ position: 'absolute', top: 0, zIndex: 999, width: '100%' }} className='search_list'>
                            {
                                this.props.dataSource.map((item, index) => {
                                    return <li key={index}>
                                        <a onClick={(e) => { this.props.onClick(e, 'select_mobile', item.mobile) }}>
                                            <i className="icon_search"></i>{this._handerMoble(item.mobile)}
                                        </a>
                                    </li>
                                })
                            }
                        </ul>
                    }
                    {this.props.dataSource.length === 0 && (
                        <div className="search-no">无搜索结果</div>
                    )}
                </section>

            </div>
        )
    }
}

export default SearchRecord;