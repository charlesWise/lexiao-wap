'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../components/ScreenComponent';

import SearchBar from './../../components/SearchBar';
import ExcellentWelfare from './ExcellentWelfare';
import TextPopup from './../../components/TextPopup';
import Advertisement from './Advertisement';
import NearbyWelfare from './NearbyWelfare';
import api from './../../../controllers/api';
import auth from './../../../controllers/auth';
import localLocation from './../../../controllers/localLocation';
import { StoreManager } from 'mlux';
import FeedbackButton from './FeedbackButton';

class Main extends ScreenComponent {
    static pageConfig = {
        path: '/'
    }
    constructor(...props) {
        super(...props);
        this.state = {
            city: StoreManager.location.get('city')
        }
        this.navigationOptions = {
            title: '商家福利'
        }
        this._listener;
    }
    componentDidMount() {
        // this._auth();
        // this._getLocal();
        this._listener = StoreManager.location.addListener('change', this._updateLocation)
    }
    componentWillUnmount() {
        this._listener.remove();

    }

    _auth() {
        auth.auth().success(() => {
            console.log('登录成功')
        })
    }
    _getLocal() {
        localLocation.locate();
    }
    _updateLocation = () => {
        this.getScreen().reload();
    }
    _onScroll = (e) => {
        var event = e.nativeEvent;
        var {
            scrollHeight,
            scrollTop,
            offsetHeight
        } = event.target;
        if (scrollTop + offsetHeight >= scrollHeight) {
            this._loadMore();
        }
    }
    _loadMore() {
        this.refs.NearbyWelfare && this.refs.NearbyWelfare.loadMore();
    }
    _showFeedback = () => {
        this._feedbackId = this.getScreen().showPopup({
            content: <TextPopup
                limit={0}
                clear={true}
                onChangeText={feedback => this.state.feedback = feedback}
                onClose={this._onFeedbackSubmit} />
        })
    }
    _onFeedbackSubmit = () => {
        this.getScreen().hidePopup(this._feedbackId);
        api.addFeedback({
            content: this.state.feedback
        }).success(()=>{
            this.getScreen().toast('提交成功，谢谢反馈');
        });
    }
    render() {
        let city = StoreManager.location.get('city');
        return (
            <div>
                <SearchBar
                    needCity={true}
                    city={city}
                    type='header'
                    placeholder='请输入商家名' />
                <div
                    onScroll={this._onScroll}
                    className='base-search-bar-after'>
                    <ExcellentWelfare />
                    {
                        Boolean(!window.LEXIAO_APP)&&<Advertisement />
                    }
                    <NearbyWelfare
                        ref='NearbyWelfare' />
                </div>
                <FeedbackButton
                    onPress={this._showFeedback} />
            </div>
        );
    }
}

export default Main;