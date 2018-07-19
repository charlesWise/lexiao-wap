import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

export default class Picker extends Component {

    static propTypes = {
        dataSource: PropTypes.array,
        labelName: PropTypes.string,//被选中的对象的 label 的 key
        valueName: PropTypes.string,//被选中的对象的 value 的key
        defaultValue: PropTypes.any,//默认值
        itemHeight: PropTypes.number,
        columnHeight: PropTypes.number,
        onChange: PropTypes.func
    };

    static defaultProps = {
        dataSource: [],
        labelName: 'name',
        valueName: 'id',
        itemHeight: 36,
        columnHeight: 216
    };

    constructor(...props) {
        super(...props);
        this.state = {
            selectedValue: {},
            isMoving: false,
            startTouchY: 0,
            startScrollerTranslate: 0
        };
    }

    componentWillMount() {
        this.setState({
            ...this.initTranslate(this.props)
        })
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.dataSource, this.props.dataSource)){
            this.setState({
                ...this.initTranslate(nextProps)
            })
        }
    }
    
    initTranslate = (props) => {
        const { dataSource, defaultValue, itemHeight, columnHeight } = props;
        return this.computeTranslate({
            dataSource: dataSource,
            value: defaultValue,
            itemHeight: itemHeight,
            columnHeight: columnHeight,
        })
    };

    computeTranslate = (props) => {
        let self = this;
        let obj = {};

        const dataSource = props.dataSource || this.props.dataSource;
        const value = props.value;
        const itemHeight = props.itemHeight || this.props.itemHeight;
        const columnHeight = props.columnHeight || this.props.columnHeight;

        let selectedIndex;

        if (dataSource && dataSource.length > 0){
            selectedIndex = _.findIndex(dataSource, function (o) { return o[self.props.valueName] == value; });
            if (selectedIndex < 0) {
                selectedIndex = 0;
                let selectedValue = dataSource[selectedIndex];
                obj = {
                    value: selectedValue[self.props.valueName],
                    selectedValue: selectedValue
                }
                this.props.onChange && this.props.onChange(selectedValue);
            } else {
                let selectedValue = dataSource[selectedIndex];
                obj = {
                    value: value,
                    selectedValue: selectedValue
                }
                this.props.onChange && this.props.onChange(selectedValue);
            }
        }
        
        return Object.assign({
            scrollerTranslate: columnHeight / 2 - itemHeight / 2 - selectedIndex * itemHeight,
            minTranslate: columnHeight / 2 - itemHeight * dataSource.length + itemHeight / 2,
            maxTranslate: columnHeight / 2 - itemHeight / 2
        }, obj)
    };

    onValueSelected = (newValue) => {
        this.setState({
            ...this.computeTranslate({
                value: newValue[this.props.valueName]
            }),
            selectedValue: newValue
        });
    };

    handleTouchStart = (event) => {
        const startTouchY = event.targetTouches[0].pageY;
        this.setState(({ scrollerTranslate }) => ({
            startTouchY,
            startScrollerTranslate: scrollerTranslate
        }));
    };

    handleTouchMove = (event) => {
        event.preventDefault();
        const touchY = event.targetTouches[0].pageY;
        this.setState(({ isMoving, startTouchY, startScrollerTranslate, minTranslate, maxTranslate }) => {
            if (!isMoving) {
                return {
                    isMoving: true
                }
            }

            let nextScrollerTranslate = startScrollerTranslate + touchY - startTouchY;
            if (nextScrollerTranslate < minTranslate) {
                nextScrollerTranslate = minTranslate - Math.pow(minTranslate - nextScrollerTranslate, 0.8);
            } else if (nextScrollerTranslate > maxTranslate) {
                nextScrollerTranslate = maxTranslate + Math.pow(nextScrollerTranslate - maxTranslate, 0.8);
            }
            return {
                scrollerTranslate: nextScrollerTranslate
            };
        });
    };

    handleTouchEnd = (event) => {
        if (!this.state.isMoving) {
            return;
        }
        this.setState({
            isMoving: false,
            startTouchY: 0,
            startScrollerTranslate: 0
        });
        setTimeout(() => {
            const { dataSource, itemHeight } = this.props;
            const { scrollerTranslate, minTranslate, maxTranslate } = this.state;
            let activeIndex;
            if (scrollerTranslate > maxTranslate) {
                activeIndex = 0;
            } else if (scrollerTranslate < minTranslate) {
                activeIndex = dataSource.length - 1;
            } else {
                activeIndex = - Math.floor((scrollerTranslate - maxTranslate) / itemHeight);
            }
            this.onValueSelected(dataSource[activeIndex]);
        }, 0);
    };

    handleTouchCancel = (event) => {
        if (!this.state.isMoving) {
            return;
        }
        this.setState((startScrollerTranslate) => ({
            isMoving: false,
            startTouchY: 0,
            startScrollerTranslate: 0,
            scrollerTranslate: startScrollerTranslate
        }));
    };

    handleItemClick = (e,option) => {
        e.stopPropagation();
        if (option[this.props.valueName] !== this.props.value) {
            this.onValueSelected(option);
        }
    };

    renderItems() {
        const { dataSource, itemHeight } = this.props;
        let self = this;
        return dataSource.map((data, index) => {
            const style = {
                height: itemHeight + 'px',
                lineHeight: itemHeight + 'px'
            };
            const className = `picker-item${_.isEqual(data, this.state.selectedValue) ? ' picker-item-selected' : ''}`;
            return (
                <Item
                    key={index}
                    className={className}
                    style={style}
                    data={data}
                    label={data[self.props.labelName]}
                    onClick={(e) => this.handleItemClick(e,data)}
                />
            );
        });
    }

    render() {
        const translateString = `translate3d(0, ${this.state.scrollerTranslate}px, 0)`;
        const style = {
            MsTransform: translateString,
            MozTransform: translateString,
            OTransform: translateString,
            WebkitTransform: translateString,
            transform: translateString
        };
        if (this.state.isMoving) {
            style.transitionDuration = '0ms';
        }
        return (
            <div className="picker-column">
                <div
                    className="picker-scroller"
                    style={style}
                    onTouchStart={this.handleTouchStart}
                    onTouchMove={this.handleTouchMove}
                    onTouchEnd={this.handleTouchEnd}
                    onTouchCancel={this.handleTouchCancel}>
                    {this.renderItems()}
                </div>
            </div>
        )
    }
}

class Item extends Component {
    constructor(...props) {
        super(...props);
        this.state = {}
    }

    render() {
        const { className, style, data, label, onClick} = this.props;
        return (
            <div
                className={className}
                style={style}
                onClick={(e) => onClick(e,data)}
            >
                {label}
            </div>
        )
    }

}