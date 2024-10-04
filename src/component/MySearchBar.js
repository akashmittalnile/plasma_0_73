import React, { useEffect, useState, useRef, memo } from 'react';
import { View, Keyboard, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Mycolors } from '../utility/Mycolors';
import { FONTFAMILY } from '../utility/fonts';


const MySearchBar = ({ placeHolder = '', onSearchSubmit = (text) => { console.log(text) }, disabled = false, isfilter = false, onFilterPress = () => { }, searchVal=null, setSearchVal=()=>{}, textInputStyle={} }) => {
  const [searchValue, setsearchValue] = useState('')

  return (
    <View pointerEvents={disabled ? 'none' : 'auto'} style={{ flexDirection: "row", justifyContent: "space-between",
    //  alignSelf: "center",
      marginTop: 10, alignItems: 'center', width: '100%',}}>
      <TextInput
        editable={!disabled}
        style={[{
          height: 50,
          width: '80%',
          // alignSelf: "center",
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "#542B8C",
          left: 7,
          padding: 8,
          color: '#fff', fontFamily:FONTFAMILY
        }, textInputStyle]}
        onChangeText={(e) => {
          setsearchValue(e)
          setSearchVal(e)
        }}
        onSubmitEditing={() => {
          onSearchSubmit(searchValue)
        }}
        value={ searchVal || searchValue}
        // placeholder={placeHolder} // "Search by course, creator or product name"
        placeholder={"Search"} // "Search by course, creator or product name"
        placeholderTextColor={'#713CB8'}
      />
      <TouchableOpacity disabled={disabled} onPress={() => {
        isfilter ? onFilterPress() : onSearchSubmit(searchValue)
      }} style={{ height: 75, width: 70, marginTop: 15 }}>
        {isfilter ? <Image style={{ height: '100%', width: '100%', alignSelf: "center", }} source={require("../assets/filter.png")}></Image>
          :
          <Image style={{ height: '100%', width: '100%', alignSelf: "center", }} source={require("../assets/Vector.png")}></Image>
        }
      </TouchableOpacity>
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
export default memo(MySearchBar);


