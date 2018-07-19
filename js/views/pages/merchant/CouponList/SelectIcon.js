'use strict'
import React, { Component } from 'react';


function SelectIcon(props){
    let {selected} = props;
    return (
        <p
            style={styles.wrapper}>
            {selected?<i className='check_true'/>:<i className='check_empty'/>}
        </p>
    );
}

const styles = {
   wrapper:{
       position:'absolute',
       bottom:0,
       right:'10px'
   },
   empty:{

   }
}
export default SelectIcon;