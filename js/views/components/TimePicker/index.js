import React, { Component } from 'react';

import Wrapper from './../../components/Picker/Wrapper';
import Picker from './../../components/Picker/Picker';
import Header from './../../components/Picker/Header';

function formatString(v) {
    if (String(v).length < 2) {
        v = '0' + v;
    }
    return String(v);
}

// function createHours() {
//     var rows = [];
//     for (let i = 1; i <= 24; i++) {
//         rows.push({ id: formatString(i), name: formatString(i) });
//     }
//     return rows;
// }

// function createMins() {
//     var rows = [];
//     for (let i = 1; i <= 60; i++) {
//         rows.push({ id: formatString(i), name: formatString(i) });
//     }
//     return rows;
// }

export default class TimePicker extends Component {
    constructor(...props) {
        super(...props);
        this.state = {}
    }

    _onCancel() {
        this.props.onCancel && this.props.onCancel()        
    }

    _onSelected() {
        this.props.onSelected && this.props.onSelected({
            start: this.refs.start.value(),
            end: this.refs.end.value()
        })
    }

    render() {
        return <Wrapper
            style={{
                position: 'absolute',
                width: '100%',
                bottom: 0
            }}
            header={
                <Header
                    onCancel={this._onCancel.bind(this)}
                    onSelected={this._onSelected.bind(this)}
                />
            }
        >
            <ItemPicker ref='start'/>
            <div className='picker-separator'>至</div>
            <ItemPicker ref='end'/>
        </Wrapper>
    }
}

class ItemPicker extends Component {
    constructor(...props) {
        super(...props);
        this.state = {}
    }

    createHours() {
        var rows = [];
        for (let i = 0; i <= 24; i++) {
            rows.push({ id: formatString(i), name: formatString(i) });
        }
        return rows;
    }

    createMins() {
        var rows = [];
        for (let i = 0; i <= 60; i++) {
            rows.push({ id: formatString(i), name: formatString(i) });
        }
        return rows;
    }

    value(){
        return this.state.hour + ':' + this.state.min;
    }

    render() {
        return <div style={{
            display: 'inherit'
        }}>
            <Picker
                dataSource={this.createHours()}
                onChange={(data) => {
                    console.log('onChange>>>>>', data)
                    this.state.hour = data.id;
                }}
            />
            <div className='picker-separator'>:</div>
            <Picker
                dataSource={this.createMins()}
                onChange={(data) => {
                    console.log('onChange>>>>>', data)
                    this.state.min = data.id;
                }}
            />
        </div>
    }
}