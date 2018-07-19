'use strict'
import { StoreManager } from 'mlux';
import api from './api';
function setShopSearchHistory(name) {
    var shopList = StoreManager.searchHistory.get('shopList');
    var hasSetted = false;
    for (let l = shopList.length - 1, item; l >= 0; l--) {
        item = shopList[l];
        if (item.name == name) {
            item.times += 1;
            item.timestamp = Date.now();
            hasSetted = true;
            break;
        }
    }
    if (!hasSetted) {
        shopList.push({
            name: name,
            times: 1,
            timestamp: Date.now()
        });
    }
    StoreManager.searchHistory.set('shopList', shopList);
}
function removeShopSearchHistory(name) {
    var shopList = StoreManager.searchHistory.get('shopList');
    for (let l = shopList.length - 1, item; l >= 0; l--) {
        item = shopList[l];
        if (item.name == name) {
            shopList.splice(l, 1);
            StoreManager.searchHistory.set('shopList', shopList);
            return;
        }
    }
}
function clearShopSearchHistory() {
    StoreManager.searchHistory.set('shopList', []);
}
function searchMerchant(
    params: {
        area_id?: any,
        merchant_type_id?: any,
        order_by?: any,
        merchant_name: any,
        type?:string
    }):any{
    setShopSearchHistory(params.merchant_name);
    return api.searchMerchant({
        area_id: params.area_id||"",
        merchant_type_id: params.merchant_type_id||'',
        order_by: params.order_by||'',
        merchant_name: params.merchant_name||'',
        type:params.type||''
    });
}
export default {
    setShopSearchHistory,
    removeShopSearchHistory,
    clearShopSearchHistory,
    searchMerchant
}