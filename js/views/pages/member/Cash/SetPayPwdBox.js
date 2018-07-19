'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

export default class SetPayPwdBox extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            pwd: '',
            pwd1: '',
            pwd2: '',
            type: 'FIRST' //SECOND
        }
    }

    _onKeyClick(num){
        if(this.state.pwd.length >=6) return;
        this.setState({
            pwd: this.state.pwd.concat(num)
        },()=>{
            if(this.state.pwd.length == 6){
                if(this.state.type == 'FIRST'){
                    this.state.pwd1 = this.state.pwd;
                    this.setState({
                        pwd: '',
                        type: 'SECOND'
                    })
                }
                if (this.state.type == 'SECOND') {
                    this.state.pwd2 = this.state.pwd;
                    if(this.state.pwd1 != this.state.pwd2){
                        this.setState({
                            pwd: '',
                            type: 'FIRST'
                        })
                        this.getScreen().toast('两次输入密码不一致')
                    }else{
                        this.props.onEnd && this.props.onEnd(this.state.pwd)
                    }
                }
                
            }
        })
    }

    _onDel(){
        let length = this.state.pwd.length;
        this.setState({
            pwd: this.state.pwd.substr(0, length - 1)
        })
    }

    render() {
        return (
            <div className="paybox" onClick={(e)=>{
                e.stopPropagation()
            }}>
                <div className="inner-box">
                    <span className="close" onClick={() => {
                        this.props.onCancel && this.props.onCancel()
                    }}></span>
                    <h1 className="title">{'设置支付密码'}</h1>
                    {
                        this.state.type == 'FIRST' &&
                        <div className="tips">为了确保账户资金安全，请设置<br />您的支付密码</div>
                    }
                    {
                        this.state.type == 'SECOND' &&
                        <div className="tips">请再次确认您的支付密码</div>
                    }
                    <div className="input-box">
                        <span>{this.state.pwd.length >= 1 ? '●' : ''}</span>
                        <span>{this.state.pwd.length >= 2 ? '●' : ''}</span>
                        <span>{this.state.pwd.length >= 3 ? '●' : ''}</span>
                        <span>{this.state.pwd.length >= 4 ? '●' : ''}</span>
                        <span>{this.state.pwd.length >= 5 ? '●' : ''}</span>
                        <span>{this.state.pwd.length >= 6 ? '●' : ''}</span>
                    </div>
                    <div className="flexable-box">
                        <div className="flexable">
                            <div onClick={this._onKeyClick.bind(this,1)} className="input-key">1</div>
                            <div onClick={this._onKeyClick.bind(this,2)} className="input-key">2</div>
                            <div onClick={this._onKeyClick.bind(this,3)} className="input-key">3</div>
                        </div>
                        <div className="flexable">
                            <div onClick={this._onKeyClick.bind(this,4)} className="input-key">4</div>
                            <div onClick={this._onKeyClick.bind(this,5)} className="input-key">5</div>
                            <div onClick={this._onKeyClick.bind(this,6)} className="input-key">6</div>
                        </div>
                        <div className="flexable">
                            <div onClick={this._onKeyClick.bind(this,7)} className="input-key">7</div>
                            <div onClick={this._onKeyClick.bind(this,8)} className="input-key">8</div>
                            <div onClick={this._onKeyClick.bind(this,9)} className="input-key">9</div>
                        </div>
                        <div className="flexable">
                            <div></div>
                            <div onClick={this._onKeyClick.bind(this,0)} className="input-key">0</div>
                            <div onClick={this._onDel.bind(this)} className="key-del"><i></i></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
