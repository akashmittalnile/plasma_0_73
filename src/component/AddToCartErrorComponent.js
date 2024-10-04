import React from 'react'
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MyButtons from './MyButtons';
import { SafeAreaView, LogBox, StatusBar, BackHandler, useColorScheme, View, Image, Text, } from 'react-native';
import { Mycolors } from '../utility/Mycolors';
import { FONTFAMILY } from '../utility/fonts';

function AddToCartErrorComponent({ isAddToCartErrorComponent = false,
    setIsAddToCartErrorComponent = () => { }, msg = `You can't add to cart a course now. Only one type of items allow either course or product.`, approveBtn = () => { }, cancelBtn = () => { } }) {
    return (
        <Modal
        animationIn={'fadeIn'}
            isVisible={isAddToCartErrorComponent}
            // swipeDirection="down"
            onSwipeComplete={e => {
                setIsAddToCartErrorComponent(false);
            }}
            coverScreen={true}
            backdropColor="transparent"
            style={{
                flex: 1,
                // justifyContent: 'center',
                margin: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
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
                    <View style={{width: '100%', height: '100%',  justifyContent :'space-evenly'}}>
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
                        <Text style={{fontFamily:FONTFAMILY, textAlign: 'center', marginTop: 8, color: '#B357C3', fontWeight: '500', fontSize: 25, marginBottom: 10, fontFamily:FONTFAMILY }}>Message</Text>
                        <Text style={{fontFamily:FONTFAMILY, textAlign: 'center', marginTop: 8, color: '#000', fontWeight: '400', fontSize: 15, lineHeight: 18, fontFamily:FONTFAMILY }}>{msg}</Text>

                        {/* <View style={{height: 20}} /> */}
                        <MyButtons
                            title="Clear Cart and Add This Product"
                            height={45}
                            width={'100%'}
                            borderRadius={5}
                            fontWeight={'600'}
                            alignSelf="center"
                            press={() => {
                                // SetModleShippingAddress(false);
                                // props.navigation.navigate("MyorderStack")
                                approveBtn()
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
                                cancelBtn()
                            }}
                            marginHorizontal={20}
                            titlecolor={Mycolors.BG_COLOR}
                            backgroundColor={Mycolors.Purple}
                            marginVertical={10}
                        />
                    </View>
                {/* </KeyboardAwareScrollView> */}
            </View>
        </Modal>
    )
}

export default AddToCartErrorComponent