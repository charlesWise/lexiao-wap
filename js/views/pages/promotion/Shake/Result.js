'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';


class Result extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            status: 0
        }
    }
    show() {

    }
    hide() {

    }
    render() {
        let { status } = this.state;
        switch (status) {
            case 0:
                return null;
            case 1:
                return (
                    <div className="win_sucess">
                        <h1>领取成功</h1>
                        <p 
                            className="text">
                            请进入
                            <em>“账户”-->"我的福利"</em>
                            中查看已领取的福利
                        </p>
                        <p>
                            <a 
                                href="javascript:void(0)">去查看</a>
                            <a href="javascript:void(0)">去使用</a>
                        </p>
                    </div>
                );
            case 2:
                return (
                    <div className="win_sucess">
                        <p className="no_prize">很遗憾没有中奖</p>
                        <p>
                            <a href="javascript:void(0)">
                                查看其他福利
                            </a>
                            <a href="javascript:void(0)">
                                再摇一次
                            </a>
                        </p>
                    </div>
                );
            case 3:
                return (
                    <div className="win_sucess">
                    <p className="no_number">
                        您今天的免费摇一摇次数已用完投资每满1000元即可获得1次摇一摇机会</p>
                    <p>
                        <a href="javascript:void(0)">取消</a>
                        <a href="javascript:void(0)">去投资</a>
                    </p>
                </div>
                );
            default:
                return null;
        }
    }
}

export default Result;