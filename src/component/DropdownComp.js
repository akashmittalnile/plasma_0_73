///*****************************************/////////
///*****************************************/////////
// ----- Upgraded By Aditya Gupta ----- /////////////
///////////// Nile Technologies PVT Ltd./////////////
///*****************************************/////////
///*****************************************/////////


//react components
import React, { memo, useState } from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import { Mycolors } from '../utility/Mycolors';
import CustomPicker from './CustomPicker';
import { FONTFAMILY, FONTFAMILYSEMIBOLD } from '../utility/fonts';

const DropdownComp = ({
    placeholder,
    placeholderTextColor,
    TextInputBorder,
    TextInputWidth,
    BorderColor,
    textInputHeight = 50,
    hasViewBorder = false,
    TextInputwidth,
    value = '',
    onSelect = (item, index) => { },
    renderListValues=(item, index) => item,
    items=[],
    marginBottom= 10
}) => {

    const [openCustomPicker, setopenCustomPicker] = useState(false)

    //UI
    return (<>
        <TouchableOpacity
            style={{
                ...styles.textAreaView,
                borderWidth: hasViewBorder ? 1 : 0,
                width: TextInputWidth ? TextInputWidth : '100%',
                borderColor: BorderColor
                    ? BorderColor
                    : Mycolors.TEXT_BORDER_LIGHt_PURPLE,
                flexDirection: 'row',
                zIndex: 555,
                height: textInputHeight
                ,marginBottom
            }}
            onPress={() => {
                console.log("Ddd");
                setopenCustomPicker(true)
            }}
        >


            <Text

                style={{
                    ...styles.TextInput,
                    // height: textInputHeight,
                    color: '#4F5168',
                    borderWidth: TextInputBorder ? 0.5 : null,
                    width: TextInputwidth ? TextInputwidth : '90%',
                    zIndex: -999999, fontFamily:value ? FONTFAMILYSEMIBOLD : FONTFAMILY
                }}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
            > {value ? value : placeholder}</Text>

            <Image source={require("../assets/arrow-down-black.png")} style={{ width: 20, height: 20 }} />

        </TouchableOpacity>
        <CustomPicker showPicker={openCustomPicker} handleClose={() => setopenCustomPicker(false)}
            handleSubmit={onSelect}
            getValue={renderListValues}
            arr={items}
            title={placeholder}
        />
    </>
    );
};

const styles = StyleSheet.create({
    textAreaView: {
        marginVertical: 5,
        borderColor: Mycolors.TEXT_BORDER_LIGHt_PURPLE,
        borderRadius: 10,
        margin: 2,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'space-between'
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
        color: Mycolors.BG_COLOR
    },
});

export default memo(DropdownComp);
