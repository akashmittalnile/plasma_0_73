/* eslint-disable prettier/prettier */
import { View, StyleSheet } from "react-native"
import React from "react"
import {
    responsiveHeight,
    responsiveWidth
} from "react-native-responsive-dimensions"


const Wrapper = ({ children, containerStyle }) => {
    return <View style={[styles.container, containerStyle]}>{children}</View>
}

export default Wrapper

const styles = StyleSheet.create({
    container: {
        // paddingBottom: responsiveHeight(3),
        paddingTop: responsiveHeight(3),
        width: responsiveWidth(90),
        backgroundColor: "white",
        alignItems: "center",
        borderRadius: responsiveWidth(7),
        // elevation: 2,
        shadowColor: 'pink'
    }
})
