import React, {useState, useEffect} from 'react';
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
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import MyButtons from '../../component/MyButtons';
import MyInputText from '../../component/MyInputText';
import {dimensions, Mycolors} from '../../utility/Mycolors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveUserResult,
  onLogoutUser,
  saveUserToken,
} from '../../redux/actions/user_action';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {change_password, requestPostApi,} from '../../WebApi/Service';
import {useSelector, useDispatch} from 'react-redux';
import Loader from '../../WebApi/Loader';
import Toast from 'react-native-simple-toast';
import MyAlert from '../../component/MyAlert';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import HomeHeader from '../../component/HomeHeader';
import HomeHeader2 from '../../component/HomeHeader2';
import TextInputArea from '../../component/TextInputArea';

const ChangPassword = props => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const userdetaile = useSelector(state => state.user.user_details);
  const [oldpass, setOldPss] = useState('');
  const [pass, setpass] = useState('');
  const [cpass, setcpass] = useState('');

  const [passView, setPassView] = useState(true);
  const [cpassView, setcPassView] = useState(true);
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');

  const [profileModal, setprofileModal] = useState(true);
  const [resetModal, setresetModal] = useState(true);

  useEffect(() => {}, []);

  const ResetPassPressed = async () => {
    if (oldpass == '' || oldpass.trim().length == 0) {
      Toast.show('Please Enter old password');
    }else if (pass == '' || pass.trim().length == 0) {
      Toast.show('Please Enter new password');
    } else if (cpass == '' || cpass.trim().length == 0) {
      Toast.show('Please Enter confirm password');
    } else if (cpass != pass) {
      Toast.show('Password and confirm password are not same');
    } else {
      setLoading(true);
      let formdata = new FormData();
      formdata.append('old_password', oldpass);
      formdata.append('new_password', pass);
      const {responseJson, err} = await requestPostApi(
        change_password,
        formdata,
        'POST',
        userdetaile.access_token,
      );
      setLoading(false);
      console.log('the res==>>', responseJson);
      if (err == null) {
        if (responseJson.status) {
          setpass('');
          setcpass('');
          setOldPss('')
          Toast.show(responseJson.message);
          props.navigation.goBack();
        } else {
          // setalert_sms(responseJson.message);
          Toast.show(responseJson.message);
          // setMy_Alert(true);
          console.log('the res==>>', responseJson);
        }
      } else {
        setalert_sms(err);
        setMy_Alert(true);
      }
    }
  };

  

 
  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <HomeHeader2
          height={60}
          // paddingHorizontal={15}
          title={'Change password'}
          press1={() => {
            props.navigation.goBack();
          }}
          img1={require('../../assets/arrow_right_black.png')}
          img1width={25}
          img1height={25}
          press2={() => {props.navigation.navigate('Notification')}}
          img2={require('../../assets/notification.png')}
          img2width={25}
          img2height={25}
          press3={() => {}}
          img3={require('../../assets/shoppingbag.png')}
          img3width={25}
          img3height={25}
          backgroundColor={'transparent'}
        />
        {/* <ScrollView> */}
          <View
            style={{
              // height:(dimensions.SCREEN_HEIGHT * 55)/100,
              // position: 'absolute',
              width: '93%',
              backgroundColor: Mycolors.BG_COLOR,
              borderRadius: 15,
              marginTop:10,
              alignSelf: 'center',
              // bottom: 0,
              borderColor: '#fff',
              borderWidth: 0.5,
              paddingHorizontal: 20,
            }}>
              {/* <View style={{marginTop:15}}>
              <Text style={{fontFamily:FONTFAMILY,fontSize:14,fontWeight:'400',color:Mycolors.Black,lineHeight:30}}>Don’t Remember Password?</Text>
              <Text style={{fontFamily:FONTFAMILY,fontSize:18,fontWeight:'500',color:Mycolors.Purple}}>Send Password Reset Link</Text>
              </View> */}
              
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  marginTop: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TextInputArea
                  value={oldpass}
                  setValue={setOldPss}
                  placeholder={'Old Password'}
                  placeholderTextColor={'#696969'}
                  TextInputWidth={'100%'}
                  hasViewBorder
                  icon={true}
                  img={require('../../assets/lock.png')}
                />

                <TextInputArea
                  value={pass}
                  setValue={setpass}
                  placeholder={'New Password'}
                  placeholderTextColor={'#4F5168'}
                  TextInputWidth={'100%'}
                  hasViewBorder
                  icon={true}
                  img={require('../../assets/lock.png')}
                />
                <TextInputArea
                  value={cpass}
                  setValue={setcpass}
                  placeholder={'Confirm Password'}
                  placeholderTextColor={'#4F5168'}
                  TextInputWidth={'100%'}
                  hasViewBorder
                  icon={true}
                  img={require('../../assets/lock.png')}
                />

                <MyButtons
                  title="Save Changes"
                  height={60}
                  width={'100%'}
                  borderRadius={5}
                  fontWeight={'700'}
                  alignSelf="center"
                  press={() => {
                    ResetPassPressed()
                  }}
                  marginHorizontal={20}
                  titlecolor={Mycolors.BG_COLOR}
                  backgroundColor={Mycolors.Purple}
                  marginVertical={10}
                />
                <MyButtons
                  title="Clear All"
                  height={60}
                  width={'100%'}
                  borderRadius={5}
                  fontWeight={'700'}
                  alignSelf="center"
                  press={() => {
                   setpass('')
                   setOldPss('')
                   setcpass('')
                  }}
                  marginHorizontal={20}
                  titlecolor={Mycolors.BG_COLOR}
                  backgroundColor={Mycolors.DARK_BLUE}
                  marginVertical={10}
                />


                <View style={{height: 50}}/>
              </View>
            </KeyboardAwareScrollView>
          </View>
        {/* </ScrollView> */}

        {My_Alert ? (
          <MyAlert
            sms={alert_sms}
            okPress={() => {
              setMy_Alert(false);
            }}
          />
        ) : null}
        {loading ? <Loader /> : null}
      </SafeAreaView>
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
export default ChangPassword;
