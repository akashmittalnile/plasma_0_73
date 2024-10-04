import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Modal, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { FONTFAMILY } from '../../utility/fonts';


const CouponPicker = ({ showPicker = true, arr = [], handleClose = () => { }, handleSubmit = () => { }, title = "Select a Value", couponDescKey = '', discAmountKey = '', couponCodeKey = '', couponCodeApplied = (item,index)=>{}, removeCoupon=()=>{} }) => {

    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemPress = (item, index) => {
        handleSubmit(item, index);

        handleClose();
        // setSelectedItem(index);
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity onPress={() => { handleItemPress(item, index) }} style={{
            width: '95%', backgroundColor: "#fff", alignSelf: "center", borderRadius: 8, padding: 20, marginTop: 20, flexDirection: "row", justifyContent: "space-between", alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
        }}>
            {couponCodeApplied(item,index) &&
                <TouchableOpacity onPress={() => {
                    removeCoupon(item, index)
                    handleClose();
                }} style={{
                    position: 'absolute', right: -5, top: -9, padding: 2, backgroundColor: 'white', borderRadius: 50, shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                }}>
                    <Image style={{ width: 20, height: 20, }} tintColor={"#A13BB6"} source={require('../../assets/crossed.png')}></Image>
                </TouchableOpacity>}
            <View style={{ flexDirection: 'row' }}>
                <Image style={{ width: 20, height: 20, alignSelf: "center", }} tintColor={"#A13BB6"} source={require('../../assets/ic_coupon.png')}></Image>
                <View style={{ flexDirection: 'column', marginLeft: 15 }}>
                    <Text style={[styles.textStyle, { fontSize: 13.5 }]}>{String(item[couponDescKey]).length >= 30 ? String(item[couponDescKey]).slice(0, 35) + '...' : String(item[couponDescKey])}</Text>
                    <Text style={[styles.textStyle, { color: '#1DA24A', fontSize: 12 }]}>Discount Amount: $ {item[discAmountKey]},</Text>
                </View>
            </View>
            <TouchableOpacity style={[{ flexDirection: 'column', borderStyle: 'dashed', }, { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', }]}>
                <Text style={[styles.textStyle, { color: '#B357C3', fontSize: 12 }]}>{item[couponCodeKey]}</Text>
            </TouchableOpacity>
            {/* <View style={[{ height: 1, overflow: 'hidden' }]}>
                <View style={[{ height: 2, borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed' }]}>
                <Text style={styles.textStyle}>{"July30"}</Text>
                </View>
              </View> */}

        </TouchableOpacity>

    );

    return (
        <Modal
            visible={showPicker}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <TouchableOpacity style={styles.modalOverlay} onPress={handleClose} />
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    {/* <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Image source={require('../images/cancelSimple.png')} style={styles.closeIcon} />
            </TouchableOpacity> */}
                </View>
                <View style={styles.separator} />
                <FlatList
                    data={arr}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()} // Use index as a fallback key extractor
                />
                <View style={styles.modalFooter} />
            </View>
            {/* </TouchableOpacity> */}
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        // flexDirection: 'row',
    },
    modalContainer: {
        alignSelf: 'center',
        width: '95%',
        height: '50%',
        // backgroundColor: 'white',
        backgroundColor: '#FEFEFE',
        borderRadius: 10,
        position: 'absolute',
        top: '25%'
    },
    modalHeader: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        justifyContent: 'center',
        padding: 16, fontFamily:FONTFAMILY

    },
    modalTitle: {

        fontSize: 17,
       fontFamily:FONTFAMILY
    },
    closeButton: {
        height: 53,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: {
        height: 17,
        width: 17,
        resizeMode: 'contain',
        marginLeft: 35,
    },
    separator: {
        backgroundColor: 'gray',
        height: 1,
        width: '100%',
    },
    scrollView: {
        width: '100%',
        flex: 1, // Allow the scrollview to take up remaining space
    },
    pickerItem: {
        justifyContent: 'space-between',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 15,
    },
    pickerItemText: {

        fontSize: 14,
        color: 'rgba(128,128,128,1.0)',
    },
    selectedItemIndicator: {
        width: 14,
        height: 14,
        backgroundColor: '#5683AF',
        borderRadius: 10,
        marginRight: 30,
    },
    modalFooter: {
        height: 30, // Adjust as needed for any additional content below the picker
    },
    textStyle: { fontSize: 14, color: "#000", fontWeight: "400", fontFamily:FONTFAMILY }
});

export default CouponPicker;