'use strict'
import React, {
    Component
} from 'react';
import Card from './Card';
class CardStack extends Component {
    constructor(...props) {
        super(...props);
        this._contribute = false;
        this._contributeData=null
    }
    componentDidUpdate(prevProps, prevState) {
        if(this._contribute){
            this._currentRef.receive(...this._contributeData);
        }
        this._contribute = false;
        this._contributeData=null
    }

    _cacheCurrent(isCurrent, v) {
        if (isCurrent) {
            this._currentRef = v;
        }
    }
    _onContribute=(from, data)=> {
        this._contribute = true;
        this._contributeData=[from, data]
    }
    _renderScenes() {
        var routes = this.props.routes;
        return routes.map((route, i) => {
            let isCurrent = i === this.props.index;
            return (
                <Card
                    {...this.props}
                    route={route}
                    ref={(v) => this._cacheCurrent(isCurrent, v)}
                    isCurrent={isCurrent}
                    onContribute={this._onContribute}
                    key={`card_${route.key}`} />
            );
        })

    }
    render() {
        return (
            <div
                style={styles.cardstack}>
                {this._renderScenes()}
            </div>
        )
    }
}

const styles = {
    cardstack: {
        height: '100%',
        width: '100%',
        position: 'relative'
    }
}
export default CardStack;