'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

class SourceStore extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            sourceData: this.props.sourceData || {},
            storeArr: []
        };
        this.markindex = 0; //所有添加对应标记
        this.breakIndex = 0; //不同级停止更新
        this.levelNum = 0; //同级数量
        this.isJump = false; //是否越级收缩
        this.breakJump = false; //跨级底部级别
        this.isJumpBreak = false; //是否跳级停止
        this.jumpRecord = []; //记录越级没被隐藏的isOpen为true的项
        this.jumpFather = []; //记录越级点击的那个父级dom
        this.isParentJump = false; //是否不同级别越级收缩
        this.parentJumpFather = [];//记录上次点击越级再次越级但并非点击上次一样dom
        this.parentJumpRecord = [];//记录不同越级之前越级没被隐藏的isOpen为true的项
        this.parentBreakJump = false; //如果是最顶级的话记录什么时候跳出
    }
    componentWillMount() {
        this._initRepeatSource(0, this.state.sourceData);//初始化接口过来的数据
    }
    componentWillReceiveProps(nextProps) {
        this.state.storeArr = [];
    }
    _initRepeatSource(level, sourceData) {
        if(level == 0) {
            if(!sourceData.hasOwnProperty('isOpen')) {
                sourceData.isOpen = true;
            }
        }else {
            if(!sourceData.hasOwnProperty('isOpen')) {
                sourceData.isOpen = false;
            }
        }
        if(!sourceData.hasOwnProperty('isPackUp')) {
            sourceData.isPackUp = true;
        }
        sourceData.level = level;
        sourceData.markindex = this.markindex;
        this.markindex++;
        if(sourceData['sub']&&sourceData['sub'].length > 0) {
            level++;
            for(let i = 0; i < sourceData['sub'].length; i++) {
                this._initRepeatSource(level, sourceData['sub'][i]);
            }
        }
    }
    _renderItems(level = 0, subData = this.state.sourceData) {
        this.state.storeArr.push(<Item key={subData.id}
            itemData={subData}
            getStoreInfo={(itemData) => this._getStoreInfo(itemData)}
            openLowerLevel={(curLevel, curMarkindex, isPackUp) => this._openLowerLevel(curLevel, curMarkindex, isPackUp)}
            />);
        if(subData['sub']&&subData['sub'].length > 0) {
            level++;
            for(let i = 0; i < subData['sub'].length; i++) {
                this._renderItems(level, subData['sub'][i]);
            }
        }
        return this.state.storeArr;
    }
    // 收起或选择下级
    _repeatOpenLevel(curLevel, curMarkindex, sourceData, level = 0) {
        if(sourceData.markindex == curMarkindex) {
            sourceData.isPackUp = !sourceData.isPackUp;
        }
        if(sourceData.markindex > curMarkindex&&sourceData.level == curLevel+1) {
            if(this.breakIndex == 1) {
                return;
            }
            sourceData.isOpen = !sourceData.isOpen;
        }

        if(sourceData.markindex > curMarkindex) {
            if(sourceData.level == curLevel) {
                this.breakIndex = 1;
            }else {
                for (let i = 0; i < this.levelNum; i++) {
                    if(this.levelNum == i+1) {
                        this.breakIndex = 1;
                    }
                }
            }
        }
        if(sourceData['sub']&&sourceData['sub'].length > 0) {
            level++;
            for(let i = 0; i < sourceData['sub'].length; i++) {
                if(sourceData['sub']['markindex'] > curMarkindex&&level == curLevel+1) {
                    this.levelNum++;
                }
                this._repeatOpenLevel(curLevel, curMarkindex, sourceData['sub'][i], level);
            }
        }
    }
    _isJump(curLevel, curMarkindex, sourceData) { //是否越级
        if(sourceData.markindex > curMarkindex) {
            if(sourceData.level == curLevel) { //如果遇到同级停止
                this.isJumpBreak = true;
            }
            if(sourceData.is_end!=1&&sourceData.level>curLevel&&!this.isJumpBreak) { //保证不是最后一个商户并且级别大于当前级别
                if(!sourceData.isPackUp) {
                    this.isJump = true;
                }
            }
        }
        if(sourceData['sub']&&sourceData['sub'].length > 0) {
            for(let i = 0; i < sourceData['sub'].length; i++) {
                this._isJump(curLevel, curMarkindex, sourceData['sub'][i]);
            }
        }
    }
    _jumpLayer(curLevel, curMarkindex, sourceData) {
        if(sourceData.level > curLevel&&sourceData.markindex > curMarkindex&&!this.breakJump) {
            if(sourceData.isOpen) {
                sourceData.isOpen = !sourceData.isOpen;
                this.jumpRecord.push(sourceData.markindex);
            }
        }
        if(sourceData.markindex > curMarkindex) {
            if(sourceData.level == curLevel) {
                this.breakJump = true;
            }
        }
        if(sourceData.markindex == curMarkindex) {
            sourceData.isPackUp = !sourceData.isPackUp;
            this.jumpFather.push(sourceData.markindex);
        }
        if(sourceData['sub']&&sourceData['sub'].length > 0) {
            for(let i = 0; i < sourceData['sub'].length; i++) {
                this._jumpLayer(curLevel, curMarkindex, sourceData['sub'][i]);
            }
        }
    }
    _recoveryJumpRecord(sourceData) {
        if(this.jumpRecord.indexOf(sourceData.markindex) != -1) {
            sourceData.isOpen = !sourceData.isOpen;
        }
        if(this.jumpFather.indexOf(sourceData.markindex) != -1) {
            sourceData.isPackUp = !sourceData.isPackUp;
        }
        if(sourceData['sub']&&sourceData['sub'].length > 0) {
            for(let i = 0; i < sourceData['sub'].length; i++) {
                this._recoveryJumpRecord(sourceData['sub'][i]);
            }
        }
    }
    _parentJumpLayer(curLevel, curMarkindex, sourceData) {
        if(curMarkindex == 0) {
            this.parentBreakJump = true;
        }
        if(sourceData.level > curLevel&&sourceData.markindex > curMarkindex) {
            if(sourceData.isOpen) {
                sourceData.isOpen = !sourceData.isOpen;
                this.parentJumpRecord.push(sourceData.markindex);
            }
        }
        if(sourceData.markindex == curMarkindex) {
            sourceData.isPackUp = !sourceData.isPackUp;
            this.parentJumpFather.push(sourceData.markindex);
        }
        if(sourceData['sub']&&sourceData['sub'].length > 0) {
            for(let i = 0; i < sourceData['sub'].length; i++) {
                this._parentJumpLayer(curLevel, curMarkindex, sourceData['sub'][i]);
            }
        }
    }
    _recoveryParentJump(sourceData) {
        if(this.parentJumpRecord.indexOf(sourceData.markindex) != -1) {
            sourceData.isOpen = !sourceData.isOpen;
        }
        if(this.parentJumpFather.indexOf(sourceData.markindex) != -1) {
            sourceData.isPackUp = !sourceData.isPackUp;
        }
        if(sourceData['sub']&&sourceData['sub'].length > 0) {
            for(let i = 0; i < sourceData['sub'].length; i++) {
                this._recoveryParentJump(sourceData['sub'][i]);
            }
        }
    }
    _openLowerLevel(curLevel, curMarkindex) {
        this.levelNum = 0;
        this.breakIndex = 0;
        this.breakJump = false;
        this.isJumpBreak = false;
        this._isJump(curLevel, curMarkindex, this.state.sourceData);
        if(this.jumpFather.length>0) {
            if(this.jumpFather.indexOf(curMarkindex) != -1) {
                this.isJump = false;
            }else if(curMarkindex == 0) {
                this.isParentJump = true;
            }
        }
        if(this.isJump&&!this.isParentJump) { //越级处理
            if(this.jumpRecord.length>0||this.jumpFather.length>0) {
                this._recoveryJumpRecord(this.state.sourceData);
            }
            this._jumpLayer(curLevel, curMarkindex, this.state.sourceData);
        }else {
            if(this.isParentJump) { //不同越级处理
                if((this.parentJumpRecord.length>0||this.parentJumpFather.length>0)&&this.parentBreakJump) {
                    this._recoveryParentJump(this.state.sourceData);
                    this.parentBreakJump = false;
                    this.isParentJump = false;
                }else {
                    this._parentJumpLayer(curLevel, curMarkindex, this.state.sourceData);
                }
            }else {
                if(this.jumpRecord.length>0&&this.jumpFather.length>0) {
                    this._recoveryJumpRecord(this.state.sourceData);
                }
                if(this.jumpRecord.length>0&&this.jumpFather.length>0) { //如果上次越级，再次展开保持之前选中状态
                    if(this.jumpFather.indexOf(curMarkindex) != -1) {
                        this.jumpRecord = [];
                        this.jumpFather = [];
                    }
                }else { //否则正常展开下级
                    this._repeatOpenLevel(curLevel, curMarkindex, this.state.sourceData);
                }
            }
        }
        this.props.openLowerLevel&&this.props.openLowerLevel(this.state.sourceData);
    }
    // 勾选
    _repeatSourceData(id, sourceData) {
        if(sourceData.id == id) {
            sourceData.isSelect = !sourceData.isSelect;
        }else {
            if(sourceData.isSelect) {
                sourceData.isSelect = !sourceData.isSelect;
            }
        }
        if(sourceData['sub']&&sourceData['sub'].length > 0) {
            for(let i = 0; i < sourceData['sub'].length; i++) {
                this._repeatSourceData(id, sourceData['sub'][i]);
            }
        }
    }
    _getStoreInfo(itemData) {
        this._repeatSourceData(itemData.id, this.state.sourceData);
        this.props.getStoreInfo&&this.props.getStoreInfo(itemData.id, itemData.name, this.state.sourceData);
    }
    render() {
        return (
            <ul className="parent-ul">
                {this._renderItems()}
            </ul>
        )
    }
}

