'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import Map from './../../../components/Map';

function BackButton(props) {
    return (
        <p
            onClick={props.onClick}
            style={{
                position: 'absolute',
                top: '1.5rem',
                left: '1rem',
                height: '2rem',
                width: '2rem',
                lineHeight: '2rem',
                textAlign: 'center',
                borderRadius: '1rem',
                background: '#fefefe'
            }}>
            <span
                style={{
                    display: 'inline-block',
                    borderTop: '1px black solid',
                    borderLeft: '1px black solid',
                    transform: 'rotate(-45deg)',
                    height: '0.5rem',
                    width: '0.5rem',
                    WebkitTransform: 'rotate(-45deg)'
                }} />
        </p>
    );
}
function LocationInfo(props) {
    console.log(props.icon)
    return (
        <footer
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2.4rem',
                background: '#fff',
                padding: '0.5rem',
                boxShadow:'0 -2px 2px 0 rgba(0,0,0,0.12), 0 -2px 6px 0 rgba(0,0,0,0.12)'
            }}>
            <img
                style={{ height: '2.4rem', width: '2.4rem', marginRight: '0.5rem', float: 'left' }}
                src={props.icon} />
            <div>
                <p
                    style={{ color: 'rgba(0,0,0,0.87)', fontSize: '0.7rem', lineHeight: '0.7rem' }}>{props.merchant_name}</p>
                <p
                    style={{ color: '#333', fontSize: '0.6rem', marginTop: '0.3rem', lineHeight: '0.6rem' }}>{props.address}</p>
                <p
                    style={{ color: '#999', fontSize: '0.6rem', marginTop: '0.3rem', lineHeight: '0.6rem' }}>距您{props.distance}km</p>
            </div>
        </footer>
    );
}
function CheckPath(props) {
    return (
        <p
            onClick={props.onClick}
            style={{
                position: 'absolute',
                bottom: '4.4rem',
                right: '1rem',
                fontSize: '0.7rem',
                color:'#FF5A00',
                textAlign: 'center',
                padding:'0.5rem 1.05rem',
                background:'#fff',
                borderRadius:'2px'
            }}>
            查看路线
        </p>
    )
}
function Locate(props) {
    return (
        <p
            style={{
                position: 'absolute',
                bottom: '4.4rem',
                left: '1rem',
                padding:'0.4rem',
                borderRadius:'2px',
                background:'#fff'
            }}>
            <img
                onClick={props.onClick}
                style={{
                    height: '1rem',
                    width: '1rem'
                }}
                src='/images/map/icon_locate.png' />
        </p >

    );
}
class EMap extends ScreenComponent {
    constructor(...props) {
        super(...props);
    }
    render() {
        var info = this.props;

        // var clientHeight = document.body.clientHeight;
        return (
            <section style={{ height: '100%', width: '100%', position: 'relative' }}>
                <Map
                    ref='MAP'
                    address={info.address}
                    city={info.city} />
                <BackButton
                    onClick={info.onClose} />
                <LocationInfo
                    merchant_name={info.merchant_name}
                    icon={info.logo}
                    distance={info.distance}
                    address={info.address} />
                <Locate
                    onClick={() => this.refs['MAP'] && this.refs['MAP'].togglePath()} />
            </section>
        );
    }
}
export default EMap;