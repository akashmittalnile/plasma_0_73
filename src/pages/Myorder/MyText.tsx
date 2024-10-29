//react components
import React from 'react';
import { StyleSheet, Text } from 'react-native';
//global
// import {  Fonts } from 'global/Index';
import * as Colors from './Colors'
import { FONTFAMILY, FONTFAMILYSEMIBOLD } from '../../utility/fonts';

//props
interface Props {
  text: String;
  fontSize: number;
  style: Object;
  fontFamily:
  | 'black'
  | 'bold'
  | 'extraBold'
  | 'extraLight'
  | 'light'
  | 'medium'
  | 'regular'
  | 'semiBold'
  | 'thin'
  textColor:
  | 'black'
  | 'white'
  | 'theme_green'
  | 'theme_orange'
  | 'dark_grey'
  | 'lite_green'
  | 'theme_blue'
  | 'lite_blue'
  | 'bg_green'
  | 'red'
  | 'lite_grey'
  | 'header_yellow';
  textAlign: 'auto' | 'center' | 'justify' | 'left' | 'right';
  isUnderLine: true | false;
  numberOfLines: number;
  marginHorizontal: number;
  marginVertical: number;
  marginTop: number;
  marginRight: number;
  marginLeft: number;
  marginBottom: number;
  width: number;
  lineHeight: number;
  letterSpacing: number;
}

const MyText: React.FC<Props> = ({
  text,
  textColor = 'black',
  fontFamily = 'regular',
  fontSize = 14,
  textAlign = 'auto',
  style = {},
  isUnderLine = false,
  numberOfLines,
  marginHorizontal,
  marginVertical,
  marginTop,
  marginRight,
  marginLeft,
  marginBottom,
  width,
  lineHeight,
  letterSpacing,
}) => {
  const getFontFamily = (): string => {
    const propsFontFamilies: string[] = [
      'black',
      'bold',
      'extraBold',
      'extraLight',
      'light',
      'medium',
      'regular',
      'semiBold',
      'thin',
    ];
    const fontFamilies: string[] = Object.values(Fonts);
    const index: number = propsFontFamilies.findIndex(
      item => item === fontFamily,
    );
    // console.log('text index', text, index);
    // console.log('text', text);
    // console.log('text fontFamilies[index]', fontFamilies[index]);
    if (index > -1) return fontFamilies[index];
    return fontFamily;
  };
  const getFontColor = () => {
    const keys: string[] = Object.keys(Colors).map(item => item?.toLowerCase());
    const values: string[] = Object.values(Colors).map((item: any) =>
      item?.toLowerCase(),
    );
    const idx: number = keys.findIndex(item => item === textColor);
    if (idx > 1) return values[idx];
    return textColor;
  };
  const styles = StyleSheet.create({
    textStyle: {
      color: getFontColor(),
      fontSize: fontSize,
      textAlign: textAlign,
      // fontFamily: getFontFamily(),
      textDecorationStyle: 'solid',
      textDecorationLine: isUnderLine ? 'underline' : 'none',
      marginHorizontal: marginHorizontal,
      marginVertical: marginVertical,
      marginTop: marginTop,
      marginRight: marginRight,
      marginLeft: marginLeft,
      marginBottom: marginBottom,
      width: width,
      lineHeight: lineHeight,
      letterSpacing: letterSpacing,
      fontFamily: FONTFAMILYSEMIBOLD
    },
  });
  //UI
  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      allowFontScaling={false}
      style={[styles.textStyle, style]}>
      {text}
    </Text>
  );
};
export default MyText;
