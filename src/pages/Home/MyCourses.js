import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ImageBackground, Platform, SafeAreaView, StatusBar, ScrollView, TextInput, Keyboard, Alert, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../WebApi/Loader';
import HomeHeader2 from '../../component/HomeHeader2';
import MySearchBar from '../../component/MySearchBar';

import MyButtons from '../../component/MyButtons';
import MyInputText from '../../component/MyInputText';
import { dimensions, Mycolors } from '../../utility/Mycolors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { saveUserResult, saveUserToken } from '../../redux/actions/user_action';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
    baseUrl,
    courses,
    profile,
    requestGetApi,
    requestPostApi,
} from '../../WebApi/Service';
import Toast from 'react-native-simple-toast';
import MyAlert from '../../component/MyAlert';
import Modal from 'react-native-modal';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import DropDownPicker from 'react-native-dropdown-picker';
// import DatePicker from 'react-native-datepicker';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
import TextInputArea from '../../component/TextInputArea';
import { StrikeThough } from '../../utility/FontStyles';
import { handleShare } from '../../component/ShareComponent';
import { addToWishlist } from '../../WebApi/GlobalAPICalls';
import { sliceTitle } from '../../utility/MyFunctions';
import { useIsFocused } from '@react-navigation/native';
import useAPI from '../../utility/hooks/useAPI';
import NoDataFound from '../../component/NoDataFound';
import { FONTFAMILY } from '../../utility/fonts';




