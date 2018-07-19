'use strict'
import React, { Component } from 'react';

class Input extends Component {
    constructor(...props) {
        super(...props);
        this.state = {
            isDel: false,
            isShowEyes: false
        }
    }
    componentWillReceiveProps(nextProps) {
        const { inputType } = this.props;
        if(inputType == 'GRAPHIC') {
            if(!nextProps.value) {
                this.setState({
                    isDel: false
                })
            }
        }
    }
    _onChange = () => {
        const { inputType } = this.props;
        if(this.INPUT_REF&&this.INPUT_REF.value) {
            if(inputType == 'MOBILE') {  // 设置是手机号时，误输入非数字不出现del
                let reg = /^[0-9]+.?[0-9]*$/;
                if (reg.test(this.INPUT_REF.value)) {
                    if(!this.state.isDel) {
                        this.setState({
                            isDel: !this.state.isDel
                        })
                    }
                }
            }else {
                if(!this.state.isDel) {
                    this.setState({
                        isDel: !this.state.isDel
                    })
                }
            }
        }else {
            this.setState({
                isDel: !this.state.isDel
            })
        }
        this.props.onChange&&this.props.onChange(this.INPUT_REF.value, inputType);
    }
    _onFocus = () => {
        if(this.INPUT_REF&&this.INPUT_REF.value) {
            if(!this.state.isDel) {
                this.setState({
                    isDel: !this.state.isDel
                })
            }
        }
    }
    _onBlur = () => {
        if(this.INPUT_REF&&this.INPUT_REF.value) {
            if(this.state.isDel) {
                this.setState({
                    isDel: !this.state.isDel
                })
            }
        }
    }
    _clearVal = () => {
        this.INPUT_REF.value = '';
        const { inputType } = this.props;
        this.setState({
            isDel: !this.state.isDel
        })
        this.props.onChange&&this.props.onChange(this.INPUT_REF.value, inputType);
    }
    _eyesSwitch = () => {
        if(this.INPUT_REF) {
            if(!this.state.isShowEyes) {
                this.INPUT_REF.type = 'text';
                this.setState({
                    isShowEyes: !this.state.isShowEyes
                })
            }else {
                this.INPUT_REF.type = 'password';
                this.setState({
                    isShowEyes: !this.state.isShowEyes
                })
            }
        }
    }
    render() {
        const { type, value, autofocus, placeholder, isEyes, isReadOnly } = this.props;
        return (
            <div className={`item-input-box ${isReadOnly&&'read-only'}`}>
                <span>
                    <input
                        ref={v => this.INPUT_REF = v}
                        type={type || 'text'}
                        value={value}
                        autoFocus={autofocus || false}
                        placeholder={placeholder || '请输入'}
                        onChange={this._onChange}
                        readOnly={isReadOnly}
                        // onFocus={this._onFocus}
                        // onBlur={this._onBlur}
                        />
                </span>
                <span>
                    {
                        this.state.isDel&&<i className="icon-del"
                        onClick={this._clearVal}
                        />
                    }
                    {
                        isEyes&&<i className={`${this.state.isShowEyes ? 'icon-show-eyes' : 'icon-hide-eyes'}`}
                                onClick={this._eyesSwitch}
                            />
                    }
                </span>
            </div>
        );
    }
}

export default Input;