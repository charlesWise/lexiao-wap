'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import api from "./../../../../controllers/api";
import Swiper from "./../../../components/Swiper";
import ResizeImage from "./../../../components/ResizeImage";

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
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            color: '#fff',
            right: '10px'
          }}>
          <em>{this.state.page + 1}/
                {this.props.count}</em>
          <span style={{ position: 'absolute', right: 0 }} onClick={() => this.props.closeScreen()}>关闭</span>
        </span>
      )
    }
}

export default class MerchantInformation extends ScreenComponent {
    static pageConfig = {
        path: '/member/merchant/information',
        permission: true
    }

    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '商户信息'
        }
        this.state = {
            tabIndex: 1,
            data: {},
            closed: false
        }
    }
    
    componentDidMount() {
        let { state } = this.props.navigation;
        let merchant_id = state.params.merchant_id;
        this.state.merchant_id = merchant_id;
        this._getInfo(merchant_id)
    }

    _getInfo(merchant_id) {
        api.merchantInfo({ merchant_id }).success((res) => {
            this.setState({
                data: res.data || {},
                merchant_id: merchant_id
            })
        })
    }

    _renderBasic(data) {
        if (data.logo) {
            try {
                data.logo = JSON.parse(data.logo);
            } catch (error) {

            }
        } else {
            data.logo = {};
        }
        if (data.province) {
            try {
                data.province = JSON.parse(data.province);
            } catch (error) {

            }
        } else {
            data.province = {};
        }
        if (data.city) {
            try {
                data.city = JSON.parse(data.city);
            } catch (error) {

            }
        } else {
            data.city = {};
        }
        if (data.area) {
            try {
                data.area = JSON.parse(data.area);
            } catch (error) {

            }
        } else {
            data.area = {};
        }
        if (data.assort) {
            try {
                data.assort = JSON.parse(data.assort);
            } catch (error) {

            }
        } else {
            data.assort = {};
        }
        return (
            <div className='cell -m-information -notborder -notborder-item'>
                <div className='cell-item'>
                    <div className={`-label ${data.edit&&data.edit.log=='1'&&'act-red'}`}>商户logo</div>
                    <div className='-value -merchant-logo'>
                        <img src={data.logo && data.logo.url} 
                            onClick={() => this._showBigPic("logo", data.logo.url, 0, 0)} />
                    </div>
                </div>
                <div className='cell-item'>
                    <div className={`-label ${data.edit&&data.edit.merchant_name=='1'&&'act-red'}`}>商户名</div>
                    <div className={`-value -c-gray ${data.edit&&data.edit.merchant_name=='1'&&'act-red'}`}>{data.merchant_name}</div>
                </div>
                <div className='cell-item'>
                    <div className={`-label ${data.edit&&data.edit.tel=='1'&&'act-red'}`}>商户电话</div>
                    <div className={`-value -c-gray ${data.edit&&data.edit.tel=='1'&&'act-red'}`}>{data.tel}</div>
                </div>
                <div className='cell-item'>
                    <div className={`-label ${data.edit&&data.edit.address=='1'&&'act-red'}`}>商户地址</div>
                    <div className={`-value -c-gray ${data.edit&&data.edit.address=='1'&&'act-red'}`}>{data.province&&data.province.name}{data.city&&data.city.name}{data.area&&data.area.name}{data.address}</div>
                </div>
                <div className='cell-item'>
                    <div className={`-label ${data.edit&&data.edit.assort=='1'&&'act-red'}`}>所属分类</div>
                    <div className={`-value -c-gray ${data.edit&&data.edit.assort=='1'&&'act-red'}`}>{data.assort && data.assort.name}</div>
                </div>
                <div className='cell-item'>
                    <div className={`-label ${data.edit&&data.edit.shop_area=='1'&&'act-red'}`}>商户面积</div>
                    <div className={`-value -c-gray ${data.edit&&data.edit.shop_area=='1'&&'act-red'}`}>{data.shop_area}m2</div>
                </div>
                <div className='cell-item'>
                    <div className={`-label ${data.edit&&data.edit.staff_num=='1'&&'act-red'}`}>员工人数</div>
                    <div className={`-value -c-gray ${data.edit&&data.edit.staff_num=='1'&&'act-red'}`}>{data.staff_num}人</div>
                </div>
                <div className='cell-item -gallery'>
                    <div className={`-label ${data.edit&&data.edit.images=='1'&&'act-red'}`}>宣传图片</div>
                    <div className='-value'></div>
                    <div className='-gallery-box'>
                        <ul>
                            {
                                data.images && data.images.length > 0 &&
                                data.images.map((item,i)=>{
                                    return (
                                        <li key={'pic'+i} 
                                            onClick={() => this._showBigPic("images", item.url, i, data.images.length)}>
                                        <img src={item.url} />
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div className='cell-item'>
                    <div className={`-label ${data.edit&&data.edit.introduction=='1'&&'act-red'}`}>商户介绍</div>
                    <div className={`-value -c-gray ${data.edit&&data.edit.introduction=='1'&&'act-red'}`}>{data.introduction}</div>
                </div>

                <div className='cell-control'>
                    <button className='btn-primary' onClick={()=>{
                        window.location.href = '#/merchant/modify:merchant_id=' + this.state.merchant_id
                    }}>修改商户基本信息</button>
                </div>
            </div>
        )
    }

    _renderRegister(data) {
        if (data.person_id_img_front) {
            try {
                data.person_id_img_front = JSON.parse(data.person_id_img_front);
            } catch (error) {
                
            }
        } else {
            data.person_id_img_front = {};
        }
        if (data.person_id_img_back) {
            try {
                data.person_id_img_back = JSON.parse(data.person_id_img_back);
            } catch (error) {

            }
        } else {
            data.person_id_img_back = {};
        }
        if (data.licence_img) {
            try {
                data.licence_img = JSON.parse(data.licence_img);
            } catch (error) {

            }
        } else {
            data.licence_img = {};
        }
        return (
            <div className='cell -m-information -notborder -notborder-item'>
                <div className='cell-item'>
                    <div className='-label'>手机号</div>
                    <div className='-value -c-gray'>{data.mobile}</div>
                </div>
                <div className='cell-item'>
                    <div className='-label'>法人</div>
                    <div className='-value -c-gray'>{data.person}</div>
                </div>
                <div className='cell-item'>
                    <div className='-label'>法人手机</div>
                    <div className='-value -c-gray'>{data.tel}</div>
                </div>
                <div className='cell-item -gallery'>
                    <div className='-label'>身份证</div>
                    <div className='-value'></div>
                    <div className='-gallery-box'>
                        <ul>
                            <li><img src={data.person_id_img_front && data.person_id_img_front.url}
                            onClick={() => this._showBigPic("person_id_img_front", data.person_id_img_front.url, 0, 0)} /></li>
                            <li><img src={data.person_id_img_back && data.person_id_img_back.url} 
                            onClick={() => this._showBigPic("person_id_img_back", data.person_id_img_back.url, 0, 0)}
                            /></li>
                        </ul>
                    </div>
                </div>
                <div className='cell-item'>
                    <div className='-label'>持卡人</div>
                    <div className='-value -c-gray'>{data.name}</div>
                </div>
                <div className='cell-item'>
                    <div className='-label'>银行卡号</div>
                    <div className='-value -c-gray'>{data.card_no}</div>
                </div>
                <div className='cell-item'>
                    <div className='-label'>开户行</div>
                    <div className='-value -c-gray'>
                        {data.open_name[0] && data.open_name[0].province_name}{data.open_name[1] && data.open_name[1].city_name}{data.open_name[2] &&data.open_name[2].sub_bank_name}
                    </div>
                </div>
                <div className='cell-item -gallery'>
                    <div className='-label'>营业执照</div>
                    <div className='-value -c-gray'>{data.licences}</div>
                    <div className='-gallery-box'>
                        <ul>
                            <li><img src={data.licence_img && data.licence_img.url}
                            onClick={() => this._showBigPic("licence_img", data.licence_img.url, 0, 0)}
                            /></li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
    _onImageSelected = (e) => {
        ResizeImage.reset();
      }
    
      _showBigPic(key, bigUrl, currentIndex, totalIndex) {
        let screen = this.getScreen();
        this._imagePopupid = screen.showPopup({
          backgroundColor:'rgba(0, 0, 0, 0.8)',
          content: <Swiper
            autoPlay={false}
            style={{
              height: '100%',
              width: '100%'
            }}
            indicator={BannerIndicator}
            closeScreen={() => this._hideBigPic()}
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
      }
    
      _renderImages(key) {
        let data = this.state.data;
        let images = [];
    
        if (key === "logo") {
          images.push(data[key]);
        }else if (key === "images") {
            images = data[key];
        }else if(key === "person_id_img_front") {
            let person_id_imgs = [data[key], data['person_id_img_back']];
            images = person_id_imgs;
        } else if(key === "person_id_img_back") {
            let person_id_imgs = [data[key], data['person_id_img_front']];
            images = person_id_imgs;
        }else if(key === "licence_img") {
            images.push(data[key]);
        }

        if (!data || images.length == 0) {
          return null;
        }
        return images.map((item, index) => {
          return (
            <ResizeImage ref={(v) => this['image' + index] = v} src={item.url} key={index} />
          );
        })
      }
    render() {
        let data = this.state.data || {}
        return (
            <div className='tabs'>
                {
                    data.reject_reason && !this.state.closed &&
                    <div className='coupon-msg -orange -tal'>
                        驳回原因：{data.reject_reason}
                        <i className="icon_clear" onClick={() => { this.setState({ closed: true }) }}></i>
                    </div>
                }
                <ul className='tab-nav'>
                    <li onClick={()=>{ this.setState({tabIndex : 1}) }} className={this.state.tabIndex == 1 ? 'tab-nav-item -active' : 'tab-nav-item'}>基本信息</li>
                    <li onClick={()=>{ this.setState({tabIndex : 2}) }} className={this.state.tabIndex == 2 ? 'tab-nav-item -active' : 'tab-nav-item'}>注册信息</li>
                </ul>
                <div className='tab-panel'>
                    {
                        this.state.tabIndex == 1 && this._renderBasic(data)
                    }
                    {
                        this.state.tabIndex == 2 && this._renderRegister(data)
                    }
                </div>
            </div>
        )
    }
}