const MyCourses = (props) => {
    const [loading, setLoading] = useState(false)
    const userdetaile = useSelector(state => state.user.user_details);
    const [code, setcode] = useState('+1')
    const [My_Alert, setMy_Alert] = useState(false)
    const [alert_sms, setalert_sms] = useState('')
    const [select1, setselect1] = useState(false)
    const [data, setdata] = useState([
        {
            id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
            title: 'First Item',
        },
        {
            id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
            title: 'Second Item',
        },
        {
            id: '58694a0f-3da1-471f-bd96-145571e29d72',
            title: 'Third Item',
        },
    ])
    const isFocused = useIsFocused()
    const updateCourse = useSelector(state => state.course.updateCourse);
    const { getAPI } = useAPI()

    useEffect(() => {
        isFocused && getCourcesdata()
    }, [isFocused])

    const searchCourse = async (searchVal) => {
        setLoading(true);
        const res = await getAPI({ endPoint: 'my-courses' + '?search=' + searchVal })
        if (res) {
          setdata(res?.data)
        }
    
        setLoading(false);
      }

    const getCourcesdata = async () => {
        setLoading(true);
        let formdata = new FormData();
        formdata.append('id', userdetaile.id);
        const { responseJson, err } = await requestGetApi('my-courses', '', 'GET', userdetaile.access_token)

        setLoading(false);
        console.log('the courses data is==>>', responseJson.data);
        if (err == null) {
            if (responseJson.status) {

                setdata(responseJson.data);

            } else {

            }
        } else {
        }
    };

    return (
        <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1, }}>
            <SafeAreaView />
            <StatusBar />

            {/* ******************Header******************** */}
            <HomeHeader2
                height={60}
                // paddingHorizontal={15}
                title={'Plasma Pen Courses'}
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
            {/* ******************Search******************** */}
            <MySearchBar placeHolder={'My Courses'} onSearchSubmit={searchCourse} />
            <ScrollView>

                <View style={{ marginTop: 10, }}>
                    <FlatList
                        data={data}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity style={{ width: dimensions.SCREEN_WIDTH * 95 / 100, alignSelf: 'center', marginTop: 15 }}
                                    onPress={() => { props.navigation.navigate('CourseDetails', { data: item }) }}>
                                    <ImageBackground style={{ height: 170, width: '100%', borderTopLeftRadius: 7, borderTopRightRadius: 7, overflow: 'hidden' }} source={{ uri: item.image }}>
                                        {/* <View style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: 5 }}>
                                            <TouchableOpacity onPress={async () => {
                                                // return
                                                await addToWishlist(item?.id, 1, userdetaile.access_token)
                                                getCourcesdata()
                                            }} style={{ marginRight: 10 }}>
                                                <Image style={{ height: 25, width: 25, tintColor: "#B357C3", }} source={item?.wishlist ? require("../../assets/heartFilled.png") : require("../../assets/heart.png")}></Image>

                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => {
                                                handleShare(item.title)
                                            }} style={{ marginRight: 10 }}>
                                                <Image style={{ height: 25, width: 25, }} source={require("../../assets/ShareNetwork.png")}></Image>
                                            </TouchableOpacity>
                                        </View> */}
                                        {/* <TouchableOpacity style={{width:'100%',height:35,backgroundColor:'rgba(100,80,200,0.5)',position:'absolute',bottom:0,justifyContent:'center',zIndex:999}}>
                <Text style={{fontFamily:FONTFAMILY,textAlign:'center',color:'#fff'}}>Free Course</Text>
                  </TouchableOpacity> */}

                                    </ImageBackground>

                                    <View style={{ width: '100%', backgroundColor: '#fff', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, padding: 10 }}>
                                        <View style={{ flexDirection: "row", width: '100%', backgroundColor: 'white', justifyContent: 'space-between' }}>
                                            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000", padding: 5 }}>{item.title}</Text>
                                            <View style={{ flexDirection: "row", padding: 4, }}>
                                                <Image style={{ height: 12, width: 12, marginTop: 1 }} source={require("../../assets/star.png")}></Image>
                                                <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000", }}> {item?.rating}</Text>
                                            </View>
                                        </View>


                                        <View style={{ flexDirection: "row" }}>

                                            {/* <Text style={[{fontFamily:FONTFAMILY, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2, }, StrikeThough]}>${item.course_fee}</Text> */}
                                            <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }}>{sliceTitle(item?.description, 50)}</Text>

                                            {/* <View style={{ flexDirection: "row", padding: 4, marginLeft: 25 }}>
                                                <Image style={{ height: 12, width: 12, marginTop: 1 }} source={require("../../assets/star.png")}></Image>
                                                <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000", }}> 4.7</Text>
                                            </View> */}

                                            {/* <TouchableOpacity style={{ height: 23, width: 60, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginLeft: 20 }}>
                                                <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#B357C3", textAlign: "center" }}>{item.lesson_count} lesson</Text>
                                            </TouchableOpacity> */}


                                        </View>

                                        <TouchableOpacity style={{ height: 25, width: 70, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginLeft: 6, marginTop: 4 ,}}>
                                                <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#B357C3", textAlign: "center" }}>{item.lesson_count} lessons</Text>
                                            </TouchableOpacity>

                                        {/* <View style={{ flexDirection: 'row', }}>

                                            <Image style={{ height: 28, width: 28, marginLeft: 5 }} source={require("../../assets/Rectangle103.png")}></Image>
                                            <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "grey", marginTop: 5, marginLeft: 10 }}> +1182 enrolled</Text>

                                        </View> */}


                                        <View style={{ width: '100%', height: 20, backgroundColor: '#132a3a', marginTop: 12, borderRadius: 5 }}>

                                            <View style={{width: item?.completion_status && String(item?.completion_status)+'%', backgroundColor: '#B357C3', height: 20, 
                                            // borderTopLeftRadius: 5, borderBottomLeftRadius: 5
                                            borderRadius: 5
                                            }}/>
                                            {/* <View style={{width: '50%'}}/> */}


                                            <Text style={{fontFamily:FONTFAMILY, position: 'absolute', color: 'white', left: '38%', top: 2 }}> {item?.completion_status && String(item?.completion_status)+'%'} Completed</Text>
                                        </View>


                                    </View>



                                </TouchableOpacity>

                            )
                        }}
                        keyExtractor={item => item.id}
                        ListEmptyComponent={<NoDataFound styles={{ marginTop: "27%" }} />}
                    />
                </View>





                {loading ?
                    <Loader />
                    : null
                }
                <View style={{ width: 50, height: 150 }} />
            </ScrollView>
        </LinearGradient>

    );
}
const styles = StyleSheet.create({


});
export default MyCourses