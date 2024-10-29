import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  useColorScheme,
  Alert,
  TextInput,
  Keyboard,
  TouchableOpacity,
  ImageBackground,
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
import { profile, requestGetApi, requestPostApi, } from '../../WebApi/Service';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../WebApi/Loader';
import Toast from 'react-native-simple-toast';
import MyAlert from '../../component/MyAlert';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import HomeHeader from '../../component/HomeHeader';
import { FONTFAMILY, FONTFAMILYSEMIBOLD } from '../../utility/fonts';


const Myprofile = props => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const userdetaile = useSelector(state => state.user.user_details);
  const [profileData, setprofileData] = useState('');
  const [pass, setpass] = useState('');
  const [cpass, setcpass] = useState('');

  const [passView, setPassView] = useState(true);
  const [cpassView, setcPassView] = useState(true);
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');

  const [profileModal, setprofileModal] = useState(true);
  const [resetModal, setresetModal] = useState(false);

  useEffect(() => {
    // console.log("PROFILE SCREEN CALLING!!!!!!!");
    getProfile()
  }, []);

  const getProfile = async () => {
    setLoading(true)
    const { responseJson, err } = await requestGetApi(profile, '', 'GET', userdetaile.access_token)
    setLoading(false)
    console.log('getlocationgetlocation==>>>', responseJson)
    if (err == null) {
      if (responseJson.status) {

        setprofileData(responseJson.data)
      } else {

      }
    } else {
      // Alert.alert(err)
    }
  }


  const resetStacks = page => {
    props.navigation.reset({
      index: 0,
      routes: [{ name: page }],
      params: { resentotp: false },
    });
  };

  const logoutPressed = () => {
    AsyncStorage.clear();
    dispatch(onLogoutUser());
  };

  const CustomCard = ({ img, text, onPress }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 10,
          width: 120,
          height: 150,
          // shadowColor: '#000000',
          // shadowOffset: {
          //   width: 0,
          //   height: 3,
          // },
          // shadowRadius: 5,
          // shadowOpacity: 1.0,
          // elevation: 5,
          borderWidth: 1,
          borderColor: '#EAEDF7',
          padding: 10,

        }}>
        <Image
          style={{ height: 50, width: 50, alignSelf: 'center', resizeMode: 'stretch' }}
          source={img}

        />
        <Text
          style={{
            fontSize: 13,
            color: Mycolors.Black,
            fontWeight: '500',
            // lineHeight: 40,
          }}>
          {text}
        </Text>
        <Image
          style={{ height: 25, width: 25, alignSelf: 'center' }}
          source={require('../../assets/Round_arrow-right.png')}
        />
      </TouchableOpacity>
    );
  };
  function onclickNotificationbtn() {
    props.navigation.navigate('NotificationsSetting');
  };

  function onclickBillingbtn() {
    props.navigation.navigate('Billing');
  };

  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1 }}>
      <SafeAreaView />
      <StatusBar />
      <ScrollView>
        {/* ******************Header******************** */}
        <HomeHeader />
        <View
          style={{
            justifyContent: 'center',
            width: '100%',
            alignSelf: 'center',
          }}>
          <ImageBackground
            resizeMode=""
            source={require('../../assets/Profile_bg_image.png')}

            style={{ height: '100%', width: '100%', marginTop: 40 }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{

                  alignSelf: 'center',
                  height: 140,
                  width: 140,
                  borderWidth: 2,
                  borderColor: Mycolors.Purple,
                  borderRadius: 100,
                  marginTop: 10,
                  backgroundColor: 'grey'
                }}>
                <Image resizeMode='cover'
                  // source={require('../../assets/Frame6353.png')}
                  source={{ uri: profileData?.profile_image }}
                  style={{ height: '100%', width: '100%', alignSelf: 'center', borderRadius: 70 }}
                />
              </View>
              <Text style={{
                fontFamily: FONTFAMILY,
                fontSize: 18,
                color: Mycolors.Black,
                fontWeight: '800',
              }}>
                {userdetaile?.user?.name}
              </Text>
              <View style={{ flexDirection: 'row', padding: 4, marginLeft: 0 }}>
                <Image
                  style={{ height: 22, width: 22, marginTop: 1 }}
                  source={require('../../assets/purple_call_icon.png')}></Image>
                <Text
                  style={{
                    fontSize: 14,
                    color: Mycolors.Black,
                    fontWeight: '400',
                  }}>
                  {' '}
                  {profileData?.mobile}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', padding: 4, marginLeft: 0 }}>
                <Image
                  style={{ height: 22, width: 22, marginTop: 1 }}
                  source={require('../../assets/purple_sms_icon.png')}></Image>
                <Text
                  style={{
                    fontSize: 14,
                    color: Mycolors.Black,
                    fontWeight: '400',
                  }}>
                  {' '}
                  {profileData?.email}
                </Text>
              </View>
              <View
                style={{
                  width: '90%',
                  // alignSelf: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  marginTop: 15,
                  marginHorizontal: 20
                }}>
                <TouchableOpacity
                  onPress={() => { props.navigation.navigate('EditProfile') }}
                  style={{
                    width: '48%',
                    height: 46,
                    paddingVertical: 10,
                    borderRadius: 4,
                    justifyContent: 'center',
                    backgroundColor: '#B357C3',
                  }}>
                  <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, color: '#fff', textAlign: 'center' }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { props.navigation.navigate('ChangPassword') }}
                  style={{
                    width: '48%',
                    height: 46,
                    paddingVertical: 10,
                    borderRadius: 4,
                    justifyContent: 'center',
                    backgroundColor: '#4556A6',
                  }}>
                  <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, color: '#fff', textAlign: 'center' }}>
                    Change Password
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 25,
                  width: '88%',
                  marginHorizontal: 20
                }}>
                <CustomCard
                  img={require('../../assets/Certificate_icon.png')}
                  text={'My Certificates'}
                  onPress={() => props.navigation.navigate('MyCetificate')}
                />
                {/* <CustomCard
                  img={require('../../assets/purple_notification-bing.png')}
                  text={'Notifications'} onPress={()=>onclickNotificationbtn()}
                /> */}
                <CustomCard
                  img={require('../../assets/purple_dollar-circle.png')}
                  text={'Billing'}
                  onPress={() => onclickBillingbtn()}
                />
                <CustomCard
                  img={require('../../assets/logout.png')}
                  text={'Logout'} onPress={
                    () => {
                      logoutPressed()
                    }
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 15,
                  width: '88%',
                  marginHorizontal: 20
                }}>
                {/* <CustomCard
                  img={require('../../assets/purple_shopping-bag.png')}
                  text={'Order History'} onPress={()=>props.navigation.navigate('BottomNavNew',{screenIndex: 2})}
                /> */}
                {/* <CustomCard
                  img={require('../../assets/Black_heart.png')}
                  text={'Wishlist'} onPress={()=>props.navigation.navigate('BottomNavNew',{screenIndex: 1})}
                /> */}
                {/* Dummy */}
                <TouchableOpacity
                  // onPress={onPress}
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: 10,
                    width: 114,
                    height: 150,
                    // shadowColor: '#000000',
                    // shadowOffset: {
                    //   width: 0,
                    //   height: 3,
                    // },
                    // shadowRadius: 5,
                    // shadowOpacity: 1.0,
                    // elevation: 5,
                    // borderWidth: 1,
                    // borderColor: '#EAEDF7',
                    padding: 10,

                  }}></TouchableOpacity>
                {/* <CustomCard
                  img={require('../../assets/logout.png')}
                  text={'Logout'} onPress={
                    ()=>{
                      logoutPressed()
                    }
                  }
                /> */}
              </View>
              <View style={{ height: 10 }} />
              {/* <ImageBackground resizeMode='stretch' source={require('../../assets/Profile_last_img.png')} style={{width:'100%',height:180}} >


              </ImageBackground> */}

            </View>
          </ImageBackground>
        </View>
      </ScrollView>
      {My_Alert ? (
        <MyAlert
          sms={alert_sms}
          okPress={() => {
            setMy_Alert(false);
          }}
        />
      ) : null}
      {loading ? <Loader /> : null}
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Mycolors.ProfileBG,
  },
  textStyle: {
    fontSize: 13,
    alignSelf: 'center',
    // color: Mycolors.ORANGE,
  },

  signupinput: {
    height: 50,
    width: '100%',
    fontSize: 12,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 10,
    color: Mycolors.TEXT_COLOR,
    paddingLeft: 20,
    paddingRight: 10,
    backgroundColor: Mycolors.LogininputBox,
  },
});
export default Myprofile;
