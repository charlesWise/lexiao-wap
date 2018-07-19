'use strict'
import { StoreManager } from 'mlux';
import api from './api';
function doApply(
    params: {
        merchant_name: any,
        licences: any,
        person: any,
        tel: any,
        address: any,
        introduction: any,
        provice: any,
        city: any,
        area: any,
        provice_id: any,
        city_id: any,
        area_id: any
    }): any {
    return api.bdApply({
        merchant_name: params.merchant_name,
        licences: params.licences,
        person: params.person,
        tel: params.tel,
        address: params.address,
        introduction: params.introduction,
        provice: params.provice,
        city: params.city,
        area: params.area,
        provice_id: params.provice_id,
        city_id: params.city_id,
        area_id: params.area_id
    });
}
export default {
    doApply
}