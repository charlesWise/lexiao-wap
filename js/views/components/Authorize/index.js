import React from 'react';

function Authorize(props) {
    return (
        <div
            style={{
                height:'100%',
                width:'100%',
                backgroundImage:'url(images/index/bg.png)',
                backgroundSize:'100% 100%',
                position:'relative'
            }}>
            <div
                style={{
                    height:'100%',
                    width:'100%',
                    position:'absolute',
                    backgroundColor:'rgba(120,120,120,0.5)'
                }}>

            </div>
            <div className="authorized">
                <a 
                    onClick={props.onClose}
                    className="closed"></a>
                <div className="accredit_tit">服务授权</div>
                <div className="accredit_ts">使用投融家福利板块,您需授权 <em>乐消</em> 获取以下信息</div>
                <div className="accredit_hq"><i></i>获取你的公开信息(昵称、头像等)</div>
                <div className="accredit_ty">本人同意并接受<em onClick={props.onProtocol}>《乐消注册服务协议》</em></div>
                <a 
                    href="javascript:" 
                    onClick={props.onConfirm}
                    className="accredit_btn">确认</a>
            </div>
        </div>
    )
}

export default Authorize;