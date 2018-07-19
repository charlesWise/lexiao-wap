export default [
    /**
     *@name getBDSourceCeo
     *@version 0.1.0
     *@permisstion none
     *@method post
     */
    {
        name: 'getBDSourceCeo',
        url: '/BD/BdCeo/getBDSourceCeo',
        method: 'post',
    },
    /**
     *@name checkBDInfo
     *@version 0.1.0
     *@permisstion none
     *@method post
     */
    {
        name: 'checkBDInfo',
        url: '/BD/BdCeo/checkBDInfo',
        method: 'post',
    },
    /**
     *@name queryBdAccount
     *@version 0.1.0
     *@permisstion none
     *@method post
     */
    {
        name: 'queryBdAccount',
        url: '/BD/BdCeo/queryBdAccount',
        method: 'post',
    },
    /**
     *@name getMcode
     *@version 0.1.0
     *@permisstion none
     *@method post
     */
    {
        name: 'getMcode',
        url: '/Weixin/Weixin/getMcode',
        method: 'post',
    },
    /**
     *@name trjAuthorizeTwo
     *@version 0.1.0
     *@permisstion none
     *@method post
     */
    {
        name: 'trjAuthorizeTwo',
        url: '/User/User/trjAuthorizeTwo',
        method: 'post',
    },
    /**
     *@name searchBankType
     *@version 0.1.0
     *@permisstion none
     *@method post
     */
    {
        name: 'searchBankType',
        url: '/Public/Merchant/searchBankType',
        method: 'post',
    },
    /**
     *@description 搜索银行
     *@name checkWxBindLx
     *@version 0.1.0
     *@permisstion none
     *@method post
     */
    {
        name: 'checkWxBindLx',
        url: '/User/User/checkWxBindLx',
        method: 'post',
    },
    /**
     *@name checkOpenidInfo
     *@version 0.1.0
     *@permisstion none
     *@method post
     */
    {
        name: 'checkOpenidInfo',
        url: '/Weixin/Weixin/checkOpenidInfo',
        method: 'post',
    },
    /**
     *@name checkMobileLogCode
     *@version 0.1.0
     *@permisstion none
     *@method post
     */
    {
        name: 'checkMobileLogCode',
        url: '/User/User/checkMobileLogCode',
        method: 'post',
    },
    /**
     *@name getMobileCodeLogin
     *@version 0.1.0
     *@permisstion none
     *@method post
     */
    {
        name: 'getMobileCodeLogin',
        url: '/User/User/getMobileCodeLogin',
        method: 'post',
    },
    /**
     *@name loginWx
     *@version 0.1.0
     *@permisstion none
     *@method post
     */
    {
        name: 'loginWx',
        url: '/User/User/loginWx',
        method: 'post',
    },
    /**
     *@name getCookieInfo
     *@version 0.1.0
     *@permisstion none
     *@method post
     */
    {
        name: 'getCookieInfo',
        url: '/User/User/getCookieInfo',
        method: 'post',
    },
    /**
     *@name getCashOutDetail
     *@version 0.1.0
     *@description 提现详情
     *@permisstion none
     *@method post
     */
    {
        name: 'getCashOutDetail',
        url: '/Payment/Pay/getCashOutDetail',
        method: 'post',
    },
    /**
     *@name cashOutList
     *@version 0.1.0
     *@description 提现列表
     *@permisstion none
     *@method post
     */
    {
        name: 'cashOutList',
        url: '/Payment/Pay/cashOutList',
        method: 'post',
    },
    /**
     *@name trjRegisterTwo
     *@version 0.1.0
     *@description 授权投融家积分
     *@permisstion none
     *@method post
     */
    {
        name: 'trjRegisterTwo',
        url: '/User/User/trjRegisterTwo',
        method: 'post',
    },
    /**
     *@name checkTrjAuthorize
     *@version 0.1.0
     *@description 检查积分授权
     *@permisstion none
     *@method post
     */
    {
        name: 'checkTrjAuthorize',
        url: '/User/User/checkTrjAuthorize',
        method: 'post',
    },
    /**
     *@name getMerchantsByBDInfo
     *@version 0.1.0
     *@description 获取bd 来源区间商户信息
     *@permisstion none
     *@method post
     */
    {
        name: 'getMerchantsByBDInfo',
        url: '/BD/Merchant/getMerchantsByBDInfo',
        method: 'post',
    },
    /**
     *@name merchantBdInfo
     *@version 0.1.0
     *@description 获取bd 商户信息
     *@permisstion none
     *@method post
     */
    {
        name: 'merchantBdInfo',
        url: '/BD/Merchant/merchantBdInfo',
        method: 'post',
    },
    /**
     *@name getUserPoint
     *@version 0.1.0
     *@description 获取用户积分
     *@permisstion none
     *@method post
     */
    {
        name: 'getUserPoint',
        url: '/Mobile/User/getUserPoint',
        method: 'post',
    },
    /**
     *@name modifyPasswordSave
     *@version 0.1.0
     *@description 重置密码
     *@permisstion none
     *@method post
     */
    {
        name: 'modifyPasswordSave',
        url: '/Mobile/User/modifyPasswordSave',
        method: 'post',
    },
    /**
     *@name lxregister
     *@version 0.1.0
     *@description 乐消用户注册
     *@permisstion none
     *@method post
     */
    {
        name: 'lxregister',
        url: '/Mobile/User/register',
        method: 'post',
    },
    /**
     *@name regGetMobileCode
     *@version 0.1.0
     *@description 获取注册手机验证码
     *@permisstion none
     *@method post
     */
    {
        name: 'regGetMobileCode',
        url: '/Mobile/User/getMobileCode',
        method: 'post',
    },
    /**
     *@name checkVerifyAndSms
     *@version 0.1.0
     *@description 验证图型验证码
     *@permisstion none
     *@method post
     */
    {
        name: 'checkVerifyAndSms',
        url: '/Mobile/User/checkVerifyAndSms',
        method: 'post',
    },
    /**
     *@name doLogin
     *@version 0.1.0
     *@description 登录
     *@permisstion none
     *@method post
     */
    {
        name: 'doLogin',
        url: '/Mobile/User/doLogin',
        method: 'post',
    },
    /**
     *@name loginOrRegister
     *@version 0.1.0
     *@description 查询是否注册
     *@permisstion none
     *@method post
     */
    {
        name: 'loginOrRegister',
        url: '/Mobile/User/loginOrRegister',
        method: 'post',
    },
    /**
     *@name lxProtocol
     *@version 0.1.0
     *@description 乐消协议
     *@permisstion none
     *@method post
     */
    {
        name: 'lxProtocol',
        url: '/User/User/lxProtocol',
        method: 'post',
    },
    /**
     *@name trjRegister
     *@version 0.1.0
     *@description 注册投融家账户（授权）
     *@permisstion none
     *@method post
     */
    {
        name: 'trjRegister',
        url: '/User/User/trjRegister',
        method: 'post',
    },
    /**
     *@name showCoupon
     *@version 0.1.0
     *@description 注册成功后
     *@permisstion none
     *@method post
     */
    {
        name: 'showCoupon',
        url: '/User/User/showCoupon',
        method: 'post',
    },
    /**
     *@name inviteRegister
     *@version 0.1.0
     *@description 邀请注册
     *@permisstion none
     *@method post
     */
    {
        name: 'inviteRegister',
        url: '/User/User/inviteRegister',
        method: 'post',
    },
    /**
     *@name checkMobileRegCode
     *@version 0.1.0
     *@description 检测手机注册短信动态码
     *@permisstion none
     *@method post
     */
    {
        name: 'checkMobileRegCode',
        url: '/User/User/checkMobileRegCode',
        method: 'post',
    },
    /**
     *@name getMobileCodeRegister
     *@version 0.1.0
     *@description 获取注册动态码
     *@permisstion none
     *@method post
     */
    {
        name: 'getMobileCodeRegister',
        url: '/User/User/getMobileCodeRegister',
        method: 'post',
    },
    /**
     *@name checkVerify
     *@version 0.1.0
     *@description 验证图型验证码
     *@permisstion none
     *@method post
     */
    {
        name: 'checkVerify',
        url: '/User/User/checkVerify',
        method: 'post',
    },
    /**
     *@name checkRegister
     *@version 0.1.0
     *@description 是否注册乐消
     *@permisstion none
     *@method post
     */
    {
        name: 'checkRegister',
        url: '/User/User/checkRegister',
        method: 'post',
    },

    
    /**
     *@name getJssdk
     *@version 0.1.0
     *@description 分享
     *@permisstion none
     *@method post
     */
    {
        name: 'getJssdk',
        url: '/Weixin/Weixin/getJssdk',
        method: 'post',
    },
    /**
     *@name openAccount
     *@version 0.1.0
     *@description 连连开户
     *@permisstion none
     *@method post
     *@param sign:访问密钥
     *@param id:fund_account 对应id
     */
    {
        name: 'openAccount',
        url: '/Payment/Api/openAccount',
        method: 'post',
    },

    /**
     *@name BDUserAccount
     *@version 0.1.0
     *@description BD帐户详情
     *@permisstion none
     *@method post
     */
    {
        name: 'BDUserAccount',
        url: '/BD/BD/BDUserAccount',
        method: 'post',
    },

    /**
     *@name addCoupon
     *@version 0.1.0
     *@description 商户添加福利卷
     *@permisstion none
     *@method post
     *@param status:优惠卷修改状态
     *@param coupon_id::优惠卷id
     */
    {
        name: 'addCoupon',
        url: '/Public/Merchant/addCoupon',
        method: 'post',
    },

    /**
     *@name addMerchant
     *@version 0.1.0
     *@description BD添加商户
     *@permisstion none
     *@method post
     *@param merchant_name:商户名
     *@param province:省
     *@param city:市
     *@param area:区
     *@param address:详细地址
     *@param assort:商户分类
     *@param sub_assort:子商户分类
     *@param tel:门店电话
     *@param staff_num:员工人数
     *@param shop_area:商户面积
     *@param person:法人
     *@param person_tel:法人手机
     *@param licences:营业执照编号
     *@param card_no:银行卡号
     *@param name:持卡人姓名
     *@param person_id_img_front:法人身份证正面
     *@param person_id_img_back:法人身份证反面
     *@param licence_img:营业执照图片
     *@param logo:商户logo
     *@param advertise_images:宣传图片
     *@param introduction:商户介绍
     */
    {
        name: 'addMerchant',
        url: '/BD/Merchant/addMerchant',
        method: 'post',
    },

    /**
     *@name addSubBD
     *@version 0.1.0
     *@description 添加子BD用户
     *@permisstion none
     *@method post
     *@param mobile:手机号
     *@param name:姓名
     *@param card_no:银行卡号
     *@param card_of_deposit:开户行
     *@param identity_id:身份证号
     *@param areas:负责区域
     *@param auth_ids:操作权限
     */
    {
        name: 'addSubBD',
        url: '/BD/SubBD/addSubBD',
        method: 'post',
    },

    /**
     *@name checkMobileRegister
     *@version 0.1.0
     *@description 根据手机号判断用户是否注册
     *@permisstion none
     *@method post
     *@param mobile:手机号
     */
    {
        name: 'checkMobileRegister',
        url: '/BD/SubBD/checkMobileRegister',
        method: 'post',
    },

    /**
     *@name couponInfo
     *@version 0.1.0
     *@description 优惠卷信息
     *@permisstion none
     *@method post
     *@param coupon_id:优惠卷id
     */
    {
        name: 'couponInfo',
        url: '/Public/Merchant/couponInfo',
        method: 'post',
    },

    /**
     *@name couponList
     *@version 0.1.0
     *@description 商户福利卷列表
     *@permisstion none
     *@method post
     */
    {
        name: 'couponList',
        url: '/Public/Merchant/couponList',
        method: 'post',
    },

    /**
     *@name editCoupon
     *@version 0.1.0
     *@description 商家修改福利券
     *@permisstion none
     *@method post
     *@param merchant_id:商户id
     *@param coupon_id:福利券id
     *@param type:福利券类型
     *@param card_id:消费要求金额
     *@param card_of_deposit:优惠金额
     *@param publish_num:发行数量
     *@param area:适用范围
     *@param need_week:使用时间
     *@param need_time_start:使用开始时段
     *@param need_time_end:使用结束时段
     *@param use_time_end:有效期至
     *@param show_time_end:平台展示期至
     *@param is_free:是否免费推
     *@param sub_merchants:适用门店
     *@param use_rule:使用规则
     *@param save_type:保存类型(1 提交审核 2 预览)
     */
    {
        name: 'editCoupon',
        url: '/BD/Coupon/editCoupon',
        method: 'post',
    },

    /**
     *@name editSubBDInfo
     *@version 0.1.0
     *@description 修改子BD用户
     *@permisstion none
     *@method post
     *@param bd_id:子bd用户ID
     *@param mobile:手机号
     *@param name:姓名
     *@param card_no:银行卡号
     *@param card_of_deposit:开户行
     *@param identity_id:身份证号
     *@param areas:负责区域
     *@param auth_ids:操作权限
     */
    {
        name: 'editSubBDInfo',
        url: '/BD/SubBD/editSubBDInfo',
        method: 'post',
    },

    /**
     *@name getBDAllAuth
     *@version 0.1.0
     *@description BD全部权限列表
     *@permisstion none
     *@method post
     */
    {
        name: 'getBDAllAuth',
        url: '/BD/BD/getBDAllAuth',
        method: 'post',
    },

    /**
     *@name getBDMerchants
     *@version 0.1.0
     *@description 获取BD商户列表
     *@permisstion none
     *@method post
     */
    {
        name: 'getBDMerchants',
        url: '/BD/BD/getBDMerchants',
        method: 'post',
    },

    /**
     *@name getMerchantDataDetails
     *@version 0.1.0
     *@description 商家列表展示
     *@permisstion none
     *@method post
     *@param mobile:用户手机号
     *@param bx_id:BDid
     *@param month:月份
     */
    {
        name: 'getMerchantDataDetails',
        url: '/BD/Merchant/getMerchantDetails',
        method: 'post',
    },

    /**
     *@name merchantInfo
     *@version 0.1.0
     *@description 商户信息详情
     *@permisstion none
     *@method post
     *@param merchant_id:商户id
     */
    {
        name: 'merchantInfo',
        url: '/BD/Merchant/merchantInfo',
        method: 'post',
    },

    /**
     *@name merchantInviteDetails
     *@version 0.1.0
     *@description 商家邀请投资明细
     *@permisstion none
     *@method post
     *@param merchant_id:商户id
     */
    {
        name: 'merchantInviteDetails',
        url: '/BD/Merchant/merchantInviteDetails',
        method: 'post',
    },

    /**
     *@name merchantRewardTemplate
     *@version 0.1.0
     *@description 获取商户奖励类型
     *@permisstion none
     *@method post
     *@param merchant_id:商户id
     */
    {
        name: 'merchantRewardTemplate',
        url: '/BD/Merchant/merchantRewardTemplate',
        method: 'post',
    },

    /**
     *@name queryMerchant
     *@version 0.1.0
     *@description 查询BD商户列表
     *@permisstion none
     *@method post
     */
    {
        name: 'queryMerchant',
        url: '/BD/BD/queryMerchant',
        method: 'post',
    },

    /**
     *@name querySubAccount
     *@version 0.1.0
     *@description 查询BD子用户
     *@permisstion none
     *@method post
     *@param mobile:BD子用户手机号
     *@param status:子BD状态
     */
    {
        name: 'querySubAccount',
        url: '/BD/SubBD/querySubAccount',
        method: 'post',
    },

    /**
     *@name statisticBDData
     *@version 0.1.0
     *@description BD数据统计
     *@permisstion none
     *@method post
     *@param statis_way:统计方式(1、按天统计 2、按周统计 3、按月统计)
     *@param statis_item:统计项目 (1、商家入驻 2、用户注册 3、用户投资)
     */
    {
        name: 'statisticBDData',
        url: '/Public/Statistics/statisticBDData',
        method: 'post',
    },

    /**
     *@name subAccountInfo
     *@version 0.1.0
     *@description BD子账户详情
     *@permisstion none
     *@method post
     *@param bd_id:子BD id号
     */
    {
        name: 'subAccountInfo',
        url: '/BD/SubBD/subAccountInfo',
        method: 'post',
    },

    /**
     *@name subBDInfo
     *@version 0.1.0
     *@description BD子账户详情
     *@permisstion none
     *@method post
     *@param bd_id:子BD id号
     */
    {
        name: 'subBDInfo',
        url: '/BD/SubBD/subBDInfo',
        method: 'post',
    },

    /**
     *@name unbindSubAccount
     *@version 0.1.0
     *@description 解绑子BD用户
     *@permisstion none
     *@method post
     *@param sub_bd_id:子BDid
     */
    {
        name: 'unbindSubAccount',
        url: '/BD/BD/unbindSubAccount',
        method: 'post',
    },

    /**
     *@name banner
     *@version 0.1.0
     *@description 首页广告轮播
     *@permisstion none
     *@method post
     */
    {
        name: 'banner',
        url: '/Public/Index/banner',
        method: 'post',
    },

    /**
     *@name filterSearchMerchant
     *@version 0.1.0
     *@description 筛选商户搜索数据
     *@permisstion none
     *@method post
     *@param area_id:地区id
     *@param merchant_type_id:商户分类id
     *@param order_by:排序方式
     */
    {
        name: 'filterSearchMerchant',
        url: '/Public/Index/filterSearchMerchant',
        method: 'post',
    },

    /**
     *@name getArea
     *@version 0.1.0
     *@description 省市区列表-新
     *@permisstion none
     *@method post
     *@param area_code:区域code
     */
    {
        name: 'getArea',
        url: '/Public/Index/getArea',
        method: 'post',
    },

    /**
     *@name getAreaSelectList
     *@version 0.1.0
     *@description 省市区编辑列表
     *@permisstion none
     *@method post
     *@param area_code:区域code
     */
    {
        name: 'getAreaSelectList',
        url: '/Public/Index/getAreaSelectList',
        method: 'post',
    },

    /**
     *@name getCityList
     *@version 0.1.0
     *@description 城市列表
     *@permisstion none
     *@method post
     *@param name:城市名
     */
    {
        name: 'getCityList',
        url: '/Public/Index/getCityList',
        method: 'post',
    },

    /**
     *@name getLocal
     *@version 0.1.0
     *@description 通过经纬度获取地址
     *@permisstion none
     *@method post
     *@param lat:经度
     *@param lon:纬度
     *@param ip:ip地址 （第二种方式）
     */
    {
        name: 'getLocal',
        url: '/Public/Index/getLocal',
        method: 'post',
    },
    /**
     *@name getLocal2
    *@version 0.1.0
    *@description 通过经纬度获取地址
    *@permisstion none
    *@method post
    *@param lat:经度
    *@param lon:纬度
    *@param ip:ip地址 （第二种方式）
    */
    {
        name: 'getLocal2',
        url: '/Public/Index/getLocal2',
        method: 'post',
    },

    /**
     *@name getMerchantSearchArea
     *@version 0.1.0
     *@description 商户搜索地区列表
     *@permisstion none
     *@method post
     *@param lat:纬度
     *@param lng:经度
     */
    {
        name: 'getMerchantSearchArea',
        url: '/Public/Index/getMerchantSearchArea',
        method: 'post',
    },

    /**
     *@name historySearch
     *@version 0.1.0
     *@description 历史搜索
     *@permisstion none
     *@method post
     *@param mobile:用户注册手机号
     */
    {
        name: 'historySearch',
        url: '/Public/Index/historySearch',
        method: 'post',
    },

    /**
     *@name hotSearch
     *@version 0.1.0
     *@description 热门搜索
     *@permisstion none
     *@method post
     */
    {
        name: 'hotSearch',
        url: '/Public/Index/hotSearch',
        method: 'post',
    },

    /**
     *@name hotSearchWord
     *@version 0.1.0
     *@description 商户搜索热词
     *@permisstion none
     *@method post
     */
    {
        name: 'hotSearchWord',
        url: '/Public/Index/hotSearchWord',
        method: 'post',
    },

    /**
     *@name merchantSearchLikeList
     *@version 0.1.0
     *@description 商户模糊查询列表
     *@permisstion none
     *@method post
     *@param name:商户户名
     */
    {
        name: 'merchantSearchLikeList',
        url: '/Public/Index/merchantSearchLikeList',
        method: 'post',
    },

    /**
     *@name nearest
     *@version 0.1.0
     *@description 附近福利
     *@permisstion none
     *@method post
     */
    {
        name: 'nearest',
        url: '/Public/Index/nearest',
        method: 'post',
    },

    /**
     *@name searchMerchant
     *@version 0.1.0
     *@description 商户搜索
     *@permisstion none
     *@method post
     *@param area_id:地区id
     *@param merchant_type_id:商户分类id
     *@param order_by:排序方式
     *@param merchant_neme:商户户名
     */
    {
        name: 'searchMerchant',
        url: '/Public/Index/searchMerchant',
        method: 'post',
    },

    /**
     *@name welfare
     *@version 0.1.0
     *@description 用户详情
     *@permisstion none
     *@method post
     */
    {
        name: 'welfare',
        url: '/Public/Index/welfare',
        method: 'post',
    },

    /**
     *@name Apply
     *@version 0.1.0
     *@description 自主申请商户
     *@permisstion none
     *@method post
     *@param merchant_name:商户名
     *@param licences:营业执照号
     *@param person:法人姓名
     *@param tel:门店电话
     *@param address:详细地址
     *@param introduction:门店介绍
     *@param provice:省
     *@param city:市
     *@param area:区
     *@param provice_id:省id
     *@param city_id:市id
     *@param area_id:区id
     */
    {
        name: 'Apply',
        url: '/Public/Merchant/Apply',
        method: 'post',
    },

    /**
     *@name Info
     *@version 0.1.0
     *@description 商户信息
     *@permisstion none
     *@method post
     *@param merchant_id:商户id
     */
    {
        name: 'Info',
        url: '/Public/Merchant/Info',
        method: 'post',
    },

    /**
     *@name applicationStore
     *@version 0.1.0
     *@description 适用门店
     *@permisstion none
     *@method post
     */
    {
        name: 'applicationStore',
        url: '/Public/Merchant/applicationStore',
        method: 'post',
    },

    /**
     *@name applyInfo
     *@version 0.1.0
     *@description 自主申请商户信息
     *@permisstion none
     *@method post
     */
    {
        name: 'applyInfo',
        url: '/Public/Merchant/applyInfo',
        method: 'post',
    },

    /**
     *@name applyMerUnbind
     *@version 0.1.0
     *@description 申请解除子商户绑定
     *@permisstion none
     *@method post
     *@param mid_level:商户类型：0：主商户 1：商户
     *@param mid:商户Id
     */
    {
        name: 'applyMerUnbind',
        url: '/Public/Merchant/applyMerUnbind',
        method: 'post',
    },

    /**
     *@name applyStaffMerUnbind
     *@version 0.1.0
     *@description 职员申请跟商户解绑
     *@permisstion none
     *@method post
     */
    {
        name: 'applyStaffMerUnbind',
        url: '/Public/Merchant/applyStaffMerUnbind',
        method: 'post',
    },

    /**
     *@name applyStaffUnbind
     *@version 0.1.0
     *@description 商户申请解除职员绑定
     *@permisstion none
     *@method post
     */
    {
        name: 'applyStaffUnbind',
        url: '/Public/Merchant/applyStaffUnbind',
        method: 'post',
    },

    /**
     *@name bindMerStaff
     *@version 3.10.9
     *@description 
     *@permisstion none
     *@method post
     *@param id:绑定Id
     *@param status:1:接收 0:拒绝
     */
    {
        name: 'bindMerStaff',
        url: '/Public/Merchant/bindMerStaff',
        method: 'post',
    },

    /**
     *@name capitalRecordInfo
     *@version 0.1.0
     *@description 资金详情
     *@permisstion none
     *@method post
     *@param account_id:资金列表id
     */
    {
        name: 'capitalRecordInfo',
        url: '/Public/Merchant/capitalRecordInfo',
        method: 'post',
    },

    /**
     *@name capitalRecordList
     *@version 0.1.0
     *@description 资金列表
     *@permisstion none
     *@method post
     *@param page:页数
     *@param type:1、提现2、邀请注册奖励3、邀请首投奖励4、福利券奖励5、用户买单实付
     */
    {
        name: 'capitalRecordList',
        url: '/Public/Merchant/capitalRecordList',
        method: 'post',
    },

    /**
     *@name changeCouponStatus
     *@version 0.1.0
     *@description 商户修改福利卷状态
     *@permisstion none
     *@method post
     *@param status:优惠卷修改状态
     *@param coupon_id::优惠卷id
     */
    {
        name: 'changeCouponStatus',
        url: '/Public/Merchant/changeCouponStatus',
        method: 'post',
    },

    /**
     *@name checkCoupon
     *@version 0.1.0
     *@description 商户审核福利券
     *@permisstion none
     *@method post
     *@param id:福利券Id
     *@param type:审核标识，1：审核，0：驳回
     */
    {
        name: 'checkCoupon',
        url: '/Public/Merchant/checkCoupon',
        method: 'post',
    },

    /**
     *@name clickEmployeeStatus
     *@version 0.1.0
     *@description 职员阅读
     *@permisstion none
     *@method post
     *@param status:状态 1 已绑定 2待确认 3 已拒绝 4 解绑
     */
    {
        name: 'clickEmployeeStatus',
        url: '/Public/Merchant/clickEmployeeStatus',
        method: 'post',
    },

    /**
     *@name clickStatus
     *@version 0.1.0
     *@description 子商户阅读
     *@permisstion none
     *@method post
     *@param status:状态 1 已绑定 2待确认 3 已拒绝 4 解绑
     */
    {
        name: 'clickStatus',
        url: '/Public/Merchant/clickStatus',
        method: 'post',
    },

    /**
     *@name couponEditInfo
     *@version 0.1.0
     *@description 修改优惠卷信息
     *@permisstion none
     *@method post
     *@param coupon_id:优惠卷id
     */
    {
        name: 'couponEditInfo',
        url: '/Public/Merchant/couponEditInfo',
        method: 'post',
    },

    /**
     *@name couponUseList
     *@version 0.1.0
     *@description 优惠卷使用记录
     *@permisstion none
     *@method post
     *@param merchant_id:商户id
     *@param date:消费月份
     *@param coupon_type:优惠卷类型
     */
    {
        name: 'couponUseList',
        url: '/Public/Merchant/couponUseList',
        method: 'post',
    },

    /**
     *@name editBaseInfo
     *@version 0.1.0
     *@description 修改商户基本信息
     *@permisstion none
     *@method post
     *@param logo:图片id
     *@param img:商户图片id
     *@param merchant_name:商户名
     *@param licences:营业执照号
     *@param person:法人姓名
     *@param tel:门店电话
     *@param address:详细地址
     *@param introduction:门店介绍
     *@param provice:省
     *@param city:市
     *@param area:区
     *@param provice_id:省id
     *@param city_id:市id
     *@param area_id:区id
     */
    {
        name: 'editBaseInfo',
        url: '/Public/Merchant/editBaseInfo',
        method: 'post',
    },

    /**
     *@name employeeBind
     *@version 0.1.0
     *@description 职员状态
     *@permisstion none
     *@method post
     */
    {
        name: 'employeeBind',
        url: '/Public/Merchant/employeeBind',
        method: 'post',
    },

    /**
     *@name getAllMerchant
     *@version 0.1.0
     *@description 获取全部商户
     *@permisstion none
     *@method post
     */
    {
        name: 'getAllMerchant',
        url: '/Public/Merchant/getAllMerchant',
        method: 'post',
    },

    /**
     *@name getBankType
     *@version 0.1.0
     *@description 获取银行类型
     *@permisstion none
     *@method post
     */
    {
        name: 'getBankType',
        url: '/Public/Merchant/getBankType',
        method: 'post',
    },

    /**
     *@name getCategory
     *@version 0.1.0
     *@description 商户分类
     *@permisstion none
     *@method post
     *@param cat_id:分类id
     */
    {
        name: 'getCategory',
        url: '/Public/Merchant/getCategory',
        method: 'post',
    },

    /**
     *@name getMerchantByCoupon
     *@version 0.1.0
     *@description 根据优惠卷选择商户
     *@permisstion none
     *@method post
     *@param coupon_id:优惠卷id
     */
    {
        name: 'getMerchantByCoupon',
        url: '/Public/Merchant/getMerchantByCoupon',
        method: 'post',
    },

    /**
     *@name getSubBank
     *@version 0.1.0
     *@description 获取支行信息
     *@permisstion none
     *@method post
     *@param code_no:银行类型
     *@param provice_id:省id
     *@param city_id:市id
     */
    {
        name: 'getSubBank',
        url: '/Public/Merchant/getSubBank',
        method: 'post',
    },

    /**
     *@name hotCity
     *@version 0.1.0
     *@description 热门城市
     *@permisstion none
     *@method post
     */
    {
        name: 'hotCity',
        url: '/Public/Merchant/hotCity',
        method: 'post',
    },

    /**
     *@name indexPage
     *@version 0.1.0
     *@description 商户/职员首页信息
     *@permisstion none
     *@method post
     *@param merchant_id:商户id
     *@param type:操作  1 解除 2拒绝
     */
    {
        name: 'indexPage',
        url: '/Public/Merchant/indexPage',
        method: 'post',
    },

    /**
     *@name investList
     *@version 0.1.0
     *@description 邀请记录
     *@permisstion none
     *@method post
     */
    {
        name: 'investList',
        url: '/Public/Merchant/investList',
        method: 'post',
    },

    /**
     *@name inviteMerStaffInfo
     *@version 3.10.9
     *@description 
     *@permisstion none
     *@method post
     */
    {
        name: 'inviteMerStaffInfo',
        url: '/Public/Merchant/inviteMerStaffInfo',
        method: 'post',
    },

    /**
     *@name merchantApplyStatus
     *@version 0.1.0
     *@description 商户申请状态信息
     *@permisstion none
     *@method post
     *@param merchant_id:商户id
     */
    {
        name: 'merchantApplyStatus',
        url: '/Public/Merchant/merchantApplyStatus',
        method: 'post',
    },

    /**
     *@name merchantAuthList
     *@version 0.1.0
     *@description 保存商户
     *@permisstion none
     *@method post
     *@param merchant_id:商户id
     */
    {
        name: 'merchantAuthList',
        url: '/Public/Merchant/merchantAuthList',
        method: 'post',
    },

    /**
     *@name merchantBind
     *@version 0.1.0
     *@description 子商户状态
     *@permisstion none
     *@method post
     */
    {
        name: 'merchantBind',
        url: '/Public/Merchant/merchantBind',
        method: 'post',
    },

    /**
     *@name orderInfo
     *@version 0.1.0
     *@description 订单详情
     *@permisstion none
     *@method post
     */
    {
        name: 'orderInfo',
        url: '/Public/Merchant/orderInfo',
        method: 'post',
    },

    /**
     *@name prizeList
     *@version 0.1.0
     *@description 奖励图表
     *@permisstion none
     *@method post
     *@param data_type:图表日期类型   day 日， week 周， month 月
     */
    {
        name: 'prizeList',
        url: '/Public/Merchant/prizeList',
        method: 'post',
    },

    /**
     *@name qrCodde
     *@version 0.1.0
     *@description 商户或员工二维码
     *@permisstion none
     *@method post
     */
    {
        name: 'qrCodde',
        url: '/Public/Merchant/qrCodde',
        method: 'post',
    },

    /**
     *@name reApply
     *@version 0.1.0
     *@description 自主申请商户拒绝后再申请
     *@permisstion none
     *@method post
     *@param merchant_id:商户id
     *@param merchant_name:商户名
     *@param licences:营业执照号
     *@param person:法人姓名
     *@param tel:门店电话
     *@param address:详细地址
     *@param introduction:门店介绍
     *@param provice:省
     *@param city:市
     *@param area:区
     *@param provice_id:省id
     *@param city_id:市id
     *@param area_id:区id
     */
    {
        name: 'reApply',
        url: '/Public/Merchant/reApply',
        method: 'post',
    },

    /**
     *@name rewardInfo
     *@version 0.1.0
     *@description 奖励详情
     *@permisstion none
     *@method post
     *@param reward_id:
     */
    {
        name: 'rewardInfo',
        url: '/Public/Merchant/rewardInfo',
        method: 'post',
    },

    /**
     *@name rewardList
     *@version 0.1.0
     *@description 奖励列表
     *@permisstion none
     *@method post
     *@param reward_type:奖励类型
     *@param star_date:奖励区间
     *@param end_date:奖励区间
     *@param source:来源
     */
    {
        name: 'rewardList',
        url: '/Public/Merchant/rewardList',
        method: 'post',
    },
    /**
    *@name rewardMeList
    *@version 0.1.0
    *@description 奖励列表-查看商户/员工
    *@permisstion none
    *@method post
    *@param reward_type:奖励类型
    *@param star_date:奖励区间
    *@param end_date:奖励区间
    *@param source:来源
    *@param mid:商户id
    *@param eid:员工id
    */
    {
        name: 'rewardMeList',
        url: '/Public/Merchant/rewardMeList',
        method: 'post',
    },

    /**
     *@name empRewardList
    *@version 0.1.0
    *@description 商户详情奖励列表
    *@permisstion none
    *@method post
    *@param reward_type:奖励类型
    *@param star_date:奖励区间
    *@param end_date:奖励区间
    *@param source:来源
    *@param mid:商户id
    *@param eid:员工id
    */
    {
        name: 'empRewardList',
        url: '/Public/Merchant/empRewardList',
        method: 'post',
    },

    /**
     *@name saveSatff
     *@version 0.1.0
     *@description 添加修改员工
     *@permisstion none
     *@method post
     *@param employee_id:员工id
     *@param name:员工名字
     *@param post:职位
     *@param mobile:员工电话
     *@param auth_str:员工权限  权限id,权限id2  逗号分割
     */
    {
        name: 'saveSatff',
        url: '/Public/Merchant/saveSatff',
        method: 'post',
    },

    /**
     *@name saveSubMerchant
     *@version 0.1.0
     *@description 子商户保存
     *@permisstion none
     *@method post
     *@param mobile:子商户电话
     *@param auth_str:相关权限id 逗号分割
     */
    {
        name: 'saveSubMerchant',
        url: '/Public/Merchant/saveSubMerchant',
        method: 'post',
    },

    /**
     *@name sourceList
     *@version 0.1.0
     *@description 奖励来源列表
     *@permisstion none
     *@method post
     */
    {
        name: 'sourceList',
        url: '/Public/Merchant/sourceList',
        method: 'post',
    },

    /**
     *@name staffInfo
     *@version 0.1.0
     *@description 员工信息展示
     *@permisstion none
     *@method post
     *@param staus:员工状态
     */
    {
        name: 'staffInfo',
        url: '/Public/Merchant/staffInfo',
        method: 'post',
    },

    /**
     *@name staffList
     *@version 0.1.0
     *@description 商户员工列表
     *@permisstion none
     *@method post
     *@param staus:员工状态
     */
    {
        name: 'staffList',
        url: '/Public/Merchant/staffList',
        method: 'post',
    },

    /**
     *@name staffRewardList
     *@version 0.1.0
     *@description 员工奖励列表
     *@permisstion none
     *@method post
     */
    {
        name: 'staffRewardList',
        url: '/Public/Merchant/staffRewardList',
        method: 'post',
    },

    /**
     *@name subMerchantInfo
     *@version 0.1.0
     *@description 子商户信息
     *@permisstion none
     *@method post
     *@param mobile:子商户电话
     *@param auth_str:相关权限id 逗号分割
     */
    {
        name: 'subMerchantInfo',
        url: '/Public/Merchant/subMerchantInfo',
        method: 'post',
    },

    /**
     *@name subMerchantList
     *@version 0.1.0
     *@description 子商户列表
     *@permisstion none
     *@method post
     *@param status:状态 1 已绑定 2待确认 3 已拒绝 4 解绑
     */
    {
        name: 'subMerchantList',
        url: '/Public/Merchant/subMerchantList',
        method: 'post',
    },

    /**
     *@name unbind
     *@version 0.1.0
     *@description 解除���定关系
     *@permisstion none
     *@method post
     */
    {
        name: 'unbind',
        url: '/Public/Merchant/unbind',
        method: 'post',
    },

    /**
     *@name unbindDo
     *@version 0.1.0
     *@description 解除绑定关系操作
     *@permisstion none
     *@method post
     *@param merchant_id:商户id
     *@param type:操作  1 解除 2拒绝
     */
    {
        name: 'unbindDo',
        url: '/Public/Merchant/unbindDo',
        method: 'post',
    },

    /**
     *@name userOrderList
     *@version 0.1.0
     *@description 商户买单记录
     *@permisstion none
     *@method post
     */
    {
        name: 'userOrderList',
        url: '/Public/Merchant/userOrderList',
        method: 'post',
    },

    /**
     *@name viewCoupon
     *@version 0.1.0
     *@description 商户查看福利券
     *@permisstion none
     *@method post
     */
    {
        name: 'viewCoupon',
        url: '/Public/Merchant/viewCoupon',
        method: 'post',
    },

    /**
     *@name checkOrder
     *@version 0.1.0
     *@description 检测订单
     *@permisstion none
     *@method post
     *@param coupon_id:优惠卷id
     *@param merchant_id:商户id
     *@param money:消费金额
     */
    {
        name: 'checkOrder',
        url: '/User/Order/checkOrder',
        method: 'post',
    },

    /**
     *@name getMerchantCouponByMoney
     *@version 0.1.0
     *@description 获取商户可用优惠卷
     *@permisstion none
     *@method post
     *@param merchant_id:商户id
     *@param money:消费金额
     *@param status:优惠卷状态 1 可用 2 不可用
     */
    {
        name: 'getMerchantCouponByMoney',
        url: '/User/Order/getMerchantCouponByMoney',
        method: 'post',
    },

    /**
     *@name makeOrder
     *@version 0.1.0
     *@description 摇一摇 操作
     *@permisstion none
     *@method post
     *@param coupon_id:优惠卷id
     *@param merchant_id:商户id
     *@param money:消费金额
     */
    {
        name: 'makeOrder',
        url: '/User/Order/makeOrder',
        method: 'post',
    },

    /**
     *@name pay
     *@version 0.1.0
     *@description 摇一摇记录
     *@permisstion none
     *@method post
     *@param order_id:订单id
     *@param pay_way:支付方式  wx 威信 ，alipay 支付宝
     */
    {
        name: 'pay',
        url: '/User/order/pay',
        method: 'post',
    },
    /**
    *@name payDo
    *@version 0.1.0
    *@description 支付
    *@permisstion none
    *@method post
    *@param order_id:订单id
    *@param pay_way:支付方式  wx 威信 ，alipay 支付宝
    */
    {
        name: 'payDo',
        url: '/Payment/Pay/payDo',
        method: 'post',
    },
    /**
     *@name CheckPayPass
     *@version 0.1.0
     *@description 验证取现密码
     *@permisstion none
     *@method post
     *@param password:密码
     */
    {
        name: 'CheckPayPass',
        url: '/Payment/Pay/CheckPayPass',
        method: 'post',
    },

    /**
     *@name checkForgtMobile
     *@version 0.1.0
     *@description 忘记密码的��信验证码
     *@permisstion none
     *@method post
     *@param mobile:手机号码
     *@param code:手机短信验证码
     */
    {
        name: 'checkForgtMobile',
        url: '/Payment/Pay/checkForgtMobile',
        method: 'post',
    },

    /**
     *@name getFeeSelect
     *@version 0.1.0
     *@description 费率选择
     *@permisstion none
     *@method post
     *@param money:提现金额
     */
    {
        name: 'getFeeSelect',
        url: '/Payment/Pay/getFeeSelect',
        method: 'post',
    },

    /**
     *@name getMobileCode
     *@version 0.1.0
     *@description 忘记密码的短信验证码发送
     *@permisstion none
     *@method post
     *@param mobile:手机号码
     */
    {
        name: 'getMobileCode',
        url: '/Payment/Pay/getMobileCode',
        method: 'post',
    },

    /**
     *@name merchantCashOut
     *@version 0.1.0
     *@description 商户取现操作
     *@permisstion none
     *@method post
     *@param bank_code:银行code
     *@param sub_bank_name:银行名
     *@param money:金额
     *@param fee_id:费率id
     *@param card_holder:账户名
     *@param card_no:账户号码
     */
    {
        name: 'merchantCashOut',
        url: '/Payment/Pay/merchantCashOut',
        method: 'post',
    },

    /**
     *@name merchantCashoutPage
     *@version 0.1.0
     *@description 商户取现显示
     *@permisstion none
     *@method post
     */
    {
        name: 'merchantCashoutPage',
        url: '/Payment/Pay/merchantCashoutPage',
        method: 'post',
    },

    /**
     *@name setPassword
     *@version 0.1.0
     *@description 忘记密码的重置密码
     *@permisstion none
     *@method post
     *@param password:新密码
     *@param password_repeat:新密码验证
     *@param access_token:访问密钥
     */
    {
        name: 'setPassword',
        url: '/Payment/Pay/setPassword',
        method: 'post',
    },

    /**
     *@name setPayPass
     *@version 0.1.0
     *@description 设置取现密码
     *@permisstion none
     *@method post
     *@param password:密码
     */
    {
        name: 'setPayPass',
        url: '/Payment/Pay/setPayPass',
        method: 'post',
    },

    /**
     *@name platintegral
     *@version 0.1.0
     *@description 平台积分对接
     *@permisstion none
     *@method post
     *@param uid:平台用户uid
     *@param consumeintegral:消耗积分数
     *@param type:兑换券方式(全额兑换 还是积分摇一摇)
     *@param couponinfo:兑换券信息
     */
    {
        name: 'platintegral',
        url: '/Public/Platform/platintegral',
        method: 'post',
    },

    /**
     *@name platinvest
     *@version 0.1.0
     *@description 平台投资对接
     *@permisstion none
     *@method post
     *@param pf_user_id:乐消用户id
     *@param all_balance:平台账户总金额
     *@param invest_record_id:平台投资记录id
     *@param amount:投资金额
     *@param prj_id:平台投资标id
     *@param year_rate:投资标利率
     *@param time_limit:投资标期限
     *@param payback_way:还款方式
     */
    {
        name: 'platinvest',
        url: '/Public/Platform/platinvest',
        method: 'post',
    },

    /**
     *@name platuser
     *@version 0.1.0
     *@description 平台用户对接
     *@permisstion none
     *@method post
     *@param from:用户来源
     *@param plat_user_id:乐消用户uid
     *@param mobile:乐消用户手机号
     */
    {
        name: 'platuser',
        url: '/Public/Platform/platuser',
        method: 'post',
    },

    /**
     *@name uploadImg
     *@version 0.1.0
     *@description 上传图片
     *@permisstion none
     *@method post
     *@param is_thumb:图片
     */
    {
        name: 'uploadImg',
        url: '/Public/Upload/uploadImg',
        method: 'post',
    },

    /**
     *@name CouponList
     *@version 0.1.0
     *@description 兑换优惠卷
     *@permisstion none
     *@method post
     *@param coupon_status:优惠卷分类 1 未使用 2 已使用 3 过期
     */
    {
        name: 'CouponList',
        url: '/User/User/CouponList',
        method: 'post',
    },

    /**
     *@name changePoint
     *@version 0.1.0
     *@description 兑换积分
     *@permisstion none
     *@method post
     *@param cid:福利券cid
     *@param pid:平台pid
     *@param number:购买数量
     */
    {
        name: 'changePoint',
        url: '/User/Coupon/changePoint',
        method: 'post',
    },

    /**
     *@name exchangeCoupon
     *@version 0.1.0
     *@description 兑换优惠卷
     *@permisstion none
     *@method post
     *@param coupon_id:优惠卷id
     *@param merhcant_id:商户id
     *@param num:数量
     */
    {
        name: 'exchangeCoupon',
        url: '/User/User/exchangeCoupon',
        method: 'post',
    },

    /**
     *@name getWelfareCoupon
     *@version 0.1.0
     *@description 摇一摇领取券
     *@permisstion none
     *@method post
     *@param wid:摇一摇Id
     */
    {
        name: 'getWelfareCoupon',
        url: '/User/Welfare/getWelfareCoupon',
        method: 'post',
    },

    /**
     *@name login
     *@version 0.1.0
     *@description 用户登录
     *@permisstion none
     *@method post
     *@param mobile:电话
     */
    {
        name: 'login',
        url: '/User/User/login',
        method: 'post',
    },

    /**
     *@name orderList
     *@version 0.1.0
     *@description 订单列表
     *@permisstion none
     *@method post
     *@param status:订单状态
     */
    {
        name: 'orderList',
        url: '/User/User/orderList',
        method: 'post',
    },

    /**
     *@name shakeDo
     *@version 0.1.0
     *@description 摇一摇 操作
     *@permisstion none
     *@method post
     *@param welfare_id:精品福利id
     */
    {
        name: 'shakeDo',
        url: '/User/User/shakeDo',
        method: 'post',
    },
    /**
    *@name getPrize
    *@version 0.1.0
    *@description 抽奖
    *@permisstion none
    *@method post
    *@param cid:精品福利id
    *@param pid:平台id
    */
    {
        name: 'getPrize',
        url: '/User/User/getPrize',
        method: 'post',
    },

    /**
     *@name shakeIndex
     *@version 3.10.9
     *@description 
     *@permisstion none
     *@method post
     *@param wid:摇一摇Id
     */
    {
        name: 'shakeIndex',
        url: '/User/User/shakeIndex',
        method: 'post',
    },

    /**
     *@name shakeLogList
     *@version 0.1.0
     *@description 摇一摇记录
     *@permisstion none
     *@method post
     */
    {
        name: 'shakeLogList',
        url: '/User/User/shakeLogList',
        method: 'post',
    },
    /**
     *@name bdMerchantInviteDetails
     */
    {
        name: 'bdMerchantInviteDetails',
        url: '/BD/Merchant/merchantInviteDetails',
        method: 'post',
    },
    /**
     *@name bdCouponList
     */
    {
        name: 'bdCouponList',
        url: '/BD/Coupon/couponList',
        method: 'post',
    },
    {
        name: 'bdCouponInfo',
        url: '/BD/Coupon/couponInfo',
        method: 'post',
    },
    {
        name: 'capitalRecordList',
        url: '/Public/Merchant/capitalRecordList',
        method: 'post',
    },
    {
        name: 'capitalRecordInfo',
        url: '/Public/Merchant/capitalRecordInfo',
        method: 'post',
    }, {
        name: 'addCouponForMerchant',
        url: '/BD/Coupon/addCouponForMerchant',
        method: 'post',
    }, {
        name: 'bdEditCoupon',
        url: '/BD/Coupon/editCoupon',
        method: 'post',
    }, {
        name: 'bdGetMerchantDetails',
        url: '/BD/Merchant/getMerchantDetails',
        method: 'post',
    }, {
        name: 'bdMerchantInviteDetails',
        url: '/BD/Merchant/merchantInviteDetails',
        method: 'post',
    }, {
        name: 'checkForgtMobile',
        url: '/Payment/Pay/checkForgtMobile',
        method: 'post',
    }, {
        name: 'getMobileCode',
        url: '/Payment/Pay/getMobileCode',
        method: 'post',
    }, {
        name: 'setPassword',
        url: '/Payment/Pay/setPassword',
        method: 'post',
    }, {
        name: 'setPayPass',
        url: '/Payment/Pay/setPayPass',
        method: 'post',
    }, {
        name: 'CheckPayPass',
        url: '/Payment/Pay/CheckPayPass',
        method: 'post',
    }, {
        name: 'inviteMerStaffInfo',
        url: '/Public/Merchant/inviteMerStaffInfo',
        method: 'post',
    }, {
        name: 'bindMerStaff',
        url: '/Public/Merchant/bindMerStaff',
        method: 'post',
    },
    {
        name: 'isAuthorize',
        url: '/Platform/Platform/isAuthorize',
        method: 'post'
    },
    {
        name: 'lexiaoAuthorize',
        url: '/Platform/Platform/lexiaoAuthorize',
        method: 'post'
    },
    {
        name: 'bdInviteMerCheckDo',
        url: '/Public/Merchant/bdInviteMerCheckDo',
        method: 'post'
    },
    {
        name: 'statisticMerchantData',
        url: '/Public/Merchant/statisticMerchantData',
        method: 'post'
    },
    {
        name: 'getBDinvitedInfo',
        url: '/BD/BD/getBDinvitedInfo',
        method: 'post'
    },
    {
        name: 'setBDinvited',
        url: '/BD/BD/setBDinvited',
        method: 'post'
    },
    {
        name: 'getBDSource',
        url: '/BD/Merchant/getBDSource',
        method: 'post'
    },
    {
        name: 'getBDMerchantDetails',
        url: '/BD/Merchant/getBDMerchantDetails',
        method: 'post'
    },
    {
        name: 'shelvesMerchant',
        url: '/Public/Merchant/shelvesMerchant',
        method: 'post'
    },
    {
        name: 'removeOrderList',
        url: '/User/Order/removeOrderList',
        method: 'post',
    },
    //用户订单详情
    {
        name: 'getUserOrderInfo',
        url: '/User/User/getUserOrderInfo',
        method: 'post',
    },
    //用户订单详情
    {
        name: 'getUserAllAuth',
        url: '/User/User/getUserAllAuth',
        method: 'post',
    },
    {
        name: 'getMerchantDetailssByBD',
        url: '/BD/Merchant/getMerchantDetailssByBD',
        method: 'post',
    },
    //查找优惠券适用商户
    {
        name: 'getMerchantByCoupon',
        url: '/User/Coupon/getMerchantByCoupon',
        method: 'post',
    },
    //城市模糊搜索
    {
        name: 'searchCity',
        url: '/Public/Index/searchCity',
        method: 'post',
    },
    //
    {
        name: 'checkPay',
        url: '/Payment/Pay/checkPay',
        method: 'post',
    },
    //BD审核商户
    {
        name: 'checkMerchant',
        url: '/BD/BD/checkMerchant',
        method: 'post',
    },
    //BD审核子BD
    {
        name: 'checkBD',
        url: '/BD/BD/checkBD',
        method: 'post',
    },
    //获取优惠券可用
    // * @apiParam {String} money           金额
    // * @apiParam {String} merchant_id   商户id
    {
        name:'getDefCoupon',
        url:'/Payment/Pay/getDefCoupon',
        method: 'post',
    },
    //参数 name
    {
        name:'addSearchWord',
        url:'/Public/Index/addSearchWord',
        method: 'post',
    },
     // * @apiParam {String} content          
    {
        name:'addFeedback',
        url:'/Public/Index/addFeedback',
        method: 'post',
    },
     // * @apiParam {String} merchant_id          
    {
        name:'getUseCouponCount',
        url:'/Payment/Pay/getUseCouponCount',
        method: 'post',
    },
    // * @apiParam {String} mobile          
    {
        name:'userOrderListSearch',
        url:'/Public/Merchant/userOrderListSearch',
        method: 'post',
    }
]