import React, { Component } from 'react';
const SCREEN_REF = 'SCREEN_REF';
class Card extends Component {
    constructor(...props) {
        super(...props);
    }
    componentWillUnmount() {
        var { route} = this.props;
        if (this.refs[SCREEN_REF] &&
            this.refs[SCREEN_REF].contribute) {
            this.props.onContribute &&
                this.props.onContribute(route.routeName,this.refs[SCREEN_REF].contribute())
        }
    }
    receive(from,data) {
        if (this.refs[SCREEN_REF] &&
            this.refs[SCREEN_REF].receive) {
            this.refs[SCREEN_REF].receive(from,data)
        }
    }
    render() {
        var { route, router, navigation } = this.props;
        var Screen = router.getComponentForRouteName(route.routeName);
        return (
            <Screen
                ref={SCREEN_REF}
                isCurrent={this.props.isCurrent}
                navigation={{...navigation,state:route}} />
        );
    }
}
export default Card;