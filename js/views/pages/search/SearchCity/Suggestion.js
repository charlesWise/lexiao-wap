import React from 'react';

import api from './../../../../controllers/api';
class Suggestion extends React.Component {
    constructor(...props) {
        super(...props);
        this.state = {
            data: '',
        }
        this._suggesting;
    }
    componentWillUnmount() {
        clearTimeout(this._suggesting);
    }
    
    suggest(value) {
        if (this._suggesting) {
            clearTimeout(this._suggesting);
        }
        this._suggesting = setTimeout(() => {
            if(!value||/^\s+$/.test(value)){
                this.setState({ data: [] }) ;
                return;
            }
            api.searchCity({ city_name: value }).success((content, next, abort) => {
                this.setState({
                    data: content.data || []
                })
                next();
            });
        }, 200);

    }
    _renderItems(data) {
        return data.map((item, i) => {
            return (
                <li key={i}>
                    <a
                        onClick={() => this.props.onSelected(item)}
                        href="javascript:">
                        {item.city_name}
                    </a>
                </li>
            );
        });
    }
    render() {
        var data = this.state.data;
        if (!data) {
            return null;
        }
        if (data.length < 1) {
            data = [{ city_name: '抱歉，查询后无此城市' }];
        }
        return (
            <ul className="search_list">
                {this._renderItems(data)}
            </ul>
        );
    }
}

export default Suggestion;