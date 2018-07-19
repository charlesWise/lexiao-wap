'use strict'
import React from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

import ReactDOM from 'react-dom';

class Item extends ScreenComponent {
    render() {
        return (
            <li
                onClick={this.props.onClick}
                className={this.props.selected ? 'active' : ''}>
                {this.props.title}
            </li>
        )
    }
}
class Selection extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            selected: this.props.initialValue
        }
    }
    _onSelected(item) {
        this.props.onSelected&&this.props.onSelected(item);
    }
    _renderItem(dataSource, selected) {
        return dataSource.map((item) => {
            return <Item
                key={item.name+item.key}
                title={item.name}
                onClick={()=>this._onSelected(item)}
                selected={selected.key === item.key}
            />
        });
    }
    render() {
        let {
            dataSource,
            initialValue
        } = this.props;
        // let { selected } = this.state;
        return (
            <ul className="dropdown-list">
                {this._renderItem(dataSource, initialValue)}
            </ul>
        );
    }
}

export default Selection;