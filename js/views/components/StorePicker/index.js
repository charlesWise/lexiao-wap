import React, { Component } from 'react';
import _ from 'lodash';

var items = [];

export default class StorePiker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arr: []
        }
    }
    
    componentWillMount() {
        items = [];
        let data = this.props.dataSource || {};
        this._getItems(1, data);
    }  

    _onCancel() {
        this.props.onCancel && this.props.onCancel()
    }

    _onSelected() {
        this.props.onSelected && this.props.onSelected({
            ids: this._getIds(this.state.arr),
            names: this._getNames(this.state.arr)
        })
    }

    _getIds(data) {
        let arr = [];
        data.map((item) => {
            arr.push(item.id)
        })
        return arr.join(',')
    }

    _getNames(data) {
        let arr = [];
        data.map((item) => {
            arr.push(item.name)
        })
        return arr.join(';')
    }

    _onCheck(obj) {
        this.state.arr.push(obj);
    }

    _onDel(obj){
        _.remove(this.state.arr, function (val) {
            return _.isEqual(val, obj);
        });
    }

    _onClick(isChecked, data){
        if(isChecked){
            this._onCheck(data);
        }else{
            this._onDel(data);
        }
    }

    _getItems(depth, data, childName) {
        let style = { paddingLeft: `${(depth - 1) * 0.75}rem` };
        if(depth == 1) style.fontWeight = 'bold';
        if (depth > 2) style.display = 'none';
        let key = `item-depth-${data.id}`;
        let hasSub = data.sub && data.sub.length > 0;

        items.push(<Item name={childName || ''} childName={key} key={key} style={style} data={{
            id: data.id,
            name: data.name
        }} onClick={this._onClick.bind(this)} hasSub={hasSub} showDeep={depth == 1}/>);

        let depth1 = depth + 1;
        if (hasSub){
            let self = this;
            data.sub && data.sub.map((val)=>{
                self._getItems(depth1, val, key);
            })
        }
    }

    render(){
        return (
            <div className="appliy-store" onClick={(event) => { event.stopPropagation(); }}>
                <div className="title">
                    <span onClick={this._onCancel.bind(this)}>取消</span>
                    <span>添加门店</span>
                    <span onClick={this._onSelected.bind(this)}>完成</span>
                </div>
                <div className="drop-down-list">
                    <ul className="parent-ul">
                        <li className="parent-list">
                            {items}
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: false,
            showDeep: false
        }
    }

    componentWillMount(){
        this.setState({
            showDeep: this.props.showDeep
        })
    }

    _onClick(){
        let isChecked = !this.state.isChecked
        this.setState({
            isChecked: isChecked
        })
        this.props.onClick && this.props.onClick(isChecked, this.props.data);
    }

    _toggleDeep() {
        let showDeep = !this.state.showDeep;
        let collection = document.getElementsByName(this.props.childName);
        console.log(collection)
        for (let i = 0; i < collection.length; i++) {
            collection[i].style.display = showDeep ? 'flex' : 'none'
        }
        this.setState({
            showDeep: showDeep
        })
    }

    render(){
        return (
            <p name={this.props.name} style={this.props.style} className="parent-column">
                <span className="parent-title" onClick={this._onClick.bind(this)}>
                    <i className={this.state.isChecked ? "icon-store-act" : "icon-store"}></i>
                    {this.props.data.name || ''}
                </span>
                {
                    this.props.hasSub &&
                    <span className="parent-up-close" onClick={this._toggleDeep.bind(this)}>{this.state.showDeep ? '收起' : '选择下级'} ›</span>
                }
            </p>
        )
    }
}

class Pre extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div className="appliy-store-wrap">
                <div className="appliy-store">
                    <div className="title"><span>取消</span><span>添加门店</span><span>完成</span></div>
                    <div className="drop-down-list">
                        <ul className="parent-ul">
                            <li className="parent-list">
                                <p className="parent-column">
                                    <span className="parent-title"><i className="icon-store-act"></i>肯德基上海总店</span>
                                    <span className="parent-up-close">选择下级 ›</span>
                                </p>
                                <ul className="first-child-ul">
                                    <li className="first-child-list">
                                        <p className="first-column">
                                            <span className="first-title"><i className="icon-store"></i>一级子商户01</span>
                                            <span className="first-up-close">选择下级 ›</span>
                                        </p>
                                        <ul className="second-child-ul">
                                            <li className="second-child-list">
                                                <p className="second-column">
                                                    <span className="second-title"><i className="icon-store"></i>二级子商户01</span>
                                                    <span className="second-up-close">选择下级 ›</span>
                                                </p>
                                            </li>
                                            <li className="second-child-list">
                                                <p className="second-column">
                                                    <span className="second-title"><i className="icon-store"></i>二级子商户01</span>
                                                    <span className="second-up-close">选择下级 ›</span>
                                                </p>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}