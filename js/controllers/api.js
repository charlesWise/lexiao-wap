import Http from './../util/Http';
import BuildConfig from 'build-config';
import API_LIST from './../constants/API_LIST';
import GPS from './../util/GPS';
import {StoreManager} from 'mlux';
function createApi(apilist) {
    var map = {};
    apilist.forEach(function(config) {
        var {
            name,
            url,
            method
        } = config;
        url = BuildConfig.API_CONTEXT+url;
        map[name] = function (params,headers) {
            params = params||{};
            let location = StoreManager.location.copy();
            if(!params.lat&&location.lat){
                params.lat = location.lat;
                params.lng = location.lon;
                
            }
            if(!params.city_code&&location.city_code){
                params.city_code = location.city_code;
            }
            var httpLine = Http.sendRequest(url,params,method,headers);
            return httpLine;
        }
    });
    return map;
}
var api = createApi(API_LIST);

var getLocal = api.getLocal;

api.getLocal = function(){
    var httpLine = getLocal();
    httpLine.before(function(data,next,abort){
        
        GPS.getGPS().then(function(position){
            httpLine.httpEntity.params = {
                lat:position.latitude,
                lng:position.longitude,
            }
            next();
        },function(){
            next();
        });
    })
    return httpLine;
    
}
export default api;

