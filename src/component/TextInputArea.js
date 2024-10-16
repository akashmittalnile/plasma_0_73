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
import { Mycolors } from '../utility/Mycolors';
import { FONTFAMILY } from '../utility/fonts';

const TextInputArea = ({
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
  linkButtonPress = () => { },
  anotherLinkButtonPress = () => { },
  keyboardType = 'default',
  maxLength = 10000,
  onSubmitEditing,
  myTextInputRef,
  AnotherLinkText,
  icon = false,
  img,
  isSecure,
  multiline = false,
  textInputHeight = 40,
  hasViewBorder = true,
  SendOtp = false,
  sendotpButtonPress = () => { },
  TextInputwidth,
  secondIcon = null,
  secondIconPress = () => { },
  marginBottom= 10
}) => {
  //UI
  return (
    <View
      style={{
        ...styles.textAreaView,
        borderWidth: hasViewBorder ? 1 : 0,
        width: TextInputWidth ? TextInputWidth : '100%',
        borderColor: BorderColor
          ? BorderColor
          : Mycolors.TEXT_BORDER_LIGHt_PURPLE,
        zIndex: -999,
        flexDirection: 'row',
        marginBottom
      }}>
      {/* {textInputTitle ? (
        <View style={styles.TextInputTitleView}>
          <Text style={styles.TextInputTitle}>
            {textInputTitle} {required ? '*' : null}
          </Text>
          <TouchableOpacity onPress={linkButtonPress}>
            <Text style={styles.linkTitle}>{linkText}</Text>
          </TouchableOpacity>
        </View>
      ) : null} */}
      {icon ? (
        <Image
          source={img}
          style={{
            height: 26,
            width: 26,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginLeft: 10,
          }}
        />
      ) : null}
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
          // color: '#4F5168',
          borderWidth: TextInputBorder ? 0.5 : null,
          width: TextInputwidth ? TextInputwidth : '90%', fontFamily:FONTFAMILY,
          color: 'black',
        }}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
      />
      {/* <Text style={{fontFamily:FONTFAMILY,color: 'red'}}>*</Text> */}
      {secondIcon && <TouchableOpacity onPress={() => {
        secondIconPress()
      }} style={[{
        height: 26,
        width: 26,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginLeft: -35,
        tintColor: '#B357C3'
      },]}><Image
          source={secondIcon}
          style={[{
            height: '100%',
            width: '100%',
            resizeMode: 'contain',
            // alignSelf: 'center',
            // marginLeft: -35,
            tintColor: '#B357C3'
          },]}
        />
      </TouchableOpacity>
      }
      {SendOtp ? (
        <TouchableOpacity style={{ backgroundColor: '#B357C3', borderRadius: 5, padding: 8, position: 'absolute', right: 10, top: 7, justifyContent: 'center', alignItems: 'center' }} onPress={sendotpButtonPress}>
          <Text style={styles.textInputBottomText}>Send OTP</Text>
        </TouchableOpacity>
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
    fontSize: 14, fontFamily:FONTFAMILY
    
  },
  textInputBottomText: {
    fontSize: 12,
    color: Mycolors.BG_COLOR, fontFamily:FONTFAMILY
  },
});

export default TextInputArea;
