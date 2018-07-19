import React from 'react';
import ScreenComponent from "./../../../components/ScreenComponent";

class Search extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            isShowCancel: false,
            isShowClear: false
        }
    }
    showClear() {
        this.setState({isShowClear: true})
    }
    hideClear() {
        this.INPUTREF.value = '';
        this.setState({isShowClear: false})
        this.props.onClearSearch&&this.props.onClearSearch();
    }
    showCancel() {
        this.setState({isShowCancel: true})
    }
    hideCancel() {
        this.INPUTREF.value = '';
        this.setState({isShowCancel: false, isShowClear: false})
    }
    render() {
        const {onChange, onFocus, onCancel, onBlur, placeholder} = this.props;
        return (
            <div className="bank-search-bar">
                <span>
                    <i
                        className="icon-search" />
                    <input
                        type="text"
                        className="search-input"
                        ref={v => this.INPUTREF = v}
                        onChange={onChange}
                        onFocus={onFocus}
                        placeholder={placeholder || '请输入'} />
                    
                    {
                        this.state.isShowClear&&<i
                            onClick={() => this.hideClear()}
                            className="icon-del" />
                    }    
                </span>
                {
                    this.state.isShowCancel&&<span>
                        <a
                            href="javascript:;"
                            onClick={onCancel}
                        >
                            取消
                        </a>
                    </span>
                }
            </div>
        );
    }
}

export default Search;