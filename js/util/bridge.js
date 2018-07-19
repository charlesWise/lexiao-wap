var clientType;
var isAppClient;
var ua = window.navigator.userAgent.toLowerCase();
var cookie = document.cookie;
var Bridge = {};
var bridgeLibVersion = navigator.userAgent.match(/bridgeLibVersion\((.+)\)/) && navigator.userAgent.match(/bridgeLibVersion\((.+)\)/)[1];
window.IOS_URL = window.location.host+'/Mobile/Act/index.php/Financing/Invest';

var iosApi = {
  plist: window.IOS_URL + '/plist', // 项目列表全部
  chongzhi: window.IOS_URL + '/chongzhi', //充值
  goRegister: window.IOS_URL + '/goRegister', //注册
  goLogin: window.IOS_URL + '/goLuckDraw', // 登录
  toNewShare: window.IOS_URL + '/toNewShare?', //分享 传content=标题&content=内容文字&content=web的URL&content=图片的url
  goAccount: window.IOS_URL + '/goAccount', //账户首页
  goRecommend: window.IOS_URL + '/goRecommend', //推荐列表
  goDetail: window.IOS_URL + '/goDetail=', //项目详情 传prj_id参数
  resetPayPassword: window.IOS_URL + '/resetPayPassword', //忘记支付密码
  goTelCheng: window.IOS_URL + '/goTelCheng', //推荐好友页面
  popViewController:window.IOS_URL + '/popViewController', //返回上一页
  lxGoBack:window.IOS_URL + '/lxGoBack', //乐消返回上一页
  goAccountScrow: window.IOS_URL + '/goAccountScrow', //银行存管
  goScoreStore: window.IOS_URL + '/goScoreStore?', //跳到积分商城
  viewWillAppear: window.IOS_URL + '/viewWillAppear?', //新开WEBVIEW跳转URL，gonewwebview=url&title=标题
}

if (cookie.match(/tourongjia/i) === 'tourongjia') {
  isAppClient = true;
}
if (ua.match(/ua_trj_ios/i) || cookie.match(/TRPClient=ios/i)){
  clientType = 'ios';
  isAppClient = true;
} else if (ua.match(/ua_trj_android/i) || cookie.match(/trj_android/i)){
  clientType = 'android';
  isAppClient = true;
} else if (ua.match(/MicroMessenger/i)) {
  clientType = 'wechat';
  isAppClient = false;
} else {
  clientType = 'browser';
  isAppClient = false;
}

function common(action, params) {
    setTimeout(function() {
        var urlJson = {
            action: action
        };
        urlJson.params = params;
        var url = "tourongjiabridge://operation?" + encodeURIComponent(JSON.stringify(urlJson));
        var gapBridgeId = document.getElementById('gapBridge');
        //if (!gapBridgeId) {
          gapBridgeId = document.createElement("iframe");
          gapBridgeId.setAttribute("style", "display:none;");
          gapBridgeId.setAttribute("height", "0px");
          gapBridgeId.setAttribute("width", "0px");
          gapBridgeId.id = 'gapBridge';
          gapBridgeId.setAttribute("frameborder", "0");
          document.documentElement.appendChild(gapBridgeId);
        //}
        gapBridgeId.src = url;
    },
    20)
}

// 项目列表全部
Bridge.goPlist = function(url) {
  var params = {};
  if (isAppClient) {
    if (parseFloat(bridgeLibVersion)) {
      common("goPlist", params)
    } else {
      if(clientType === 'ios'){
        window.location.href = iosApi.plist;
      } else if (clientType === 'android') {
        if(window['mainweb'] && window['mainweb']['goFinance']){
          window['mainweb']['goFinance']();
        }
      }
    }
  } else {
    var sUrl = url ? url : window.location.origin + '/#/plist/';
    window.location.href = sUrl;
  }
}

// 充值
Bridge.goRecharge = function(url) {
  var params = {};
  if (isAppClient) {
    if (parseFloat(bridgeLibVersion)) {
      common('goRecharge', params)
    } else {
      if(clientType === 'ios'){
        window.location.href = iosApi.chongzhi;
      } else if (clientType === 'android') {
        if(window['mainweb'] && window['mainweb']['goRecharge']){
          window['mainweb']['goRecharge']();  
        }
      }
    }
  } else {
    var sUrl = url ? url : window.location.origin + '/#/submitPay';
    window.location.href = sUrl;
  }
}

