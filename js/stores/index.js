'use strict'
export default [
	{
		name:'auth',
		model:{
			token:'',
			uid:''
		}
	},
	{
		name:'user',
		model:{
			auth: [],
			info:{},
			isLogin:false
		},
		storage:true
	},
	{
		name:'location',
		model:{
			city:'',//城市
			city_code:'',//城市code
			area:'',
			area_id:'',
			province_code:'',
			province_name:'',
			lat:'',//维度
			lon:''//精度
		}
	},
	{
		name:'searchHistory',
		model:{
			shopList:[]
		},
		storage:true
	},
	{
		name:'trjAuthUser',
		model:{
			info: {}
		},
		storage:true
	},
	{
		name:'regInfo',
		model:{
			mobile: ''
		},
		storage:true
	}
]
/**
 * StoreManager.user.get('mobile')
 * 
 * StoreManager.user.set('mobile','13566667777')
 * 
 * StoreManager.user.assign({'mobile':'13566667777',userName:'hello'})
 * 
 * StoreManager.user.copy() //return {'mobile':'13566667777',userName:'hello'}
 */