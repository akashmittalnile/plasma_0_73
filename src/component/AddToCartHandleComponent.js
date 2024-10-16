import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Rating } from 'react-native-ratings';
import { dimensions, Mycolors } from '../utility/Mycolors';
import useAPI from '../utility/hooks/useAPI';
import { submit_rating } from '../WebApi/Service';
import Modal from 'react-native-modal';
import MyButtons from './MyButtons';
import Loader from '../WebApi/Loader';
import { useNavigation } from '@react-navigation/native';
import { FONTFAMILY } from '../utility/fonts';
import Toast from 'react-native-simple-toast';

function AddToCartHandleComponent({ id = null, type = null, in_cart = false, callback = () => { }, addRemoveButton = false, buyBtn = false, children, style = {}, startLoader = () => { }, stopLoader = () => { } }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('')
    const { postAPI, emptyCart } = useAPI()
    const navigation = useNavigation()

    const handleOpenModal = () => setIsModalVisible(true);
    const handleCloseModal = () => setIsModalVisible(false);

    async function toggleAddRemoveCart({ in_cart = false, type = null, id = null }) {
        startLoader()
        const res = await postAPI({
            endPoint: in_cart ? 'remove-cart' : 'add-cart', bodyJSON: {
                id: id,
                type: type
            },
            catchErrorCallBack: (resp) => {
                console.log("catchErrorCallBack", resp);
                if (!resp?.cart_related) {
                    Toast.show(resp?.message)
                    // return
                }
                setIsModalVisible(true)

                setModalMsg(resp?.message)
                setIsModalVisible(true)
            }, toastEnable: false
        })
        stopLoader()
        callback()

        console.log("toggleAddRemoveCart", res);

    }

    async function handleAddRemove() {
        console.log("handleAddRemove", { in_cart, id, type });
        await toggleAddRemoveCart({ in_cart, id, type })
    }

    async function handleBuy() {
        console.log("in_cartsss", { in_cart });
        if (in_cart) {
            navigation.navigate('ProductCart', { data: { id }, })
            return
        } else {
            // else
            //     await toggleAddRemoveCart({ in_cart, id, type })
            // navigation.navigate('ProductDetails', { data: { id }, })


            startLoader()
            const res = await postAPI({
                endPoint: in_cart ? 'remove-cart' : 'add-cart', bodyJSON: {
                    id: id,
                    type: type
                },
                catchErrorCallBack: (resp) => {
                    console.log("catchErrorCallBack", resp);
                    if (!resp?.cart_related) {
                        Toast.show(resp?.message)
                        // return
                    }
                    setModalMsg(resp?.message)
                    setIsModalVisible(true)
                }, toastEnable: false
            })
            stopLoader()
            callback()
            if (res) {
                navigation.navigate('ProductCart', { data: { id }, })
            }

        }
        console.log("handleBuy", res);
    }



    // useImperativeHandle(ref, () => ({
    //     openModal: handleOpenModal,
    //     closeModal: handleCloseModal,
    //     handleAddRemove,
    //     handleBuy
    // }));

    const addBtnTitle = type == 2 ? "Clear Cart and Add This Product" : 'Clear Cart and Add This Course'

    return (
        <>


            <TouchableOpacity pointerEvents="box-none" onPressIn={() => console.log("Ff")} style={style} onPress={async () => {


                if (addRemoveButton) {

                    await handleAddRemove()
                }
                if (buyBtn) {

                    await handleBuy()
                }
                // setIsModalVisible(true)

                // stopLoader()
            }}>
                {children}
            </TouchableOpacity>





            {isModalVisible && <Modal
                animationIn={'fadeIn'}
                isVisible={isModalVisible}
                // swipeDirection="down"
                onSwipeComplete={e => {
                    handleCloseModal()
                }}
                coverScreen={true}
                backdropColor="transparent"
                style={{
                    flex: 1,
                    // justifyContent: 'center',
                    margin: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                {/* {loading && <Loader />} */}
                <View
                    style={{
                        height: '50%',
                        backgroundColor: Mycolors.BG_COLOR,
                        borderRadius: 10,
                        padding: 20,
                        margin: 0,
                        bottom: 0,
                        position: 'absolute',
                        width: '100%',
                        // justifyContent: 'center'
                        // marginHorizontal: 20,
                    }}>
                    {/* <KeyboardAwareScrollView s showsVerticalScrollIndicator={false}> */}

                    <View style={{ width: '100%', height: '100%', justifyContent: 'space-evenly' }}>
                        <View
                            style={{ justifyContent: 'center', alignSelf: 'center' }}>
                            <Image
                                source={require('../assets/no_data.png')}

                                style={{
                                    width: 150,
                                    height: 100,
                                    alignSelf: 'center',
                                    borderRadius: 5,
                                    resizeMode: 'stretch',
                                }} />

                        </View>
                        <Text style={{ fontFamily: FONTFAMILY, textAlign: 'center', marginTop: 8, color: '#B357C3', fontWeight: '500', fontSize: 25, marginBottom: 10, fontFamily: FONTFAMILY }}>Message</Text>
                        <Text style={{ fontFamily: FONTFAMILY, textAlign: 'center', marginTop: 8, color: '#000', fontWeight: '400', fontSize: 15, lineHeight: 18, fontFamily: FONTFAMILY }}>{modalMsg}</Text>

                        {/* <View style={{height: 20}} /> */}
                        <MyButtons
                            title={addBtnTitle}
                            height={45}
                            width={'100%'}
                            borderRadius={5}
                            fontWeight={'600'}
                            alignSelf="center"
                            press={async () => {
                                // SetModleShippingAddress(false);
                                // props.navigation.navigate("MyorderStack")
                                // approveBtn()
                                // console.log("Approve clicked");
                                if (addRemoveButton) {
                                    setIsModalVisible(false)
                                    await emptyCart({ callback: handleAddRemove })
                                    // await emptyCart()
                                    // // await handleAddRemove() 
                                }
                                if (buyBtn) {
                                    setIsModalVisible(false)
                                    await emptyCart({ callback: handleBuy })
                                }

                                //    await handleAddRemove()
                            }}
                            marginHorizontal={20}
                            titlecolor={Mycolors.BG_COLOR}
                            backgroundColor={Mycolors.Purple}
                            marginVertical={10}
                        />
                        <MyButtons
                            title="Cancel"
                            height={45}
                            width={'100%'}
                            borderRadius={5}
                            fontWeight={'600'}
                            alignSelf="center"
                            press={() => {
                                // SetModleShippingAddress(false);
                                // props.navigation.navigate("MyorderStack")
                                handleCloseModal()
                                callback()
                            }}
                            marginHorizontal={20}
                            titlecolor={Mycolors.BG_COLOR}
                            backgroundColor={Mycolors.Purple}
                            marginVertical={10}
                        />
                    </View>
                    {/* </KeyboardAwareScrollView> */}
                </View>
            </Modal>}
            {/* </View> */}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(200, 200, 200, 0.5)',
        paddingHorizontal: 10
        // margin: 20,
        // borderRadius: 10,
    },
    modalHeader: {
        fontSize: 25,
        fontWeight: '500',
        // marginBottom: 30,
    },
    modalText: {
        fontSize: 15.5,
        // marginBottom: 15,
        width: '100%',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    rating: {
        marginBottom: 20,
    },
    reviewInput: {
        padding: 20,
        borderWidth: 1,
        borderColor: Mycolors.TEXT_BORDER_LIGHt_PURPLE,
        borderRadius: 5,
        // marginBottom: 15,
        width: '100%',
        minHeight: 100, // Set a minimum height for multiline input
    },
    submitButton: {
        backgroundColor: '#B357C3',
        width: dimensions.SCREEN_WIDTH - 40,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
});

export default AddToCartHandleComponent;