// 登录
Bridge.goLogin = function(url) {
  var params = {};
  if (isAppClient) {
    if (parseFloat(bridgeLibVersion)) {
      common('goLogin', params)
    } else {
      if(clientType === 'ios'){
        window.location.href = iosApi.goLogin;
      } else if (clientType === 'android') {
        if (window['mainweb'] && window['mainweb']['goLuckDraw']) {
          window['mainweb']['goLuckDraw']();
        }
      }
    }
  } else {
    var sUrl = url ? url : window.location.origin + '/#/login///';
    window.location.href = sUrl;
  }
}

// 注册
Bridge.goRegister = function(url) {
  var params = {};
  if (isAppClient) {
    if (parseFloat(bridgeLibVersion)) {
      common('goRegister', params)
    } else {
      if(clientType === 'ios'){
        window.location.href = iosApi.goRegister;
      }else if(clientType === 'android'){
        if(window['mainweb'] && window['mainweb']['goRegister']){
          window['mainweb']['goRegister']();
        }
      }
    }
  } else {
    var sUrl = url ? url : window.location.origin + '/#/registerStepTwo';
    window.location.href = sUrl;
  }
}

// 分享
Bridge.toNewShare = function(title, content, imgurl, shareurl) {
  var params = {
    content: content,
    imgurl: imgurl,
    shareurl: shareurl,
    title: title
  };

  if (parseFloat(bridgeLibVersion)) {
    common('toNewShare', params)
  } else {
    if(clientType === 'ios'){
      window.location.href = iosApi.toNewShare+'content='+title+'&content='+content+'&content='+shareurl+'&content='+imgurl;
    }else if(clientType === 'android'){
      if(window['mainweb'] && window['mainweb']['toNewShare']){
        window['mainweb']['toNewShare'](content, imgurl, shareurl, title);
      }
    }
  }
}

// 账户首页
Bridge.goAccount = function(url) {
  var params = {};

  if (isAppClient) {
    if (parseFloat(bridgeLibVersion)) {
      common('goAccount', params)
    } else {
      if(clientType === 'ios'){
        window.location.href = iosApi.goAccount;
      } else if (clientType === 'android') {
        if (window['mainweb'] && window['mainweb']['goAccount']) {
          window['mainweb']['goAccount']();
        }
      }
    }
  } else {
    var sUrl = url ? url : window.location.origin + '/#/accountInfo';
    window.location.href = sUrl;
  }   
}

// 推荐列表
Bridge.goRecommend = function(url) {
  var params = {};

  if (isAppClient) {
    if (parseFloat(bridgeLibVersion)) {
      common('goRecommend', params)
    } else {
      if (clientType === 'ios') {
        window.location.href = iosApi.goRecommend;
      } else if (clientType === 'android') {
        if(window['mainweb'] && window['mainweb']['goInvite']){
          window['mainweb']['goInvite']();
        }
      }
    }
  } else {
    var sUrl = url ? url : window.location.origin + '/#/inviteFriend';
    window.location.href = sUrl;
  }
}

// 项目详情
Bridge.goFinanceInfo = function(prjId, isCollection, url) {
  var params = {
    prjId: prjId,
    isCollection: isCollection
  };

  if (isAppClient) {
    if (parseFloat(bridgeLibVersion)) {
      common('goFinanceInfo', params)
    } else {
      if (clientType === 'ios') {
        window.location.href = iosApi.goDetail + prjId; 
      } else if (clientType === 'android') {
        if(window['mainweb'] && window['mainweb']['goFinanceInfo']){
          window['mainweb']['goFinanceInfo'](prjId);
        }
      }
    }
  } else {
    var sUrl = url ? url : window.location.origin + '/#/invest/'+prjId+'/1/0//1';
    window.location.href = sUrl;
  }
}

// 忘记支付密码
Bridge.resetPayPassword = function(url) {
  var params = {};

  if (isAppClient) {
    if (parseFloat(bridgeLibVersion)) {
      common('resetPayPassword', params)
    } else {
      if (clientType === 'ios') {
        window.location.href = iosApi.resetPayPassword;
      } else if (clientType === 'android') {
        if(window['mainweb'] && window['mainweb']['resetPayPassword']){
          window['mainweb']['resetPayPassword']();
        }
      }
    }
  } else {
    var sUrl = url ? url : window.location.origin + '/#/pwdMng';
    window.location.href = sUrl;
  }
}

