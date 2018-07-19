import React from 'react';

function FeedbackButton(props){
    let {
        onPress
    } = props;
    return (
        <p
            onClick={onPress}
            style={{
                position:'absolute',
                bottom:'1.5rem',
                right:'0.5rem'
            }}>
            <img 
                style={{
                    height:'2.5rem',
                    width:'2.5rem'
                }}
                src="images/index/feedback.png" alt=""/>
        </p>
    );
}

export default FeedbackButton;