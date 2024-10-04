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
import useAPI from '../../utility/hooks/useAPI';
import NoDataFound from '../../component/NoDataFound';
import LessonComp from '../../component/LessonComp';
import { FONTFAMILY } from '../../utility/fonts';




const HomeViewAll = (props) => {
  const [loading, setLoading] = useState(false)
  const userdetaile = useSelector(state => state.user.user_details);
  const [code, setcode] = useState('+1')
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [select1, setselect1] = useState(false)
  const [data, setdata] = useState([])

  const { getAPI } = useAPI()

  useEffect(() => {
    getCourcesdata()
  }, [])

  const searchCourse = async (searchVal) => {
    setLoading(true);
    const res = await getAPI({ endPoint: courses + '?search=' + searchVal })
    if (res) {
      setdata(res?.data)
    }

    setLoading(false);
  }

  const getCourcesdata = async () => {
    setLoading(true);
    let formdata = new FormData();
    formdata.append('id', userdetaile.id);
    const { responseJson, err } = await requestGetApi(courses, '', 'GET', userdetaile.access_token)

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
      <MySearchBar placeHolder={'Courses'} onSearchSubmit={searchCourse} />
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
                    <View style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: 5 }}>
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
                    </View>
                    {/* <TouchableOpacity style={{width:'100%',height:35,backgroundColor:'rgba(100,80,200,0.5)',position:'absolute',bottom:0,justifyContent:'center',zIndex:999}}>
                <Text style={{fontFamily:FONTFAMILY,textAlign:'center',color:'#fff'}}>Free Course</Text>
                  </TouchableOpacity> */}

                  </ImageBackground>

                  <View style={{ width: '100%', backgroundColor: '#fff', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, padding: 10 }}>
                    <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000", padding: 5 }}>{item.title}</Text>

                    <View style={{ flexDirection: "row" }}>

                      {/* <Text style={[{fontFamily:FONTFAMILY, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2, }, StrikeThough]}>${item.course_fee}</Text> */}
                      <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }}>${item.course_sale_fee}</Text>

                      <View style={{ flexDirection: "row", padding: 4, marginLeft: 25 }}>
                        <Image style={{ height: 12, width: 12, marginTop: 1 }} source={require("../../assets/star.png")}></Image>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000", }}> {item?.rating}</Text>
                      </View>

                      {/* <TouchableOpacity style={{ height: 23, width: 70, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginLeft: 20 }}>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#B357C3", textAlign: "center" }}>{item.lesson_count} Lessons</Text>
                      </TouchableOpacity> */}
                      
                      <LessonComp style={{marginLeft: 20}} count={item?.lesson_count}/>


                    </View>

                    <View style={{ flexDirection: 'row', }}>

                      <Image style={{ height: 28, width: 28, marginLeft: 5 }} source={require("../../assets/Rectangle103.png")}></Image>
                      <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "black", marginTop: 5, marginLeft: 5 }}> {item?.total_purchase} Enrolled</Text>

                    </View>

                  </View>

                </TouchableOpacity>

              )
            }}
            keyExtractor={item => item.id}

            ListEmptyComponent={<NoDataFound styles={{marginTop: '32%'}}/>}
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
export default HomeViewAll