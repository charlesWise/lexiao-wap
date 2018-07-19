'use strict'
import React from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import time from './../../../../util/time';
class CountDown extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this._stopCountDown;
        this.state={
            restTime:0
        }
    }
    componentDidMount() {
        time.countDown(this.props.endTime+Date.now(), this._updateTime)
    }
    componentWillReceiveProps(nextProps) {
        this._stopCountDown && this._stopCountDown();
        time.countDown(nextProps.endTime*1000+Date.now(), this._updateTime)
    }
    
    componentWillUnmount() {
        this._stopCountDown && this._stopCountDown();
    }

    _updateTime=(restTime)=> {
        this.setState({restTime})
    }
    _splitTime(){
        let restTime = this.state.restTime;
        restTime=time.formatLeftTime(restTime);
        return restTime.replace(/[^\d]/g,'').split('');
    }
    _renderTime() {
        let [a1,a2,a3,a4,a5,a6]=this._splitTime();
        return [
            <i key='1'>{a1}</i>,
            <i key='2'>{a2}</i>,
            <em key='em1'>:</em>,
            <i key='3'>{a3}</i>,
            <i key='4'>{a4}</i>,
            <em key='em2'>:</em>,
            <i key='5'>{a5}</i>,
            <i key='6'>{a6}</i>
        ]
    }
    render() {
        return (
            <dd className='countdown'>
                {this._renderTime()}
            </dd>

        );
    }
}

export default CountDown;