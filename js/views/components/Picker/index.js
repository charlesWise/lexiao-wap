import React, { Component } from 'react';
import _ from 'lodash';

import Wrapper from './../../components/Picker/Wrapper';
import Picker from './../../components/Picker/Picker';
import Header from './../../components/Picker/Header';

export default class PickerWithWrapper extends Component {
    constructor(...props) {
        super(...props);
        this.state = {
            data: {}
        }
    }

    _onCancel() {
        this.props.onCancel && this.props.onCancel();
    }

    _onSelected() {
        this.props.onSelected && this.props.onSelected(this.state.data);
    }

    _onChange(data) {
        this.state.data = data;
        this.props.onChange && this.props.onChange(data);
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
            <Picker
                defaultValue={this.props.defaultValue}
                labelName={this.props.labelName}
                valueName={this.props.valueName}
                dataSource={this.props.dataSource}
                onChange={(data) => {
                    this._onChange(data)
                }}
            />
        </Wrapper>
    }
}