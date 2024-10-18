import React from 'react'
import { View, Keyboard, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Mycolors } from '../utility/Mycolors';
import { useNavigation } from '@react-navigation/native';
import { FONTFAMILY, FONTFAMILYSEMIBOLD } from '../utility/fonts';
import { sliceTitle } from '../utility/MyFunctions';


const HomeHeader2 = ({
  height,
  paddingHorizontal,
  title,
  press1 = () => { },
  img1height,
  img1width,
  img1,
  press2 = () => { },
  img2height,
  img2width,
  img2,
  press3 = () => { },
  img3height,
  img3width,
  img3
}) => {

  const navigation = useNavigation()

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", width: '95%', alignSelf: "center", height: height, paddingHorizontal: paddingHorizontal }}>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          // onPress={press1}
          onPress={() => {
            navigation?.goBack()
          }}
        >
          {/* <Image style={{ height: img1height, width: img1width, }} source={img1}></Image> */}


          <Image style={{ height: 25, width: 25, }} source={require('../assets/arrow_right_black.png')}></Image>
        </TouchableOpacity>

      </View>
      <View style={{ justifyContent: "center", alignItems: 'center' }}>
        <Text style={{  fontSize: 20, color: "#fff", left: -12, fontFamily: FONTFAMILYSEMIBOLD }}>{sliceTitle(title, 32)}</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* <TouchableOpacity onPress={press2} >
            <Image style={{ height: img2height, width: img2width, marginRight: 10 }} source={img2}></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={press3}>
            <Image style={{ height: img3height, width:img3width , tintColor: "#fff" }} source={img3}></Image>
          </TouchableOpacity> */}
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
    width: '100%',
    fontSize: 13,
    // borderColor: Mycolors.GrayColor,
    // borderWidth:1,
    backgroundColor: Mycolors.LogininputBox,
    borderRadius: 15,
    color: Mycolors.TEXT_COLOR,
    //   textAlignVertical: 'top',
  },
});
export default HomeHeader2;


