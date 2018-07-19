
module.exports = {
    //测试
    Test: require('./Test').default,
    //页面列表
    PageList: require('./PageList').default,
    //首页
    Main:require('./Main').default,

    //城市选择
    //选择城市
    SelectCity:require('./search/SelectCity').default,
    //搜索城市
    SearchCity:require('./search/SearchCity').default,

    //商户搜索
    MerchantSearch:require('./search/MerchantSearch').default,//商户搜索

    ExcellentWelfare:require('./merchant/ExcellentWelfare').default,//精品福利

    Shake:require('./promotion/Shake').default,//摇一摇

    MerchantDetail:require('./merchant/MerchantDetail').default,//商户详情
    WelfareDetail:require('./merchant/WelfareDetail').default,//福利详情
    Exchange:require('./merchant/Exchange').default,//兑换    
    BonusDetail:require('./merchant/BonusDetail').default,//奖励详情

    Purchase:require('./merchant/Purchase').default,//买单流程
    CouponList:require('./merchant/CouponList').default,//福利券、过期券
    PaymentOrder:require('./merchant/PaymentOrder').default,//支付订单
    PaySuccess:require('./merchant/PaySuccess').default,//支付成功	PaySuccess:require('./Purchase/Exchange').default,//支付成功


    // ===========个人中心
    //我的福利
    Welfare:require('./member/Welfare').default,//福利列表
    SelectMerchant:require('./member/SelectMerchant').default,//选择商户

    //我的买单
    Payment:require('./member/Payment').default,//买单列表
    PaymentAwait:require('./member/Payment/Await').default,//待付款
    PaymentSuccess:require('./member/Payment/Success').default,//支付成功
    PayBox:require('./member/PayBox').default,//支付密码

    //商户入驻
    MerchantSettled:require('./member/MerchantSettled').default,//入驻首页
    MerchantSettledInvite:require('./member/MerchantSettled/Invite').default,//DB邀请入驻首页
    MerchantSettledInviteData:require('./member/MerchantSettled/InviteData').default,//DB邀请入驻资料
    MerchantJoin:require('./member/MerchantSettled/Join').default,//入驻申请
    MerchantJoinData: require('./member/MerchantSettled/JoinData').default,//我的申请资料
    MerchantInformation: require('./member/Merchant/Information').default,//商户信息
    MerchantModify: require('./member/Merchant/Modify').default,//修改商户信息

    //我是商户
    MyMerchant:require('./member/Merchant').default,//商户首页
    MyMerchantInformationBasic:require('./member/Merchant/InformationBasic').default,//商户信息-基本信息
    MyMerchantInformationRegister:require('./member/Merchant/InformationRegister').default,//商户信息-注册信息
    MyFundRecord:require('./member/Merchant/FundRecord').default,//资金记录
    RemoveMerchant: require('./merchant/RemoveMerchant').default,//解绑确认
    Invitation: require('./merchant/Invitation').default,//邀请确认
    Progress: require('./merchant/Progress').default,//邀请确认
    PaymentRecord: require('./merchant/PaymentRecord').default,//买单记录
    SearchRecord: require('./merchant/PaymentRecord/SearchRecord').default,//买单记录

    //提现
    UserCash:require('./member/Cash').default,//提现首页
    CashResult:require('./member/Cash/Result').default,//提现结果页面
    ResetPayPassword: require('./member/Cash/ResetPayPassword').default,//重置支付密码
    CashOutList: require('./member/Cash/CashOutList').default,//提现明细

    //优惠券
    CouponIndex: require('./member/Coupon').default,//优惠券管理
    CouponAdd: require('./member/Coupon/AddCoupon').default,//添加优惠券
    CouponEdit: require('./member/Coupon/EditCoupon').default,//添加优惠券
    CouponCheck: require('./member/Coupon/CheckCoupon').default,//添加优惠券
    CouponDetail: require('./member/Coupon/CouponDetail').default,//添加优惠券
    CouponRecord: require('./member/Coupon/CouponRecord').default,//优惠券消费记录

    //优惠券
    BDCouponIndex: require('./business/Coupon').default,//优惠券管理
    BDCouponAdd: require('./business/Coupon/AddCoupon').default,//添加优惠券
    BDCouponEdit: require('./business/Coupon/EditCoupon').default,//添加优惠券
    BDCouponDetail: require('./business/Coupon/CouponDetail').default,//添加优惠券
    BDCouponCheck: require('./business/Coupon/CheckCoupon').default,//添加优惠券
    

    //子商户管理
    SubMerchantIndex:require('./member/SubMerchant/SubMerchantIndex').default,//子商户首页
    SubMerchantInvitation:require('./member/SubMerchant/SubMerchantInvitation').default,//子商户邀请
    SubMerchant:require('./member/SubMerchant').default,//子商户列表
    SubMerchantDetail:require('./member/SubMerchant/Detail').default,//子商户详情
    SubMerchantAdd:require('./member/SubMerchant/Add').default,//添加子商户

    //职员管理
    StaffManage:require('./member/StaffManage').default,//职员列表
    StaffManageDetail:require('./member/StaffManage/Detail').default,//职员详情
    StaffManageAdd:require('./member/StaffManage/Add').default,//职员详情

    //邀请用户
    InviteUser:require('./member/InviteUesr').default,//邀请首页
    MyInviteUser:require('./member/InviteUesr/MyInviteUser').default,//我的邀请

    //我是BD
    MyBusiness:require('./business/MyBusiness').default,//我是BD
    CapitalRecord:require('./business/CapitalRecord').default,//资金记录
    BusinessManage:require('./business/BusinessManage').default,//商户管理
    CeoManageList:require('./business/CeoManage/CeoManageList').default,//ceo管理列表
    CeoManageDetail:require('./business/CeoManage/CeoManageDetail').default,//ceo详情
    CeoMerchantDataDetail:require('./business/CeoManage/CeoMerchantDataDetail').default,//ceo奖励详情
    BusinessAdd:require('./business/BusinessAdd').default,//添加商户
    BusinessInformation:require('./business/BusinessInformation').default,//商户信息
    OpenCard:require('./business/OpenCard').default,//选择开户行
    BusinessModify:require('./business/BusinessModify').default,//修改
    MerchantDataDetail:require('./merchant/MerchantDataDetail').default,//商户数据详情
    Entry:require('./business/Entry').default,//入职申请资料
    BDInvitation: require('./business/Invitation').default,//邀请确认
    BDRemove: require('.//business/RemoveBD').default,//解绑确认

    //BD子商户
    SubmerchantList:require('./submerchant/SubmerchantList').default,//子商户列表
    SubmerchantAdd:require('./submerchant/SubmerchantAdd').default,//添加子BD
    SubmerchantModify:require('./submerchant/SubmerchantModify').default,//BD子账户审核

    Unbundling:require('./submerchant/Unbundling').default,//解除绑定

    //用户注册
    QrCodeReg:require('./register/QrCodeReg').default, //二维码扫描注册
    RegSuccess:require('./register/RegSuccess').default, //注册成功
    AuthorizedLogin:require('./register/AuthorizedLogin').default, //授权
    TrjProtocol:require('./register/AuthorizedLogin/TrjProtocol').default, //投融家协议
    LxProtocol:require('./register/AuthorizedLogin/LxProtocol').default, //乐消注册协议
    Agreement:require('./Agreement').default, //乐消协议
    RegisterLogin:require('./register/RegisterLogin').default, //注册登陆  
    FastRegister:require('./register/RegisterLogin/FastRegister').default, //快速注册
    Login:require('./register/RegisterLogin/Login').default, //登陆
    ForgetPwd:require('./register/RegisterLogin/ForgetPwd').default, //忘记密码
    MiddleTranslated:require('./register/MiddleTranslated').default, //关注中间页
    WxBillLog:require('./register/MiddleTranslated/WxBillLog').default, //微信买单去投融家
    Auth:require('./register/MiddleTranslated/Auth').default, //老用户投融家
    ConfirmLogin:require('./register/MiddleTranslated/ConfirmLogin').default, //确认登录

    //二维码注册二期
    CodeRegister:require('./register/CodeRegister').default, //确认登录
    CodeSuccess:require('./register/RegSuccess/CodeSuccess').default, //二维码注册成功
    CodeAuthorizedLogin:require('./register/AuthorizedLogin/CodeAuthorizedLogin').default, //二维码授权投融家

    //授权积分
    Integral:require('./member/Integral').default, //积分使用授权
    MyPoints:require('./member/Integral/MyPoints').default //我的积分
}