// 修改预留手机号
Bridge.goTelCheng = function(url) {
  var params = {};

  if (isAppClient) {
    if (parseFloat(bridgeLibVersion)) {
      common('goTelCheng', params)
    } else {
      if (clientType === 'ios') {
        window.location.href = iosApi.goTelCheng;
      } else if (clientType === 'android') {
        if(window['mainweb'] && window['mainweb']['goTelCheng']){
          window['mainweb']['goTelCheng']();
        }
      }
    }
  } else {
    var sUrl = url ? url : window.location.origin + '/#/telCheng';
    window.location.href = sUrl;
  }
}

// 返回上一页
Bridge.goBack = function() {
  var params = {};

  if(!isAppClient){
    // window.history.back();
    window.history.go(-2);
    return;
  }
  if (parseFloat(bridgeLibVersion)) {
    common('goBack', params)
  } else if (clientType === 'ios') {
      window.location.href = iosApi.popViewController;
  } else if (clientType === 'android') {
      if(window['mainweb'] && window['mainweb']['goBack']){
        window['mainweb']['goBack']();
      }
  }
}

// 银行存管
Bridge.goAccountScrow = function(url) {
  var params = {};

  if (isAppClient) {
    if (parseFloat(bridgeLibVersion)) {
      common('goAccountScrow', params)
    } else {
      if (clientType === 'ios') {
        window.location.href = iosApi.goAccountScrow;
      } else if (clientType === 'android') {
        if(window['mainweb']&&window['mainweb']['goAccountScrow']){
          window['mainweb']['goAccountScrow']();
        }
      }
    }
  } else {
    var sUrl = url ? url : window.location.origin + '/#/accountScrow';
    window.location.href = sUrl;
  }
}

// 跳转到积分商城
Bridge.goScoreStore = function(url) {
  if (isAppClient) {
    if (parseFloat(bridgeLibVersion)) {
      window.location.href = url + '?newapp=true';
    } else {
      if (clientType === 'ios') {
        window.location.href = iosApi.goScoreStore+"goscore=" + url;
      } else if (clientType === 'android') {
        if(window['mainweb'] && window['mainweb']['goScoreStore']){
          window['mainweb']['goScoreStore'](url);
        }
      }
    }
  } else {
    window.location.href = url;
  }
}

// 关闭新开页面后回到当前页刷新当前方法
Bridge.displayReload = function(reloadFunc) {
    var params = {
        reloadFunc: reloadFunc
    };
    if (parseFloat(bridgeLibVersion)) {
      common("displayReload", params)
    }
}

// 进入页面刷新当前方法
Bridge.displayRePage = function(rePageFunc) {
    var params = {
        rePageFunc: rePageFunc
    };
    if (bridgeLibVersion > "1.0.0") {
      common("displayRePage", params)
    }
}

// 设置头部中间文字
Bridge.setTitleBarMiddle = function(title) {
  var params = {
    title: title
  };
  if (parseFloat(bridgeLibVersion)) {
    common('setTitleBarMiddle', params)
  }
}

// 设置头部右边按钮
Bridge.setTitleBarRight = function(title, eventHandle) {
  var params = {
    title: title,
    eventHandle: eventHandle
  };
  if (parseFloat(bridgeLibVersion)) {
    common('setTitleBarRight', params)
  }
}

// 设置头部左边按钮事件
Bridge.setTitleBarLeftClick = function(eventHandle) {
  var params = {
    eventHandle: eventHandle
  };
  if (parseFloat(bridgeLibVersion)) {
    common('setTitleBarLeftClick', params)
  }
}

// 开启webview下拉刷新
Bridge.pullRefreshOpen = function(eventHandle) {
  var params = {
    eventHandle: eventHandle
  };
  if (parseFloat(bridgeLibVersion)) {
    common('pullRefreshOpen', params)
  }
}

// 复制文本
Bridge.copyText = function(text) {
  var params = {
    text: text
  };
  if (isAppClient) {
    if (parseFloat(bridgeLibVersion)) {
      common('copyText', params)
    }
  }
}

//stub
window.APP_GET_LOCATION_CALLBACK = function(){

};
Bridge.getCurrentLocation = function(callback) {
  window.APP_GET_LOCATION_CALLBACK  = callback;
  //设定5s超时
  setTimeout(function(){
    callback(null);
    window.APP_GET_LOCATION_CALLBACK  = function(){}
  },5000);
  var params = {
    eventHandle: 'APP_GET_LOCATION_CALLBACK'
  };
  if (isAppClient) {
    if (parseFloat(bridgeLibVersion)) {
      common('getPosition', params)
    }
  }
}

export default {
  clientType: clientType,
  bridgeLibVersion: bridgeLibVersion,
  isAppClient: isAppClient,
  ...Bridge
}