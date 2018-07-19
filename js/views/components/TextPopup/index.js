'use strict'
//TextPopup
import React from 'react';

export default class TextPopup extends React.Component {
    constructor(...props) {
        super(...props);
        this.state = {
            text: '',
            text_num: 0
        }
    }

    _doSubmit() {
        this.props.onClose && this.props.onClose();
    }
    _clear() {
        this._onChangeText('');
    }
    _onChangeText(text) {
        this.setState({
            text,
            text_num:text.length
        });
        this.props.onChangeText && this.props.onChangeText(text);
    }

    render() {
        let {
            limit,
            clear
        } = this.props;
        if (limit === undefined) {
            limit = 150;
        }
        if (clear === undefined) {
            clear = true;
        }
        return <div className="popup" onClick={(e) => {
            e.stopPropagation();
        }}>
            <div className="TextPopup" style={{ bottom: '0rem' }}>
                <textarea 
                    autoFocus={true}
                    type="text"
                    placeholder="欢迎您提出宝贵的投诉建议，帮助我们做的更好！" onChange={(e) => {
                    let data = e.target.value;
                    if (limit !== 0 && data.length > limit) {
                        data = data.slice(0, limit);
                    }
                    this._onChangeText(data);
                }} value={this.state.text} />
                {clear&&<i className="icon_del" onClick={() => {
                    this._clear();
                }}></i>}
                {limit !== 0 && <em>{limit - this.state.text_num}</em>}
                <a className="popup_btn" onClick={() => {
                    this._doSubmit()
                }}>提交</a>
            </div>
        </div>
    }
}
