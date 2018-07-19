'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

class SearchRecord extends ScreenComponent {
    constructor(...props) {
        super(...props);
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
                                        <a onClick={(e) => { this.props.onClick(e, 'select_name', item.merchant_name) }}>
                                            <i className="icon_search"></i>{item.merchant_name}
                                        </a>
                                    </li>
                                })
                            }
                        </ul>
                    }
                    {this.props.dataSource.length === 0 && (
                        <div className="search-no" style={{ marginTop: 0 }}>无搜索结果</div>
                    )}
                </section>

            </div>
        )
    }
}

export default SearchRecord;