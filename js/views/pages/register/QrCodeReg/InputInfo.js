'use strict'
import React from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import api from './../../../../controllers/api';
import Input from './../../../components/Input';
import ValidateCode from './ValidateCode';
import Agreement from './Agreement';
import GoRegister from './GoRegister';
import TipsPopup from './TipsPopup';
import GraphicPopup from './GraphicPopup';

var GRAPHICPOPUP = null;
class InputInfo extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            mobile: '',
            verifyCode: '',
            password: 'm123456',
            isCheck: true,
            isReadOnly: false
        }
    }
    componentDidMount() {
        this._checkIsMobile()
    }
    _checkIsMobile() {
        let navigation = this.getScreen().getNavigation(),
            { mobile } = navigation.state.params;
        if(mobile) {
            this.setState({
                mobile,
                isReadOnly: true
            });
            if(this.MOBILEINPUT && this.MOBILEINPUT.INPUT_REF) {
                this.MOBILEINPUT.INPUT_REF.focus();
            }
        }
    }
    _onChange = (value, inputType) => {
        if(inputType == 'MOBILE') {
            let mobile = value.replace(/[^\d]/g,'');
            if(mobile.length > 11) return;
            this.setState({mobile})
        }
        if(inputType == 'VERIFYCODE') {
            this.setState({verifyCode: value})
        }
        if(inputType == 'PWD') {
            this.setState({password: value})
        }
    }
    _onTipsPopup = () => {
        const TIPPOPUP = this.getScreen().showPopup({
            content: <TipsPopup onClose = {() => {
                        this.getScreen().hidePopup(TIPPOPUP);
                    }}
                />
        })
    }
    _onGraphicPopup = () => {
        GRAPHICPOPUP = this.getScreen().showPopup({
            content: <GraphicPopup
                    onCancel = {() => {
                        this.getScreen().hidePopup(GRAPHICPOPUP);
                    }}
                    onConfirm = {this._onConfirm}
                />
        })
    }
    _onConfirm = () => {
        const { mobile } = this.state;
        api.getMobileCodeRegister({  //  获取注册动态码
            mobile
        }).success((res) => {
            this.VALIDATECODE&&this.VALIDATECODE.countDown();
            this.getScreen().hidePopup(GRAPHICPOPUP);
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }
    render() {
        return (
            <div className="er-code-input-info">
                <Input
                    ref= {v => this.MOBILEINPUT = v}
                    isReadOnly={this.state.isReadOnly}
                    type= {'tel'}
                    autofocus= {true}
                    placeholder= {'请输入手机号'}
                    value= {this.state.mobile}
                    inputType= {'MOBILE'}
                    onChange= {this._onChange}
                    />
                <div className="verify-code">
                    <Input
                        type= {'tel'}
                        placeholder= {'请输入验证码'}
                        inputType= {'VERIFYCODE'}
                        onChange= {this._onChange}
                        />
                    <ValidateCode
                        ref= {v => this.VALIDATECODE = v}
                        mobile= {this.state.mobile}
                        onGraphicPopup= {this._onGraphicPopup}
                        onTipsPopup= {this._onTipsPopup}
                        />
                </div>
                {
                    // <Input
                    //     type= {'password'}
                    //     isEyes= {true}
                    //     placeholder= {'设置6位以上字母数字组合密码'}
                    //     inputType= {'PWD'}
                    //     onChange= {this._onChange}
                    //     />
                }
                <Agreement 
                    isCheck={this.state.isCheck}
                    onCheck={() => {
                        this.setState({isCheck: !this.state.isCheck})
                    }}
                    />
                <GoRegister
                    onTipsPopup= {this._onTipsPopup}
                    {...this.state}/>
            </div>
        );
    }
}

export default InputInfo;