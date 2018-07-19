import React from 'react';
import ScreenComponent from './../ScreenComponent';
const INPUT_REF = 'INPUT_REF';
class Input extends ScreenComponent {
    constructor(...props) {
        super(...props);
    }
    _onCancel = () => {
        var onCancel = this.props.onCancel;
        if (!onCancel || !onCancel()) {
            this.getScreen().getNavigation().goBack();
        }
    }
    _inputClear = () => {
        this.refs.INPUT_REF.value = '';
    }
    setValue(value){
        this.refs.INPUT_REF.value = value;
    }
    render() {
        let props = this.props;
        return (
            <div className="base-search-bar ">
                <div className="base-search-input">
                    <i
                        className="base-search-input-icon_search" />
                    <i
                        onClick={this._inputClear}
                        className="base-search-input-icon_del" />
                    <input
                        type="text"
                        className="search_input"
                        ref='INPUT_REF'
                        onChange={this.props.onChange}
                        onFocus={this.props.onFocus}
                        onBlur={this.props.onBlur}
                        autoFocus="autofocus"
                        placeholder={props.placeholder || '请输入'} />
                </div>
                <a
                    href="javascript:void(0)"
                    className="head_cancel"
                    onClick={this._onCancel}
                >
                    取消
                </a>
            </div>
        );
    }
}

export default Input;