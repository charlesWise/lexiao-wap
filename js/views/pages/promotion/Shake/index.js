'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import Winning from './Winning';
import ShakeEvent from './../../../../util/ShakeEvent';
import StatusView from './StatusView';
import Rule from './Rule';
import Winner from './Winner';
import coupon from './../../../../util/coupon';
import api from './../../../../controllers/api';

const TYPE = {
    JP: 'jp',
    JF: 'jf'
}
/**
 * jp:红色
 * jf:黄色
 */
const styles = {

    jp: {
        backgroundColor: '#EA4146'
    },
    jf: {
        backgroundColor: '#FFA72A'
    }
}
const SHING = {
    jp: '/images/promotion/yaoyiyao_bg_shining.png',
    jf: '/images/promotion/yaoyiyao_bg_shining_yellow.png'
}

const STATUS_IMG = {
    start: '/images/promotion/yaoyiyao_start.png',
    end: '/images/promotion/yaoyiyao_fail.png'
}
class Shake extends ScreenComponent {
    static pageConfig = {
        path: '/shake',
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '摇一摇领福利',
        }
        this.state = {
            shaking: false,
            showRule: false,
            showWinner: false,
            showResult: false,
            make_times: undefined,
            info: {}
        }
    }

    componentDidMount() {
        ShakeEvent.on(this._onShake);
        this._getData();
    }
    componentWillUnmount() {
        ShakeEvent.remove(this._onShake);
    }
    _getData() {
        let { id: coupon_id, source_type = 'index', mid } = this.getScreen().getNavigation().state.params;
        let stype = '';
        if (!coupon_id) {
            this.getScreen().alert({
                message: '无此优惠券信息',
                buttons: [
                    {
                        text: '确定'
                    }
                ]
            })
        }
        if (mid) {
            stype = 'm';
        }
        api.couponInfo({ coupon_id, source_type, stype }).success((content, next, abort) => {
            if (!content.data) {
                this.getScreen().alert({
                    message: '无此优惠券信息',
                    buttons: [
                        {
                            text: '确定'
                        }
                    ]
                })
            }
            this.setState({
                info: content.data,
                make_times: content.data.make_times
            })
            next();
        })
    }
    _devShake = (e) => {
        if (BuildConfig.ENV === 'dev') {
            // this._gotoUse();
            this._shake();
        }
    }
    _shake() {
        if (this.state.shaking) {
            return;
        }
        this.state.shaking = true;
        let { id: welfare_id, shake_id, source_type = 'index', type } = this.getScreen().getNavigation().state.params;
        let message = <span>您的积分已不足<br />请获取更多积分再来继续摇一摇</span>;
        if (type === TYPE.JP) {
            message = <span>您今天的免费摇一摇次数已用完<br />投资每满{this.state.info.extra_money}元既可获得一次摇一摇机会</span>;
        }
        if (this.state.make_times < 1) {
            this.getScreen().alert({
                message,
                buttons: [
                    {
                        text: '确定',
                        onPress: () => this.state.shaking = false
                    }
                ]
            });
            return;
        }
        if (type === TYPE.JF) {
            api.getPrize({
                cid: welfare_id,
                pid: '1'
            }).success((content, next, abort) => {
                this.setState({
                    showResult: true
                })
            }).error((content, next, abort) => {
                this.getScreen().alert({
                    message: content.message || '很遗憾没有中奖',
                    buttons: [
                        {
                            text: '查看其他福利',
                            onPress: () => {
                                this.state.shaking = false;
                                this._gotoOther();
                            }
                        },
                        {
                            text: '再抽一次',
                            onPress: () => {
                                this.state.shaking = false;
                            }
                        }
                    ]
                });
                abort();
            });
        } else {
            api.shakeDo({ shake_id }).success((content, next, abort) => {
                this.setState({
                    showResult: true
                })
            }).error((content, next, abort) => {
                this.getScreen().alert({
                    message: content.message || '很遗憾没有中奖',
                    buttons: [
                        {
                            text: '查看其他福利',
                            onPress: () => {
                                this.state.shaking = false;
                                this._gotoOther();
                            }
                        },
                        {
                            text: '再抽一次',
                            onPress: () => {
                                this.state.shaking = false;
                            }
                        }
                    ]
                })
                abort();
            });
        }
        this.setState({ make_times: this.state.make_times - 1 })

    }
    _onShake = (e) => {
        this._shake();
    }
    _showRules = () => {
        this.setState({
            showRule: true
        })
    }
    _hideRules = () => {
        this.setState({
            showRule: false
        })
    }
    _showWinner = () => {
        this.setState({
            showWinner: true
        })
    }
    _hideWinner = () => {
        this.setState({
            showWinner: false
        })
    }
    _successPopup() {
        const SUCCESSPOPUP = this.getScreen().showPopup({
            content: <div className="success-popup-content" onClick={e => e.stopPropagation()}>
                <div className="popup-content">
                    <p className="title">领取成功
                        <a className="icon-del-big" onClick={() => {
                            this.getScreen().hidePopup(SUCCESSPOPUP);
                            this.state.shaking = false;
                        }}></a>
                    </p>
                    <p>请进入“
                        <a href="javascript:;">账户”-->“我的福利</a>”中查看已领取的福利
                    </p>
                    <p className="download">
                        <a href="javascript:;" onClick={this._gotoUse}>去使用</a>
                        <a href="javascript:;" onClick={() => {
                            this.getScreen().hidePopup(SUCCESSPOPUP);
                            this.state.shaking = false;
                        }
                        }>再摇一次</a>
                    </p>
                    <p><a href="javascript:;" onClick={this._gotoCheck}>查看福利券</a></p>
                </div>
            </div>
        })
    }
    _closeWinning = () => {
        this.setState({
            showResult: false
        });
        this._successPopup();
        // this.getScreen().alert({
        //     title: '领取成功',
        //     message: this._successMessage(),
        //     buttons: [
        //         {
        //             text: '去查看',
        //             onPress: this._gotoCheck
        //         },
        //         {
        //             text: '去使用',
        //             onPress: this._gotoUse
        //         }
        //     ]
        // })
    }
    _gotoCheck = () => {
        this.state.shaking = false;
        this.getScreen().getNavigation().navigate('Welfare')
    }
    _gotoUse = () => {
        this.state.shaking = false;
        var { params } = this.getScreen().getNavigation().state;

        if (params.id && params.id !== 'undefined') {
            this.getScreen().getNavigation().navigate('SelectMerchant', {
                coupon_id: params.id
            });
        } else {
            this.getScreen().getNavigation().goBack();
        }
        //     if (params.mid&&params.mid!=='undefined') {
        //         this.getScreen().getNavigation().navigate('MerchantDetail',{
        //             id:params.mid
        //         });
        //    } else if(params.type==TYPE.JP){
        //        this.getScreen().getNavigation().navigate('SelectMerchant',{
        //            coupon_id:params.id
        //        });
        //    }

    }
    _gotoOther = () => {
        this.state.shaking = false;
        var { params } = this.getScreen().getNavigation().state;
             if (params.mid&&params.mid!=='undefined') {
                this.getScreen().getNavigation().navigate('MerchantDetail',{
                    id:params.mid
                });
           } else if(params.type==TYPE.JP){
                this.getScreen().getNavigation().navigate('ExcellentWelfare');
            //    this.getScreen().getNavigation().navigate('SelectMerchant',{
            //        coupon_id:params.id
            //    });
            // this.getScreen().getNavigation().goBack();
           }
    }
    _successMessage() {
        let info = this.state;
        return (
            <span className='exchange_success_message'>
                请进入
                <span>"账户"-->"我的福利"</span>
                中查看已领取的福利
            </span>
        );
    }
    _onShining = () => {
        //todo 分享逻辑
        this.setState({
            showResult: false
        });
    }
    _name(name, type, amount) {
        if (name && name.length > 7) {
            name = name.slice(0, 6) + '...';
        }
        return name + ' ' + coupon.nameByType(type) + amount + '元';
    }
    render() {
        let navigation = this.getScreen().getNavigation();
        let params = {};
        if (navigation && navigation.state.params) {
            params = navigation.state.params;
        }
        let style = params.type == TYPE.JF ? styles.jf : styles.jp;
        let shingIMG = params.type == TYPE.JF ? SHING.jf : SHING.jp;
        let loglistType = params.type == TYPE.JF ? 2 : 1;
        let statusIMG = STATUS_IMG.start;
        let { info, make_times } = this.state;
        let tipText = '马上摇一摇';
        if (params.type == TYPE.JF) {
            tipText = (info.need_point || '') + '积分摇一摇';
        }
        if (make_times !== undefined && make_times < 1) {
            tipText = '机会用光了';
            statusIMG = STATUS_IMG.end;
        }
        return (
            <div
                className='shake'
                style={style}>
                <h3>
                    {this._name(info.merchant_name, info.type, info.discount_amount)}
                    <a
                        onClick={this._showRules}
                        href='javascript:void(0)'>
                        活动规则
                    </a>
                </h3>
                <StatusView
                    shingIMG={shingIMG}
                    statusIMG={statusIMG}
                    tipText={tipText}
                    type={params.type} />
                <div>
                    <a
                        onClick={this._devShake}
                        href='javascript:void(0)'
                        className="prize_btn">
                        今天还有{make_times}次机会
                    </a>
                </div>
                <div>
                    <a
                        onClick={this._showWinner}
                        href='javascript:void(0)'
                        className="a_prize_btn">
                        获奖记录>
                    </a>
                </div>
                <Winning
                    info={this.state.info}
                    onShining={this._onShining}
                    onClose={this._closeWinning}
                    display={this.state.showResult} />
                <Rule
                    rule={this.state.info.shake_rule || ''}
                    onClose={this._hideRules}
                    display={this.state.showRule} />
                <Winner
                    onClose={this._hideWinner}
                    info={this.state.info}
                    type={loglistType}
                    display={this.state.showWinner} />

            </div>
        );
    }
}

export default Shake;