import React, { Component } from 'react';
import _ from 'lodash';

import Wrapper from './../../components/Picker/Wrapper';
import Picker from './../../components/Picker/Picker';
import Header from './../../components/Picker/Header';
import ScreenComponent from './../../components/ScreenComponent';

var range_arr = [{
    id: 1,
    name: '周一'
}, {
    id: 2,
    name: '周二'
}, {
    id: 3,
    name: '周三'
}, {
    id: 4,
    name: '周四'
}, {
    id: 5,
    name: '周五'
}, {
    id: 6,
    name: '周六'
}, {
    id: 7,
    name: '周日'
}]

export default class WeekRange extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            start_arr: range_arr,
            end_arr: range_arr
        }
    }

    componentWillMount(){
        this.state.start = this.props.start || range_arr[0]['id'];        
        this.state.end = this.props.end || range_arr[0]['id'];        
    }

    _onStartChange(obj) {
        this.state.start = obj.id;
    //     this.setState({
    //         end_arr: range_arr.slice(obj.id - 1)
    //     })
    }

    _onEndChange(obj) {
        this.state.end = obj.id;
    //     let index = (obj.id == 1 ? 6 : obj.id)
    //     this.setState({
    //         start_arr: range_arr.slice(0, index)
    //     })
    }

    _onCancel() {
        this.props.onCancel && this.props.onCancel();
    }

    _onSelected() {
        let start = this.state.start;
        let end = this.state.end;
        if(end < start){
            this.getScreen().toast('开始时间不能大于结束时间');
            return;
        }
        
        this.props.onSelected && this.props.onSelected({
            start: start,
            end: end
        })
    }

    render() {
        return <Wrapper
            style={{
                position: 'absolute',
                width: '100%',
                bottom: 0
            }}
            header={
                <Header
                    onCancel={this._onCancel.bind(this)}
                    onSelected={this._onSelected.bind(this)}
                />
            }
        >
            <Picker
                dataSource={this.state.start_arr}
                defaultValue={this.state.start}
                labelName='name'
                valueName='id'
                onChange={this._onStartChange.bind(this)}
            />
            <Picker
                dataSource={this.state.end_arr}
                defaultValue={this.state.end}
                labelName='name'
                valueName='id'
                onChange={this._onEndChange.bind(this)}
            />
        </Wrapper>
    }
}