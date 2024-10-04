import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { dimensions, Mycolors } from '../utility/Mycolors'
import { FONTFAMILY } from '../utility/fonts'

const MyAlert = (props) => {
    return (
        <View style={{ width: '100%', height: dimensions.SCREEN_HEIGHT, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignSelf: 'center', position: 'absolute' }}>
            <View style={{ alignSelf: 'center', width: '70%', padding: '5%', backgroundColor: Mycolors.BG_COLOR, borderRadius: 15 }}>
                {props.sms2 ?
                    <Text style={{fontFamily:FONTFAMILY, textAlign: 'center', color: Mycolors.TEXT_COLOR, fontSize: 14, fontWeight: 'bold' , fontFamily:FONTFAMILY}}>{props.sms2}</Text>
                    :
                    null
                }
                <Text style={{fontFamily:FONTFAMILY, textAlign: 'center', color: Mycolors.TEXT_COLOR, fontSize: 14, fontWeight: 'bold', fontFamily:FONTFAMILY }}>{props.sms}</Text>

                <View style={{ width: '90%', height: 35, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 20, alignSelf: 'center' }}>
                    {props.canclePress ?
                        <TouchableOpacity style={{ width: '45%', height: '100%', backgroundColor: props.backgroundColor ? props.backgroundColor : 'red', justifyContent: 'center', borderRadius: 10 }}
                            onPress={() => { props.canclePress() }}>
                            <Text style={{fontFamily:FONTFAMILY, textAlign: 'center', color: Mycolors.BG_COLOR, fontFamily:FONTFAMILY }}>{props.btn1name ? props.btn1name : 'Cancel'}</Text>
                        </TouchableOpacity>
                        :
                        null
                    }
                    <TouchableOpacity style={{ width: '45%', height: '100%', backgroundColor: props.backgroundColor ? props.backgroundColor : Mycolors.Purple, justifyContent: 'center', borderRadius: 10 }}
                        onPress={() => { props.okPress() }}>
                        <Text style={{fontFamily:FONTFAMILY, textAlign: 'center', color: Mycolors.BG_COLOR, fontFamily:FONTFAMILY }}>{props.btn2name ? props.btn2name : 'Ok'}</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}
export default MyAlert
