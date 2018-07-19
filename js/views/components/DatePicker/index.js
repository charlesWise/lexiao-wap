import React, { Component } from 'react';

import Wrapper from './../../components/Picker/Wrapper';
import Picker from './../../components/Picker/Picker';
import Header from './../../components/Picker/Header';
import Footer from './../../components/Picker/Footer';

var dateNow = new Date();
var nowYear = dateNow.getFullYear();
var nowMonth = dateNow.getMonth() + 1;
var nowDay = dateNow.getDate();
function formatString(v) {
    if (String(v).length < 2) {
        v = '0' + v;
    }
    return String(v);
}

class YearPicker extends Component {
    constructor(...props) {
        super(...props);
        this.state = {
            year: formatString(nowYear),
            lower: nowYear - 100,
            upper: nowYear + 100
        }
        this._stateFromProps(this.props);
    }

    _onChange(value) {
        this.props.onChange && this.props.onChange(value);
        this.setState({ year: value['id'] });
    }

    _stateFromProps(props) {
        if (props.year) {
            this.state.year = formatString(props.year);
        }
        if (props.upper) {
            this.state.upper = props.upper;
        }
        if (props.lower) {
            this.state.lower = props.lower;
        }
    }

    componentWillReceiveProps(nextProps) {
        this._stateFromProps(nextProps);
    }

    _renderRow() {
        var rows = [];
        var lower = this.state.lower;
        var upper = this.state.upper;
        for (; lower <= upper; lower++) {
            rows.push({ id: formatString(lower), name: lower + '年' });
        }
        return rows;
    }

    render() {
        return (
            <Picker
                dataSource={this._renderRow()}
                defaultValue={this.state.year}
                onChange={(value) => this._onChange(value)} />
        );
    }
}

class MonthPicker extends Component {
    constructor(...props) {
        super(...props);
        this.state = {
            month: formatString(nowMonth),
            lower: 1,
            upper: 12
        }
        this._stateFromProps(this.props);
    }

    _stateFromProps(props) {
        if (props.month) {
            this.state.month = formatString(props.month);
        }
        if (props.upper) {
            this.state.upper = props.upper;
        }
        if (props.lower) {
            this.state.lower = props.lower;
        }
    }

    componentWillReceiveProps(nextProps) {
        this._stateFromProps(nextProps);
    }

    _renderRow() {
        var rows = [];
        var lower = this.state.lower;
        var upper = this.state.upper;
        for (; lower <= upper; lower++) {
            rows.push({ id: formatString(lower), name: lower + '月' });
        }
        return rows;
    }

    _onChange(value) {
        this.props.onChange && this.props.onChange(value);
        this.setState({ month: value['id'] });
    }

    render() {
        return (
            <Picker
                dataSource={this._renderRow()}
                defaultValue={this.state.month}
                onChange={(value) => this._onChange(value)} />
        );
    }
}

class DayPicker extends Component {
    constructor(...props) {
        super(...props);
        this.state = {
            day: formatString(nowDay),
            lower: 1,
            upper: 31
        }
        this._stateFromProps(this.props);
    }

    _stateFromProps(props) {
        if (props.day) {
            this.state.day = formatString(props.day);
        }
        if (props.upper) {
            this.state.upper = props.upper;
        }
        if (props.lower) {
            this.state.lower = props.lower;
        }
    }

    componentWillReceiveProps(nextProps) {
        this._stateFromProps(nextProps);
    }

    _onChange(value) {
        this.props.onChange && this.props.onChange(value);
        this.setState({ day: value['id'] });
    }

    _renderRow() {
        var rows = [];
        var lower = this.state.lower;
        var upper = this.state.upper;
        for (; lower <= upper; lower++) {
            rows.push({ id: formatString(lower), name: lower + '日' });
        }
        return rows;
    }

    render() {
        return (
            <Picker
                dataSource={this._renderRow()}
                defaultValue={this.state.day}
                onChange={(value) => this._onChange(value)} />
        );
    }
}

export default class DatePicker extends Component {
    constructor(...props) {
        super(...props);
        var now = Date.now();

        this.state = {
            year: formatString(nowYear),
            day: formatString(nowDay),
            month: formatString(nowMonth),
            lower: undefined,
            upper: undefined,
            yearBound: {},
            dayBound: {},
            monthBound: {}
        }
        this._stateFromProps(this.props);
    }

