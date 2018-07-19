import React, { Component } from 'react';
import _ from 'lodash';
import ScreenComponent from './../components/ScreenComponent';

import { StoreManager } from 'mlux';

// import Picker from './../components/Picker';

import Wrapper from './../components/Picker/Wrapper';
import Picker from './../components/Picker/Picker';
import Header from './../components/Picker/Header';

import AreaPicker from './../components/AreaPicker';
import WeekRange from './../components/WeekRange';
import DatePicker from './../components/DatePicker';
import TimePicker from './../components/TimePicker';
import StorePicker from './../components/StorePicker';

import GPS from './../../util/GPS';

import api from './../../controllers/api'
import ClipImage from './../components/ClipImage';

var arr = [{
    id: 'a',
    name: '1'
}, {
        id: 'b',
        name: '2'
    },{
        id: 'c',
        name: '3'
    }, {
        id: 'd',
        name: '4'
    },{
        id: 'e',
        name: '5'
    }, {
        id: 'f',
        name: '6'
    },{
        id: 'g',
        name: '7'
    }, {
        id: 'h',
        name: '8'
    }]
// for (let i = 0; i < 20; i++) {
//     arr.push({
//         id: i + 1,
//         name: i + 1
//     })
// }

var aaa = {
    "id": "1",
    "name": "测试福利券（勿删）",
    "sub": [
        {
            "id": "9",
            "name": "测试子福利券1（勿删）",
            "sub": [
                {
                    "id": "44",
                    "name": "佰草集",
                    "sub": [
                        {
                            "id": "35",
                            "name": "呵呵"
                        }
                    ]
                }
            ]
        },
        {
            "id": "10",
            "name": "测试子福利券2（勿删）",
            "sub": [
                {
                    "id": "45",
                    "name": "佰草集",
                    "sub": [
                        {
                            "id": "36",
                            "name": "呵呵"
                        }
                    ]
                }
            ]
        }
    ]
}

export default class Test extends ScreenComponent {
    static pageConfig = {
        path: '/test'
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: 'Test'
        }
        this.state = {}
    }

    componentDidMount() {
        // api.getArea({
        // }).success((res) => {
        // }).error((res) => { })
        api.getBDMerchants({
            // mobile: 15823415689
        }).success((content) => {
            console.log('onsuccess>>>>', content)
        }).error((content) => {
            console.log('onerror>>>>', content)
        })
    }
    

    _doLogin(){
        let mobile = this.refs.mobile.value;
        // mobile = 13818186484//商户
        // mobile = 15823415689//BD
        if (!mobile) return;
        api.login({
            mobile: mobile
        }).success((content) => {
            console.log('onsuccess>>>>', content)
            StoreManager.user.set('info', content.data);
            StoreManager.user.set('isLogin', true);
            }).error((content) => {
                console.log('onerror>>>>', content)
        })
    }

    _login(mobile) {
        api.login({
            mobile: mobile
        }).success((content) => {
            console.log('onsuccess>>>>', content)
            StoreManager.user.set('info', content.data);
            StoreManager.user.set('isLogin', true);
        }).error((content) => {
            console.log('onerror>>>>', content)
        })
    }
    _locate(){
        var httpLine = api.getLocal2();
        httpLine.before(function(data,next,abort){
            
            GPS.getGPS().then(function(position){
                httpLine.httpEntity.params = {
                    lat:position.coords.latitude,
                    lng:position.coords.longitude,
                }
                next();
            },function(){
                httpLine.httpEntity.params = {
                    lat:undefined,
                    lng:undefined,
                }
                next();
            });
        }).success((content)=>{
            console.log(content)
        })
        return httpLine;
    }
    render() {
        return  <div>
            <StorePicker dataSource={aaa} onSelected={(obj) => {
                console.log('AreaPicker', obj)
            }}/>
            {/* <DatePicker onSelected={(obj) => {
                console.log('AreaPicker', obj)
            }}/> */}
                {/* <AreaPicker pcode={'120000'} ccode={'120100'} acode={'120102'} onSelected={(obj)=>{
                    console.log('AreaPicker',obj)
                }}/> */}
                {/* <Picker
                    onCancel={() => { console.log('cancel') }}
                    onSelected={(data) => { console.log(data) }}
                    dataSource={arr}     
                    defaultValue={'b'}

                    labelName='name'
                    valueName='id'
                    onChange={(data) => {
                        console.log('onChange>>>>>', data)
                    }}
                /> */}
                <input style={{
                    background: '#FFF',
                    margin: '1rem auto',
                    height: '2rem',
                    width: '17rem'
                }} ref='mobile' type="text" placeholder='手机号'/>
            <div style={{ margin: '10px auto', textAlign: 'center' }} onClick={this._doLogin.bind(this)}>登录</div>
            <div style={{ margin: '10px auto', textAlign: 'center' }} onClick={this._login.bind(this, 13818186484)}>主商户登录</div>
            <div style={{ margin: '10px auto', textAlign: 'center' }} onClick={this._login.bind(this, 15200000006)}>子商户登录</div>
            <div style={{ margin: '10px auto', textAlign: 'center' }} onClick={this._login.bind(this, 13900000002)}>职员登录</div>
            <div style={{ margin: '10px auto', textAlign: 'center' }} onClick={this._login.bind(this, 15823415689)}>BD登录</div>
            <div style={{ margin: '10px auto', textAlign: 'center' }} onClick={this._locate}>定位测试</div>
            {false && <ClipImage 
                dataSource={[{url:'',name:''}]}
                getScreen={this.getScreen()}
                multiple={true}
                displayNum={2}
                getData={(data) => console.log(data)}
            />
            }
            
            </div>
        
    }
}