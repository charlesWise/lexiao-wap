'use strict'
import React from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import Input from './../../../components/Input';
import ValidateImg from './ValidateImg';
import api from './../../../../controllers/api';

export default class GraphicPopup extends ScreenComponent {
    constructor(...props){
        super(...props);
        this.state = {
            graphicCode: ''
        }
    }
    _stopPropagation = (e) => {
        e.stopPropagation();
    }
    _onChange = (value, inputType) => {
        if(inputType == 'GRAPHIC') {
            this.setState({graphicCode: value})
        }
    }
    _onCancel = () => {
        this.props.onCancel&&this.props.onCancel();
    }
    _onConfirm = () => {
        const { graphicCode } = this.state;
        api.checkVerify({   // 验证图形验证码
            code: graphicCode
        }).success((res) => {
            this.props.onConfirm&&this.props.onConfirm();
        }).error((res) => {
            this.VALIDATEIMG&&this.VALIDATEIMG._refreshCode();
            this.setState({graphicCode: ''})
            this.getScreen().toast(res.message)
        })
    }
    render(){
        return <div className="graphic-popup-content" onClick={this._stopPropagation}>
            <div className="popup-content">
                <div className="title">
                    <p>安全验证</p>
                    <p>请完成以下操作</p>
                </div>
                <div className="graphic-box">
                    <div className="graphic">
                        <Input
                            type= {'text'}
                            autofocus= {true}
                            placeholder= {'请输入图形验证码'}
                            value= {this.state.graphicCode}
                            inputType= {'GRAPHIC'}
                            onChange= {this._onChange}
                            />
                        <ValidateImg 
                            ref= {v => this.VALIDATEIMG = v}
                            />
                    </div>
                </div>
                <div className="hand-button">
                    <span onClick={this._onCancel}>取消</span>
                    <span onClick={this._onConfirm}>确定</span>
                </div>
            </div>
        </div>
    }
}
