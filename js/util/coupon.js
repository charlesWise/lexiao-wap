'use strict'
function nameByType(type){
    if(type==1){
        return '代金券'
    }else{
        return '满减券'
    }
}
function plantCoupon(type){
    if(type==1){
        return '红包'
    }else{
        return '满减券'
    }
}
function couponTypeName(type,palnt_type){
    if(palnt_type==='1'){
        return plantCoupon(type);
    }else{
        return nameByType(type);
    }
}
export default {
    nameByType,
    couponTypeName
}