'use strict'
//Popup
import React from 'react';

export default class ManualPopup extends React.Component {
    constructor(...props){
        super(...props);
        this.state = {

        }
    }

    render(){
        return <div className="popup">
            <div className="manual_popup">
                <div className="text">很抱歉，您的定位功能已被系统给屏蔽，请前往手机设置中打开定位，或者您也可以手动选择所在城市</div>
                <a className="popup_btn">手动选择</a>
            </div>
            <div className="mask"></div>
        </div>
    }
}
