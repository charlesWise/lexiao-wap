'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import api from './../../../../controllers/api';


class Suggestion extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            data: []
        }
        this._suggesting
    }
    componentWillUnmount() {
        clearTimeout(this._suggesting);
    }

    _search(name) {
        if (this.props.onSearch) {
            this.props.onSearch(name);
        }
    }
    _renderData() {
        return this.state.data.map((item, i) => {
            return (
                <li
                    key={i}>
                    <a
                        onClick={() => this._search(item.name)}
                        href="javascript:void(0)">
                        <i className="icon_search" />
                        {item.name}
                        <span
                            className="number">
                            约{item.counts}个结果
                        </span>
                    </a>
                </li>
            );
        });

    }
    suggest(name) {
        clearTimeout(this._suggesting);
        this._suggesting = setTimeout(() => {
            if(!name||/^\s+$/.test(name)){
                this.setState({ data: [] }) ;
                return;
            }
            api.merchantSearchLikeList({ name }).success((content) => {
                if (content.data) {
                    this.setState({ data: content.data.list || [] })
                }
            })
        }, 200);

    }
    render() {
        if (this.props.hidden) {
            return null;
        }
        return (
            <section
                style={{ position: 'relative', width: '100%' }}
                className='search_section'>
                <ul
                    style={{ position: 'absolute', top: 0, zIndex: 999, width: '100%' }}
                    className='search_list'>
                    {this._renderData()}
                </ul>
            </section>

        );
    }
}
export default Suggestion;