'use strict'
import Bridge from './bridge';
import map from './../controllers/map';
function getGPS(callback) {
    return new Promise(function (resolve, reject) {
       
        
        
        if(Bridge.clientType==='android' && Bridge.isAppClient){
            Bridge.getCurrentLocation(function(result){
                if(result){
                    console.log('android 定位成功', result);
                    let convertor = new BMap.Convertor();
                    convertor.translate([{
                        lat:result.latitude,
                        lng:result.longitude
                    }],1,5,function(e){
                        if(e.status==0){
                            let point = e.points[0];
                            resolve({
                                latitude:point.lat,
                                longitude:point.lng
                            })
                        }else{
                            resolve(result);
                        }
                    });

                }else{
                    console.log('android 定位失败');
                    reject();
                }
            })
        }else{
            let resolved = false;
            let timeout = setTimeout(function(){
                resolved = true;
                reject();
            },5000);
            if (navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function(position){
                    if(resolved){
                        return;
                    }
                    resolved = true;
                    clearTimeout(timeout);
                    if(!position){
                        reject();
                    }else{
                        let {
                            latitude,
                            longitude
                        } = position.coords;
                        map.convertGPS(latitude,longitude,function(point){
                            console.log(point,'position定位成功')
                            if(point){
                                resolve({
                                    latitude:point.lat,
                                    longitude:point.lng
                                });
                            }else{
                                resolve({
                                    latitude,
                                    longitude
                                });
                            }
                            
                        });
                    }
                },function(){
                    resolved = true;
                    console.log('position定位失败')
                    clearTimeout(timeout);
                    reject();
                    //test
                    // map.convertGPS('31.230416','121.473701',function(point){
                    //     console.log(point,'position定位成功')
                    //     if(point){
                    //         resolve({
                    //             latitude:point.lat,
                    //             longitude:point.lng
                    //         });
                    //     }else{
                    //         resolve({
                    //             latitude,
                    //             longitude
                    //         });
                    //     }
                        
                    // });
                })
            }
            // let geolocation = new BMap.Geolocation();
            // geolocation.getCurrentPosition(function (result) {
            //     if (result) {
            //         console.log('定位成功', result);
            //         let point = result.point;
            //         resolve({
            //             latitude:point.lat,
            //             longitude:point.lng
            //         });
            //     } else {
            //         console.log('定位失败');
            //         reject();
            //     }
            // });
        }
        
    });

}

export default {
    getGPS
}