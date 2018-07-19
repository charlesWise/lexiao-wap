'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import Bridge from './../../../../util/bridge';
import api from './../../../../controllers/api';
import Swiper from './../../../components/Swiper';
import ResizeImage from '../../../components/ResizeImage';

class BannerIndicator extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            page: this.props.initialPage || 0
        }
    }
    onPageSelected(event) {
        this.setState({
            page: event.nativeEvent.position
        })
    }
    render() {
        return (
            <span
                onClick={(e)=>e.stopPropagation()}
                style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    color: '#fff',
                    right: '10px'
                }}>
                <em>{this.state.page + 1}/
                {this.props.count}</em>
                <span style={{position:'absolute',right:0}} onClick={()=>this.props.closeScreen()}>关闭</span>
            </span>
        )
    }
}

class MerchantSettledInviteData extends ScreenComponent {
    static pageConfig = {
        path: '/member/merchantsettled/invitedata',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.state = {

        }
        this.navigationOptions = {
            title: '我的申请资料'
        }
        this.state = {
            tab: 1,
            data: {},
            isShowBigPic: false,
            totalIndex: 0,
            currentIndex: 0,
            bigUrl: '',
            startX: '',
            startY: '',
            endX: '',
            endY: '',
            refresh: false
        }
        this.suffix = 0;
    }

    componentDidMount() {
        this._getData();
    }
    contribute() {
        return {
            refresh: this.state.refresh
        };
    }
    _getData() {
        api.applyInfo({

        }).success((content) => {
            console.log('onsuccess>>>>', content)
            this.setState({
                data: content.data || {}
            })
        }).error((data) => {
            this.getScreen().toast(data.message)
        })
    }

    _doAction(type) {
        if (type == 0) {
            this.getScreen().alert({
                message: <span style={{ fontSize: '.8rem', color: 'rgba(51,51,51,1)' }}>您确定拒绝入驻平台么？</span>,
                buttons: [
                    { text: "再想想" },
                    {
                        text: "确认",
                        onPress: () => { this._checkDo(type) }
                    }
                ]
            });
        } else {
            this._checkDo(type)
        }
    }

    _checkDo(type) {
        api.bdInviteMerCheckDo({
            status: type
        }).success((content) => {
            if (type == 1) {
                this.getScreen().alert({
                    title: <img style={{ height: '3.2rem', width: '3.2rem', marginTop: '-2rem', position: 'relative', top: '1.8rem' }} src="/icon/icon_waiting.png" />,
                    message: <span style={{ fontSize: '.8rem', color: 'rgba(51,51,51,1)', padding: '0 2.2rem', lineHeight: '1.2rem', display: 'block' }}>入驻申请提交平台审核中请耐心等待...</span>,
                    buttons: [
                        {
                            text: '我知道了',
                            onPress: () => { this._getStatus(type) }
                        }
                    ]
                });
            } else {
                this._getStatus(type);
            }
        }).error((data) => {
            this.getScreen().toast(data.message)
        })
    }

    _getStatus(type) {
        api.merchantApplyStatus({}).success((content) => {
            console.log('onsuccess>>>>', content)
            this.setState({
                data: content.data || {},
                status: content.data && content.data.status
            })
        }).error((data) => {
            this.getScreen().toast(data.message)
        })
        if (type == 1) {
            this.state.refresh = true;
            let navigation = this.getScreen().getNavigation();
            navigation.navigate('MerchantSettledInvite');
        } else {
            Bridge.goAccount && Bridge.goAccount();
        }
    }
    _onImageSelected=(e)=>{
        // let {nativeEvent:{position}} = e;
        // let data = this.state.data;
        // if (!data || !data.img) {
        //     return null;
        // }
        // data.img.forEach((url,index)=>{
        //     this['image'+index]&&this['image'+index].reset();
        // })
        ResizeImage.reset();
        
    }
    _showBigPic(key,bigUrl, currentIndex, totalIndex) {
        // this.setState({
        //     isShowBigPic: !this.state.isShowBigPic,
        //     totalIndex,
        //     currentIndex,
        //     bigUrl
        // })
        let screen = this.getScreen();
        this._imagePopupid = screen.showPopup({
            backgroundColor:'rgba(0, 0, 0, 0.8)',
            content: <Swiper
                        autoPlay={false}
                        style={{
                            height:'100%',
                            width:'100%',
                        }}
                        indicator={BannerIndicator}
                        closeScreen={()=>this._hideBigPic()}
                        onPageSelected={this._onImageSelected}
                        initialPage={currentIndex}
                        loop={true}>
                        {
                            this._renderImages(key)
                        }
                    </Swiper>
        })
    }
    _hideBigPic() {
        let screen = this.getScreen();
        screen.hidePopup(this._imagePopupid);
        // this.suffix = 0;
        // this.setState({
        //     isShowBigPic: !this.state.isShowBigPic,
        //     totalIndex: 0,
        //     currentIndex: 0,
        //     bigUrl: ''
        // })
    }

