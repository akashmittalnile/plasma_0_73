import React from 'react'
import { View,Keyboard, Text,TextInput,StyleSheet,TouchableOpacity,Image } from 'react-native'
import { Mycolors } from '../utility/Mycolors';
import { FONTFAMILY } from '../utility/fonts';


const AuthHeader = (props) => {
    return (
        <View 
        style={{
            height:props.height ? props.height :'auto',
            width:'100%',
            padding: props.padding ? props.padding :'auto',
            paddingVertical:props.paddingVertical ? props.paddingVertical : 'auto',
            paddingHorizontal:props.paddingHorizontal ? props.paddingHorizontal :'auto',
            backgroundColor:props.backgroundColor ? props.backgroundColor : 'transparent',
            flexDirection:"row",
            justifyContent:'space-between',
            alignItems:"center",
        }}
        >
   {props.press1 ?  
<TouchableOpacity style={{
    width:props.img1width ? props.img1width : 'auto',
    height:props.img1height ? props.img1height : 'auto',
    justifyContent:'center',backgroundColor:'transparent',padding:3,borderRadius:50,
    }} onPress={props.press1}>
{props.img1 ?
 <Image source={props.img1} style={{width:'45%',height:'25%',alignSelf:'center',tintColor:'#fff'}}></Image>
: null }
</TouchableOpacity>
: null
}
<View style={{justifyContent:'center',alignItems:'center'}}>
<Text style={{fontFamily:FONTFAMILY, fontSize: 16, fontWeight: '600',color:'#fff', fontFamily:FONTFAMILY}}>{props.Text1}</Text>
</View>

 



<View style={{flexDirection:'row'}}>
 {props.press3 ?  
<TouchableOpacity style={{
    width:props.img3width ? props.img3width : 'auto',
    height:props.img3height ? props.img3height : 'auto',
    justifyContent:'center',marginHorizontal:5,backgroundColor:Mycolors.LogininputBox,padding:3,borderRadius:50,
    borderColor:props.borderColor ? props.borderColor : 'transparent',
    borderWidth:1
    }} onPress={props.press3}>
{props.img3 ?
 <Image source={props.img3} style={{width:'60%',height:'60%',alignSelf:'center'}}></Image>
: null }
</TouchableOpacity>
: null
}
{props.press4 ?  
<TouchableOpacity style={{
    width:props.img4width ? props.img4width : 'auto',
    height:props.img4height ? props.img4height : 'auto',
    justifyContent:'center',marginHorizontal:5,backgroundColor:Mycolors.LogininputBox,padding:3,borderRadius:50,
    }} onPress={props.press4}>
{props.img4 ?
 <Image source={props.img4} style={{width:'100%',height:'100%',alignSelf:'center',borderRadius:50,}}></Image>
: null }
</TouchableOpacity>
: null
}
</View>

           
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: Mycolors.BG_COLOR
    },
    input: {
        paddingLeft: 15,
        paddingRight: 15,
        height: 40,
        width:'100%',
        fontSize: 13,
        // borderColor: Mycolors.GrayColor,
        // borderWidth:1,
        backgroundColor: Mycolors.LogininputBox,
        borderRadius:15,
        color:Mycolors.TEXT_COLOR,
      //   textAlignVertical: 'top',
      },
  });
export default AuthHeader;


