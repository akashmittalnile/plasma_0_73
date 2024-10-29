import { View, Text, Image } from 'react-native'
import React from 'react'
import { FONTFAMILY, FONTFAMILYSEMIBOLD } from '../utility/fonts'

export const NoDataFoundModule = ({ msg='No Data Found', styles={}, imgStyle={}, marginBottom=120,textColor="white"}) => {
    return (
        <View style={[{ backgroundColor: 'transparent', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }, styles]}>
            <Image style={imgStyle} source={require('../assets/no_data.png')} />
            <Text style={{fontFamily:FONTFAMILYSEMIBOLD, color: textColor, fontSize: 20, marginBottom: marginBottom, marginTop: 20, fontFamily:FONTFAMILYSEMIBOLD }}>
                {msg}
            </Text>
        </View>
    )
}


const NoDataFound = ({ msg='No Data Found', styles={}, imgStyle={}}) => {
    return (
        <View style={[{ width: '100%', height: '100%', backgroundColor: 'transparent', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }, styles]}>
            <Image source={require('../assets/no_data.png')} />
            <Text style={{fontFamily:FONTFAMILYSEMIBOLD, color: 'white', fontSize: 20, marginBottom: 120, marginTop: 20, fontFamily:FONTFAMILYSEMIBOLD }}>
                {msg}
            </Text>
        </View>
    )
}

export default NoDataFound