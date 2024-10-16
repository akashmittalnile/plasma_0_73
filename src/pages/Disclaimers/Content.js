import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    useColorScheme,
    Alert,
    TextInput,
    Keyboard, FlatList,
    TouchableOpacity, ImageBackground, Modal,
    RefreshControl,
    Pressable,
    Linking
} from 'react-native';
import MyButtons from '../../component/MyButtons';
import MyInputText from '../../component/MyInputText';
import { dimensions, Mycolors } from '../../utility/Mycolors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    saveUserResult,
    onLogoutUser,
    saveUserToken,
} from '../../redux/actions/user_action';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { add_cart, course_details, imgUrl, remove_cart, requestGetApi, requestPostApi } from '../../WebApi/Service';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../WebApi/Loader';
import Toast from 'react-native-simple-toast';
import MyAlert from '../../component/MyAlert';
import LinearGradient from 'react-native-linear-gradient';
// import Modal from 'react-native-modal';
import HomeHeader from '../../component/HomeHeader';
import HomeHeader2 from '../../component/HomeHeader2';
import { WebView } from 'react-native-webview';
import Video from 'react-native-video';
import VideoPlayer from '../../component/VideoPlayer';
import { StrikeThough } from '../../utility/FontStyles';
import ShareComponent, { handleShare } from '../../component/ShareComponent';
import { addToWishlist } from '../../WebApi/GlobalAPICalls';
import NewModal from 'react-native-modal';
import { reloadCourse } from '../../redux/reduxSlices/courseSlice';
import { useIsFocused } from '@react-navigation/native';
import useAPI from '../../utility/hooks/useAPI';
import AddToCartHandleComponent from '../../component/AddToCartHandleComponent';
import { useNavigation } from '@react-navigation/native';
import NoDataFound from '../../component/NoDataFound';
import { FONTFAMILY } from '../../utility/fonts';
import { Pages } from 'react-native-pages';

const Content = ({ navigation, route }) => {

    const data = route?.params?.data
    // const data = {
    //     "step_id": 95,
    //     "title": "Introduction to Plasma",
    //     "description": "Plasma is one of the four fundamental states of matter.\r\n\r\nPlasma is one of the four fundamental states of matter, alongside solids, liquids, and gases. It is a high-energy, ionised gas consisting of positively charged ions and free electrons. In a plasma, atoms are stripped of their electrons, creating a mixture of charged particles. This ionisation process gives plasma unique properties that distinguish it from the other states of matter.\r\n\r\nUnlike solids, liquids, and gases, plasma consists of free electrons or ions that aren’t bound to an atomic nucleus.\r\n\r\nIonisation: In plasma, a significant number of electrons are separated from their respective nuclei, resulting in a mixture of positively charged ions and free electrons. This ionisation process makes plasma electrically conductive.\r\n\r\nHigh Energy: Plasmas are often found at high temperatures, where particles have enough kinetic energy to overcome the electromagnetic forces that bind electrons to atomic nuclei.\r\n\r\nElectrically Conductive: Due to the presence of free electrons, plasma can conduct electricity and respond to electromagnetic fields.\r\n\r\nEmission of Light: Many plasmas emit visible light, and this property is utilized in various technologies such as fluorescent lights, neon signs, and plasma TVs.\r\n\r\nWide Occurrence: Plasmas are abundant in the universe, found in stars like the Sun, lightning bolts, flames, and some types of artificial lighting.\r\n\r\nApplications: Plasma has numerous practical applications, including in technologies like plasma cutting for metal fabrication, plasma torches for waste disposal, and plasma thrusters for spacecraft propulsion.\r\n\r\n99% of the material is made up of plasma in the universe. Plasma may be the most abundant form of ordinary matter, but this hypothesis is tentative based on its existence and unknown properties.",
    //     "passing_percentage": null,
    //     "file": "https://app.plasmapen.com/public/uploads/course/lesson/content/CoolJet-Training-Manual-2023_Page_04.jpg",
    //     "type": "content",
    //     "complete_date": null,
    //     "quiz_url": null,
    //     "survey_url": null,
    //     "marks_obtained": null,
    //     "marks_out_of": null,
    //     "percentage_obtained": null,
    //     "pass_status": null,
    //     "total_question": null,
    //     "total_correct": null,
    //     "is_completed": 0,
    //     "quiz": []
    // }

    const images = Array.isArray(data?.file) ? data?.file : [data?.file]

    return (
        <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, }}>
                <HomeHeader2
                    height={60}
                    // paddingHorizontal={15}
                    title={data?.title}
                    press1={() => {
                        props.navigation.goBack();
                    }}
                    img1={require('../../assets/arrow_right_black.png')}
                    img1width={25}
                    img1height={25}
                    press2={() => { props.navigation.navigate('Notification') }}
                    img2={require('../../assets/notification.png')}
                    img2width={25}
                    img2height={25}
                    press3={() => { }}
                    img3={require('../../assets/shoppingbag.png')}
                    img3width={25}
                    img3height={25}
                    backgroundColor={'transparent'}
                />
                <ScrollView contentContainerStyle={{ padding: 15 }}>
                    <View style={{ marginTop: 10 }} />

                    <Text style={{ fontFamily: FONTFAMILY, fontSize: 20, color: 'white', fontWeight: '600' }}>{data?.title}</Text>

                    <View style={{ marginTop: 35 }} />

                    <Text style={{ fontFamily: FONTFAMILY, fontSize: 18, color: 'white' }}> {data?.description} </Text>

                    <View style={{ marginTop: 35 }} />
                    <View
                        style={{
                            width: dimensions.SCREEN_WIDTH - 20,
                            height: 220,
                            // backgroundColor: 'green',
                            alignSelf: 'center',
                            borderRadius: 10,
                            overflow: 'hidden',
                        }}>

                        <Pages>
                            {images?.map((item, index) => <Image key={index}
                                style={{ width: '100%', height: '100%' }}
                                source={{ uri: item }}
                            />)}
                        </Pages>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    )
}

export default Content