    _stateFromProps(props) {
        if (props.year) {
            this.state.year = formatString(props.year);
        }
        if (props.day) {
            this.state.day = formatString(props.day);
        }
        if (props.month) {
            this.state.month = formatString(props.month);
        }
        if (props.lowerTime) {
            this.state.lower = new Date(props.lowerTime);
        }
        if (props.upperTime) {
            this.state.upper = new Date(props.upperTime);
        }
        this._resetYearBound();
        this._resetMonthBound();
        this._resetDayBound();
    }

    _resetDayBound() {
        var lower = 1, upper = new Date(this.state.year, this.state.month, 0).getDate();
        var yearBound = this.state.yearBound;
        var monthBound = this.state.monthBound;
        if (this.state.lower && yearBound.lower && yearBound.lower >= this.state.year && monthBound.lower && monthBound.lower >= this.state.month) {
            lower = this.state.lower.getDate();
        }
        if (this.state.upper && yearBound.upper && yearBound.upper <= this.state.year && monthBound.upper && monthBound.upper <= this.state.month) {
            upper = this.state.upper.getDate();
        }
        if (parseInt(this.state.day) < lower) {
            this.state.day = formatString(lower);
        } else if (parseInt(this.state.day) > upper) {
            this.state.day = formatString(upper);
        }
        this.state.dayBound = { lower, upper }
    }

    _resetMonthBound() {
        var lower = 1, upper = 12;
        var yearBound = this.state.yearBound;
        if (yearBound.lower && yearBound.lower >= this.state.year && this.state.lower) {
            lower = this.state.lower.getMonth() + 1;
        }
        if (yearBound.upper && yearBound.upper <= this.state.year && this.state.upper) {
            upper = this.state.upper.getMonth() + 1;
        }
        if (parseInt(this.state.month) < lower) {
            this.state.month = formatString(lower);
        } else if (parseInt(this.state.month) > upper) {
            this.state.month = formatString(upper);
        }
        this.state.monthBound = { lower, upper }
    }

    _resetYearBound() {
        var lower, upper;
        if (this.state.lower) {
            lower = this.state.lower.getFullYear();
        } else {
            lower = dateNow.getFullYear() - 100;
        }
        if (this.state.upper) {
            upper = this.state.upper.getFullYear();
        } else {
            upper = dateNow.getFullYear() + 100;
        }
        this.state.yearBound = { lower, upper }
    }

    componentWillReceiveProps(nextProps) {
        this._stateFromProps(nextProps);
    }

    _onCancel() {
        this.props.onCancel && this.props.onCancel()
    }

    _onReset() {
        this.props.onReset && this.props.onReset()
    }

    _onSelected() {
        this.props.onSelected && this.props.onSelected({
            year: this.state.year,
            month: this.state.month,
            day: this.state.day
        })
    }

    _onYearChange(year) {
        console.log('year>>>>>', year)
        this.state.yearObj = year;
        this.state.year = year['id'];
        this._resetMonthBound();
        this._resetDayBound();
        this.forceUpdate();
    }

    _onMonthChange(month) {
        console.log('month>>>>>', month)
        this.state.monthObj = month;
        this.state.month = month['id'];
        this._resetDayBound();
        this.forceUpdate();
    }

    _onDayChange(day) {
        console.log('day>>>>>', day)
        this.state.dayObj = day;
        this.state.day = day['id']
    }

    render() {
        return <Wrapper
            style={{
                position: 'absolute',
                width: '100%',
                bottom: 0
            }}
            header={
                !this.props.isFooter && <Header
                    onCancel={this._onCancel.bind(this)}
                    onSelected={this._onSelected.bind(this)}
                />
            }
            footer={
                this.props.isFooter && <Footer
                    onReset={this._onReset.bind(this)}
                    onSelected={this._onSelected.bind(this)}
                />
            }
        >
            <YearPicker
                {...this.state.yearBound}
                defaultValue={this.state.year}
                onChange={this._onYearChange.bind(this)}
            />
            <MonthPicker
                {...this.state.monthBound}
                defaultValue={this.state.month}
                onChange={this._onMonthChange.bind(this)}
            />
            <DayPicker
                {...this.state.dayBound}
                defaultValue={this.state.day}
                onChange={this._onDayChange.bind(this)}
            />
        </Wrapper>
    }
}