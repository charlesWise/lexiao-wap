import BuildConfig from 'build-config';

var baseUrl = ''
if (BuildConfig.ENV === 'dev') {
    baseUrl = 'http://testlxphp.tourongjia.com'
} else if (BuildConfig.ENV === 'ft') {
    baseUrl = 'http://testlxphp.tourongjia.com'
}else if(BuildConfig.ENV ==='prod'){
    baseUrl = 'https://api.golexiao.com'
}

const paydoURL = baseUrl + '/Payment/Pay/payDo';

function parsePaySourceToURL(source) {
    switch (source) {
        case 'welfare':
            return '/member/welfare';
        case 'payment':
            return '/member/payment';
        default:
            let data = source.split('_');
            if(data.length===2&&data[0]==='merchantdetail'){
                return '/merchantdetail:id='+data[1];
            }else{
                return;
            }
    }
}
function getPaySourceByURL(url,merchant_id) {
    switch (url) {
        case '/merchantdetail':
            return 'merchantdetail_'+merchant_id;
        case '/member/welfare':
            return 'welfare';
        case '/member/payment':
            return 'payment';
        default:
            return 'merchantdetail';
    }
}
function payDo(order_id, pay_type,source) {
    location.href = paydoURL + '?order_id=' + order_id + '&pay_type=' + pay_type+'&source='+source;
}

export default {
    payDo,
    getPaySourceByURL,
    parsePaySourceToURL
}