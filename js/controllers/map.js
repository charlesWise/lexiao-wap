'use strict'
function getPointByAddress(address, city, callback) {
    var myGeo = new BMap.Geocoder();
    myGeo.getPoint(address, function (point) {
        callback(point);
    }, city);
}
//百度point转gps
function convertPoint() {

}
//gps转百度point
function convertGPS(x, y, callback) {
    var points = [{
        lat:x,
        lng:y
    }];
    var convertor = new BMap.Convertor();
    convertor.translate(points, 1, 5, function (data) {
        if (data.status === 0) {
            return callback&&callback(data.points[0]);
        } else {
            return callback&&callback(null);
        }
    })
}

function locate(callback) {
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            callback(r);
        }else {
            var myCity = new BMap.LocalCity();
            myCity.get(function(city){
                getPointByAddress(city.name,city,function(point){
                    callback({point});
                })
            }); 
        }
    });
}
export default {
    convertGPS,
    convertPoint,
    getPointByAddress,
    locate
}