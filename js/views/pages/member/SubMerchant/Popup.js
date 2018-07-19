'use strict'
import React from 'react';

export default class Popup extends React.Component {
    constructor(...props){
        super(...props);
    }

    render(){
        return <div className="sub-merchant-popup">
            <div className="merchant-popup">
                {
                    this.props.title && <div className="title">{this.props.title}</div>
                }
                <div className="text">{this.props.text}</div>
                <div className="popup-btn">
                    <a href="javascript:;" onClick={() => {this.props.closePop && this.props.closePop()}}>{this.props.btnText}</a>
                    {
                        this.props.goBtnText && <a href="javascript:;" onClick={() => {this.props.unbundSubMerchant && this.props.unbundSubMerchant()}}>{this.props.goBtnText}</a>
                    }
                </div>
            </div>
        </div>
    }
}
