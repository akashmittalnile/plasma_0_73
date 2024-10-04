//react components
import React from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {Mycolors} from '../utility/Mycolors';
import { FONTFAMILY } from '../utility/fonts';

const TextInputArea2 = ({
  value,
  setValue,
  textInputTitle,
  textInputBottomText,
  placeholder,
  placeholderTextColor,
  TextInputBorder,
  TextInputWidth,
  BorderColor,
  linkText,
  required,
  linkButtonPress = () => {},
  anotherLinkButtonPress = () => {},
  keyboardType = 'default',
  maxLength = 10000,
  onSubmitEditing,
  myTextInputRef,
  AnotherLinkText,
  icon = false,
  img,
  isSecure,
  multiline = false,
  textInputHeight = 50,
  hasViewBorder = false,
  TextInputwidth1
}) => {
  //UI
  return (
    <View
      style={{
        ...styles.textAreaView,
        borderWidth: hasViewBorder ? 1.5 : 0,
        width: TextInputWidth ? TextInputWidth : '100%',
        borderColor: BorderColor
          ? BorderColor
          : Mycolors.TEXT_BORDER_LIGHt_PURPLE,
        zIndex: -999,
        flexDirection: 'row',
         
      }}>
       
      <TextInput
        value={value}
        multiline={multiline}
        ref={myTextInputRef}
        onChangeText={text => setValue(text)}
        maxLength={maxLength}
        onSubmitEditing={onSubmitEditing}
        allowFontScaling={false}
        keyboardType={keyboardType}
        secureTextEntry={isSecure ? true : false}
        style={{
          ...styles.TextInput,
          height: textInputHeight,
          color: '#4F5168',
          borderWidth: TextInputBorder ? 0.5 : null,
          width: TextInputwidth1 ? TextInputwidth1 : '90%' , fontFamily:FONTFAMILY
        }}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
      />
      {icon ? (
        <Image
          source={img}
          style={{
            height: 26,
            width: 26,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginRight: 10,
          }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  textAreaView: {
    marginVertical: 5,
    borderColor: Mycolors.TEXT_BORDER_LIGHt_PURPLE,
    borderRadius: 10,
    margin: 2,
    padding: 5,
  },
  TextInputTitleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  TextInputTitle: {},
  anotherlinkTitle: {
    fontSize: 12,
    color: Mycolors.TEXT_BORDER_LIGHt_PURPLE,
    textDecorationLine: 'underline',
    textAlign: 'right',
    marginBottom: 5,
  },
  linkTitle: {
    fontSize: 12,
    color: Mycolors.TEXT_BORDER_LIGHt_PURPLE,
    textDecorationLine: 'underline',
  },
  TextInput: {
    backgroundColor: Mycolors.BG_COLOR,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  textInputBottomText: {
    fontSize: 12,
    color:Mycolors.BG_COLOR
  },
});

export default TextInputArea2;
