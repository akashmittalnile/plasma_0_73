import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Modal, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { dimensions } from '../utility/Mycolors';
import NoDataFound, { NoDataFoundModule } from './NoDataFound';
import { FONTFAMILY, FONTFAMILYBOLD, FONTFAMILYSEMIBOLD } from '../utility/fonts';


const CustomPicker = ({ showPicker = false, arr = [], handleClose = () => { }, handleSubmit = (item, index) => { }, title = "Select a Value", getValue = (item, index) => item }) => {

    const [selectedItem, setSelectedItem] = useState(null);
    // arr = arr?.slice(0, 3)

    const handleItemPress = (item, index) => {
        handleSubmit(item, index);
        handleClose();
        setSelectedItem(index);
    };

    // const array = arr?.slice(0,3)

    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            key={index}
            style={styles.pickerItem}
            onPress={() => handleItemPress(item, index)}
        >
            <Text style={styles.pickerItemText}>{getValue(item, index)}</Text>
            {/* {selectedItem == index && (
                <View style={styles.selectedItemIndicator} />
            )} */}
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={showPicker}
            transparent={true}
            animationType="slide"
            onRequestClose={handleClose}

        >
            <View style={{ justifyContent: 'center', width: '100%', height: '100%' }}>
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
                        ListEmptyComponent={<View style={{ marginTop: 10 }}><NoDataFoundModule textColor='black' marginBottom={0} /></View>}
                    />
                    <View style={styles.modalFooter} />
                </View>
                <TouchableOpacity style={styles.modalOverlay} onPress={handleClose}>

                </TouchableOpacity>
            </View>
            {/* </TouchableOpacity> */}
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    modalContainer: {
        alignSelf: 'flex-end',
        width: '100%',
        // height: '50%',
        maxHeight: '50%',
        backgroundColor: 'white',
        borderRadius: 10,
        zIndex: 2
        // position: 'absolute',

        // transform: [{ translateX: -50 }],

        // bottom: 0
    },
    modalHeader: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        justifyContent: 'center',
        padding: 16,
    },
    modalTitle: {
        fontFamily: FONTFAMILYBOLD,
        fontSize: 17,
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
        color: 'rgba(128,128,128,1.0)', fontFamily: FONTFAMILYSEMIBOLD
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
});

export default CustomPicker;