'use strict'
import mlux,{StoreManager} from 'mlux';
import api from './api';
function getCurrentCity(){
    return StoreManager.location.get('city');
}

function setCurrentCity(city,citycode){
    StoreManager.location.set('city',city);
    StoreManager.location.set('city_code',citycode);
}
function locate(){
   return api.getLocal().success(function(content,next) {
        StoreManager.location.set('city',content.data.city_name);
        StoreManager.location.set('city_code',content.data.city_code);
        StoreManager.location.set('area',content.data.area_name);
        StoreManager.location.set('province_name',content.data.province_name);
        StoreManager.location.set('province_code',content.data.province_code);
        if(content.data.lat){
            StoreManager.location.set('lat',content.data.lat+'');
            StoreManager.location.set('lon',content.data.lng+'');
        }
       next()
   });
}
export default {
    getCurrentCity,
    setCurrentCity,
    locate
}