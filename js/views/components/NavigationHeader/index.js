'use strict'
import React,{Component} from 'react';
import BackButton from './BackButton';
import Button from './Button';
import Title from './Title';
const styles = {
    leftButton:{
        left:'1rem'
    },
    rightButton:{
        right:'1rem',
        textAlign:'right'
    },
    title:{

    }
}
class NavigationHeader extends Component{
    constructor(...props){
        super(...props);
        var {
            header,
            leftButton,
            rightButton,
            onBack,
            title,
            isBackButton
        } = this.props;
        this.state = {
            header,
            leftButton,
            rightButton,
            onBack,
            title,
            isBackButton
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if(document&&this.state.title){
            document.title = this.state.title;
        }
    }
    componentDidMount() {
        if(document&&this.state.title){
            document.title = this.state.title;
        } 
    }
    
    
    update(state){
        this.setState(state);
    }
    _renderTitle(){
        const {title} = this.state;
        if(!title){
            return null
        }
        return <Title  title = {title}/>
    }
    _renderLeftButton(){
        const {leftButton,onBack,isBackButton} = this.state;
        const {navigation} = this.props;
        if(typeof leftButton == 'function'){
            return <Button child = {leftButton(navigation)}/>
        }else{
            if(isBackButton) {
                return null;
            }else {
                return <BackButton navigation = {navigation} onBack = {onBack}/>
            }
        }
    }
    _renderRightButton(){
        const {rightButton} = this.state;
        const {navigation} = this.props
        if(typeof rightButton == 'function'){
            return <Button  style = {styles.rightButton} child = {rightButton(navigation)}/>
        }else{
            return null;
        }
    }
    render(){
        if(this.state.header===null){
            return null;
        }else if(typeof this.state.header == 'function'){
            return this.state.header();
        }
        return <div className='header'>
                {this._renderTitle()}
                {this._renderLeftButton()}
                {this._renderRightButton()}
            </div> 
    }
}
export default NavigationHeader;