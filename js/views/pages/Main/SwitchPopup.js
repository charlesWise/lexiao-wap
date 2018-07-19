'use strict'
//Popup
import React from 'react';

export default class SwitchPopup extends React.Component {
    constructor(...props){
        super(...props);
        this.state = {

        }
    }

    render(){
        return <div className="popup">
            <div className="manual_popup switch_popup">
                <div className="text">定位到您在杭州<br/>是否切换至该城市进行探索？</div>
                <div className="switch_btn"><a className="popup_btn">手动选择</a><a className="popup_btn">手动选择</a></div>
            </div>
            <div className="mask"></div>
        </div>
    }
}
