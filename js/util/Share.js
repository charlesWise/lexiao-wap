/**
 * @Share 自定义分享
 * @author chenrunsheng
 */

'use strict';
import Bridge from './bridge';
import api from './../controllers/api';
class Share {
    constructor() {
    }
    /**
     * @param  微信 conf：api参数 params：自定义分享内容
     * @return {null}
     */
    _doWx(conf, params) {
        wx.config({
            debug: false,
            appId: conf.appId,
            timestamp: conf.timestamp,
            nonceStr: conf.nonceStr,
            signature: conf.signature,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareQZone',
                'onMenuShareWeibo'
            ]
        })
        wx.ready(() => {
            let wxShareData = {
                title: params.share_title,
                desc: params.share_desc,
                link: params.share_url,
                imgUrl: params.share_img
            };
            wx.onMenuShareAppMessage(wxShareData);  // 微信好友
            wx.onMenuShareTimeline(wxShareData);  // 朋友圈
            wx.onMenuShareQQ(wxShareData);  // QQ
            wx.onMenuShareQZone(wxShareData);  // QQ空间
            wx.onMenuShareWeibo(wxShareData);  // 腾讯微博
        })
    }
    /**
     * @param  微信 params：自定义分享内容
     * @return {null}
     */
    _wxShare(params) {
        let url = encodeURIComponent(window.location.href.split('#')[0]);
        api.getJssdk({url}).success((content, next, abort) => {
            if (content.boolen == 1) {
                this._doWx(content.data, params);
            }
        })
    }
    /**
     * @func   goToShare
     * @param  {null}
     */
    goToShare(params, cb) {
        if(Bridge.isAppClient) {
            Bridge.toNewShare&&Bridge.toNewShare(params);
        }else {
            this._wxShare(params);
            cb&&cb();
        }
    }
}
export default new Share();