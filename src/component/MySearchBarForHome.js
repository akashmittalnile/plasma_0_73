import React, { useEffect, useState, useRef, memo } from 'react';
import { View, Keyboard, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Mycolors } from '../utility/Mycolors';
import { FONTFAMILY } from '../utility/fonts';


const MySearchBarForHome = ({ placeHolder = '', onSearchSubmit = (text) => { console.log(text) }, disabled = false, isfilter = false, onFilterPress = () => { }, searchVal=null, setSearchVal=()=>{}, textInputStyle={} }) => {
  const [searchValue, setsearchValue] = useState('')

  return (
    <View pointerEvents={disabled ? 'none' : 'auto'} style={{ flexDirection: "row", 
    //  alignSelf: "center",
      marginTop: 15, alignItems: 'center', width: '100%', gap: 5, display: 'flex', justifyContent: 'space-between', marginBottom: 15}}>
      <TextInput
        editable={!disabled}
        style={[{
          height: 50,
          width: '82%',
          // alignSelf: "center",
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "#542B8C",
          // left: 7,
          paddingHorizontal: 15,
          color: '#fff',
          fontFamily: FONTFAMILY
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
      <View disabled={disabled} onPress={() => {
        isfilter ? onFilterPress() : onSearchSubmit(searchValue)
      }} style={{ height: 55, width: 55, backgroundColor: '#B357C3', justifyContent: 'center', alignItems: 'center', borderRadius: 5,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.10,
        shadowRadius: 4.65,
        
        elevation: 13,

       }}>
        
          <Image style={{ height: 25, width: 25,  }} source={require("../assets/searchIcon.png")}></Image>
        
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
export default memo(MySearchBarForHome);