export default SourceStore;

class Item extends ScreenComponent {
    constructor(...props) {
        super(...props);
    }
    _selectStore(itemData) {
        this.props.getStoreInfo&&this.props.getStoreInfo(itemData);
    }
    _openLowerLevel(curLevel, curMarkindex) {
        this.props.openLowerLevel&&this.props.openLowerLevel(curLevel, curMarkindex);
    }
    render() {
        let itemData = this.props.itemData,
            step = 0.8;
        return (
            <li className={`parent-list ${!itemData.isOpen && 'dn'}`}>
                <p className="parent-column"
                    style={{paddingLeft: `${itemData.level*step}rem`, fontWeight: `${itemData.level > 0&&'normal'}`}}>
                    <span className="parent-title"
                        onClick={() => this._selectStore(itemData)}
                        >
                        <i className={`${this.props.itemData.isSelect ? 'icon-cell-act': 'icon-cell'}`}></i>{itemData.name}
                    </span>
                    {
                        (itemData.is_end&&itemData.is_end == 1) ? '':
                        <span className="parent-up-close"
                            onClick={() => this._openLowerLevel(itemData.level, itemData.markindex)}
                            >{itemData.isPackUp ? '选择下级 ›' : '收起'}</span>
                    }
                </p>
            </li>
        )
    }
}