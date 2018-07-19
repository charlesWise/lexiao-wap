'use strict'
//广告
import React from 'react';
import ScreenComponent from './../../components/ScreenComponent';

class NotOpen extends ScreenComponent {
    constructor(...props){
        super(...props);
        this.state = {

        }
        this._tipsId 
    }
    _showTips=()=>{
        this.getScreen().alert({
            message:<p>您的申请提交成功！<br/>我们会尽快开通该城市</p>
        })
    }
  
    render(){
        return <div className="not_open">
                <img src="/images/index/not_open.png"/>
                <div className="not_open_hei">您所在的城市 目前没有合作商家</div>
                <div className="not_open_hui">您可以申请开通，我们将很快开放该城市</div>
                <a 
                    href="javascript:void(0)" 
                    className="not_open_btn"
                    onClick = {this._showTips}
                    >
                    申请开通
                </a>
            </div>
    }
}

export default NotOpen;