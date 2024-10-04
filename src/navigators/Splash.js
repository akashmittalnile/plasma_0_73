import React, { Component } from 'react';
import {View,Image,Text, ImageBackground,StyleSheet,Animated,Easing,SafeAreaView, Alert,Dimensions} from 'react-native';
import { dimensions, Mycolors } from '../utility/Mycolors';

const Splash = (props) => {

     return(
    <View style={styles.container}>
     <ImageBackground style={{width:dimensions.SCREEN_WIDTH,height:dimensions.SCREEN_HEIGHT,}} source={require('../assets/splash.png')}>

     </ImageBackground>
    </View>
        
     );
  }
const styles = StyleSheet.create({

  container: {
    backgroundColor:Mycolors.SP_BG,
    flex:1,
    justifyContent:'center',
  },
  
});
export default Splash