    _touchStart(e) {
        this.setState({
            startX: e.touches[0].pageX,
            startY: e.touches[0].pageY
        })
    }
    _touchEnd(e) {
        this.setState({
            endX: e.changedTouches[0].pageX,
            endY: e.changedTouches[0].pageY
        }, () => {
            let direction = this._getSlideDirection(this.state.startX, this.state.startY, this.state.endX, this.state.endY);
            switch (direction) {
                case 0:
                    console.log("没滑动");
                    break;
                case 1:
                    console.log("向上");
                    break;
                case 2:
                    console.log("向下");
                    break;
                case 3:
                    console.log("向左");
                    this._changePic(1);
                    break;
                case 4:
                    console.log("向右");
                    this._changePic(2);
                    break;
                default:
            }
        })
    }
    _changePic(direction) {
        let data = this.state.data,
            totalIndex = this.state.totalIndex,
            currentIndex = this.state.currentIndex;

        if (direction == 1) {
            console.log(this.suffix, currentIndex, totalIndex)
            if (currentIndex == totalIndex || this.suffix >= totalIndex) {
                return;
            }
            if (this.suffix == 0) {
                this.suffix = currentIndex;
            } else {
                this.suffix++;
            }
            let bigUrl = data.img && data.img.length > 0 && data.img[this.suffix];
            this.setState({
                currentIndex: ++currentIndex,
                bigUrl
            })
        } else if (direction == 2) {
            console.log(this.suffix, currentIndex, totalIndex)
            if (currentIndex == 1 || this.suffix < 0) {
                return;
            }
            if (this.suffix == 0) {
                this.suffix = currentIndex - 2;
            } else {
                this.suffix--;
            }
            let bigUrl = data.img && data.img.length > 0 && data.img[this.suffix];
            this.setState({
                currentIndex: --currentIndex,
                bigUrl
            })
        }
    }
    _getSlideDirection(startX, startY, endX, endY) {
        let dy = startY - endY,
            dx = endX - startX,
            result = 0;
        if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
            return result;
        }
        var angle = this._getSlideAngle(dx, dy);
        if (angle >= -45 && angle < 45) {
            result = 4;
        } else if (angle >= 45 && angle < 135) {
            result = 1;
        } else if (angle >= -135 && angle < -45) {
            result = 2;
        }
        else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
            result = 3;
        }
        return result;
    }
    _getSlideAngle(dx, dy) {
        return Math.atan2(dy, dx) * 180 / Math.PI;
    }
    _renderImages(key) {
        let data = this.state.data;
        let images = [];
        if (key === "logo") {
            images.push(data.logo[0]);
        } else if (key === "img") {
            images = data.img;
        }
        if (!data || images.length == 0) {
            return null;
        }
        console.log(images)
        return images.map((url,index) => {
            return (
                <ResizeImage  ref={(v)=>this['image'+index]=v} src={url} key={index} />
            );
        })
    }
    render() {
        let data = this.state.data || {};
        let navigation = this.getScreen().getNavigation();
        const { status } = navigation.state.params;
        return (
            <div className='merchant-settled -invite-data'>
                <div className='tabs'>
                    <ul className='tab-nav'>
                        <li onClick={() => {
                            this.setState({
                                tab: 1
                            })
                        }} className={this.state.tab == 1 ? 'tab-nav-item -active' : 'tab-nav-item'}>基本信息</li>
                        <li onClick={() => {
                            this.setState({
                                tab: 2
                            })
                        }} className={this.state.tab == 2 ? 'tab-nav-item -active' : 'tab-nav-item'}>注册信息</li>
                        <li onClick={() => {
                            this.setState({
                                tab: 3
                            })
                        }} className={this.state.tab == 3 ? 'tab-nav-item -active' : 'tab-nav-item'}>入驻奖励</li>
                    </ul>

                    <div className='tab-panel' style={{ marginBottom: '4.15rem' }}>
                        {/* 基本信息 */}
                        {
                            this.state.tab == 1 &&
                            <div className='-basic'>
                                <div className='head'>
                                    {
                                        data.logo && data.logo[0] && <div className='picture'
                                            onClick={this._showBigPic.bind(this, "logo", data.logo[0], 0, 0)}>
                                            <img src={data.logo[0]} />
                                        </div>
                                    }
                                    <h2>{data.merchant_name}</h2>
                                </div>
                                <div className='cell -notborder -notborder-item'>
                                    <div className='cell-item'>
                                        <div className='-label'>商户电话</div>
                                        <div className='-value -c-gray'>{data.tel}</div>
                                    </div>
                                    <div className='cell-item'>
                                        <div className='-label'>商户地址</div>
                                        <div className='-value -c-gray'>{data.province}{data.city}{data.area}{data.address}</div>
                                    </div>
                                    <div className='cell-item'>
                                        <div className='-label'>所属分类</div>
                                        <div className='-value -c-gray'>{data.category}</div>
                                    </div>
                                    <div className='cell-item'>
                                        <div className='-label'>商户面积</div>
                                        <div className='-value -c-gray'>{data.shop_area}m2</div>
                                    </div>
                                    <div className='cell-item'>
                                        <div className='-label'>员工人数</div>
                                        <div className='-value -c-gray'>{data.staff_num || 0}人</div>
                                    </div>
                                    <div className='cell-item -gallery'>
                                        <div className='-label'>宣传图片</div>
                                        <div className='-value'></div>
                                        <div className='-gallery-box'>
                                            <ul>
                                                {
                                                    data.img && data.img.length > 0 &&
                                                    data.img.map((item, index) => {
                                                        return (
                                                            <li key={index} onClick={this._showBigPic.bind(this, 'img', item, index, data.img.length)}>
                                                                <img src={item} />
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                    <div className='cell-item'>
                                        <div className='-label'>商户介绍</div>
                                        <div className='-value -c-gray'>{data.introduction}</div>
                                    </div>
                                </div>
                            </div>
                        }
                        {/* 注册信息 */}
                        {
                            this.state.tab == 2 &&
                            <div className='-reg'>
                                <div className='cell -notborder -notborder-item'>
                                    <div className='cell-item'>
                                        <div className='-label'>手机号</div>
                                        <div className='-value -c-gray'>{data.person_tel}</div>
                                    </div>
                                    <div className='cell-item'>
                                        <div className='-label'>法人</div>
                                        <div className='-value -c-gray'>{data.person}</div>
                                    </div>
                                    <div className='cell-item'>
                                        <div className='-label'>法人手机</div>
                                        <div className='-value -c-gray'>{data.person_tel}</div>
                                    </div>
                                    <div className='cell-item -gallery'>
                                        <div className='-label'>身份证</div>
                                        <div className='-value'></div>
                                        <div className='-gallery-box'>
                                            <ul>
                                                <li><img src={data.person_front_img} /></li>
                                                <li><img src={data.person_back_img} /></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className='cell-item'>
                                        <div className='-label'>持卡人</div>
                                        <div className='-value -c-gray'>{data.card_holder}</div>
                                    </div>
                                    <div className='cell-item'>
                                        <div className='-label'>银行卡号</div>
                                        <div className='-value -c-gray'>{data.card_no}</div>
                                    </div>
                                    <div className='cell-item'>
                                        <div className='-label'>开户行</div>
                                        <div className='-value -c-gray'>{data.bank_name}{data.sub_bank_name}</div>
                                    </div>
                                    <div className='cell-item -gallery'>
                                        <div className='-label'>营业执照</div>
                                        <div className='-value -c-gray'>{data.licences}</div>
                                        <div className='-gallery-box'>
                                            <ul>
                                                <li><img src={data.licences_img} /></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        {/* 入驻奖励 */}
                        {
                            this.state.tab == 3 &&
                            <div className='-award'>
                                <table className='-award-table'>
                                    <thead>
                                        <tr>
                                            <th>奖励类型</th>
                                            <th>奖励标准</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.merchant_reward && data.merchant_reward.length > 0 &&
                                            data.merchant_reward.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.title}</td>
                                                        <td>{item.discount}{item.is_money == 1 ? '元/人' : '%'}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        }
                    </div>

                    {
                        status == 3 && <div className="bound-btn-ab">
                            <div className="bound-btn">
                                <a href="javascript:;" className="bound-btn-fl" onClick={this._doAction.bind(this, 0)}>拒绝</a>
                                <a href="javascript:;" className="bound-btn-fr" onClick={this._doAction.bind(this, 1)}>接受</a>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default MerchantSettledInviteData;