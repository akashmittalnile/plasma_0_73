import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  useColorScheme,
  Alert,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Linking,
  ImageBackground,
} from 'react-native';
import MyButtons from '../../component/MyButtons';
import MyInputText from '../../component/MyInputText';
import { dimensions, Mycolors } from '../../utility/Mycolors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { saveUserResult, saveUserToken } from '../../redux/actions/user_action';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { baseUrl, login, requestPostApi, } from '../../WebApi/Service';
import Loader from '../../WebApi/Loader';
import Toast from 'react-native-simple-toast';
import MyAlert from '../../component/MyAlert';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
// import DropDownPicker from 'react-native-dropdown-picker';
import { CallingCodePicker } from '@digieggs/rn-country-code-picker';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import DatePicker from 'react-native-datepicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import useKeyboard from '../../component/useKeyboard';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
// import CountryPicker from 'react-native-country-picker-modal';
import AuthHeader from '../../component/AuthHeader';
import TextInputArea from '../../component/TextInputArea';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { FONTFAMILY } from '../../utility/fonts';
import { getFCMToken } from '../../utility/FirebaseUtility';

const CELL_COUNT = 4;

const Login = props => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const mapdata = useSelector(state => state.maplocation);
  // const [email, setemail] = useState('');
  // const [pass, setpass] = useState('');
  const [email, setemail] = useState('lara@yopmail.com');
  const [pass, setpass] = useState('Abc@123');
  // const [email, setemail] = useState('Nitya@yopmail.com');
  // const [pass, setpass] = useState('Abc@123');
  // const [email, setemail] = useState('somya@yopmail.com');
  // const [pass, setpass] = useState('Abc@123');
  const [secureTextEntry, setsecureTextEntry] = useState(true);

  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });

  const [singleFile, setSingleFile] = useState(null);
  const [singlePic, setSinglePic] = useState('');
  const [singleFile_Image, setsingleFile_Image] = useState(null);

  useEffect(() => {

  }, []);







  const Validation = () => {
    var EmailReg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var nameReg = /[^a-zA-Z- ]/g;
    var OneDecimalPoint = /^(\d*)\.{0,1}(\d){0,1}$/;
    if (email == '' || email.trim().length == 0) {
      Toast.show('Please Enter Email');
      return false
    } else if (!EmailReg.test(email)) {
      Toast.show('Please Enter Valid Email');
      return false
    } else if (pass == '') {
      Toast.show('Please Enter Password');
      return false
    } else {
      return true
    }

  };

  const LoginPressed = async () => {

    if (Validation()) {
      const fcmToken = await getFCMToken()
      if (!fcmToken) {
        return
      }
      setLoading(true);
      let formdata = new FormData();

      formdata.append('email', email);
      formdata.append('password', pass);
      formdata.append('fcm_token', fcmToken);
      // setLoading(false);
      console.log({ "formdata": JSON.stringify(formdata) });
      
      // return
      
      const { responseJson, err } = await requestPostApi(
        login,
        formdata,
        'POST',
        '',
      );
      setLoading(false);
      console.log('the res==>>', responseJson);
      if (err == null) {
        if (responseJson.status) {
          AsyncStorage.setItem("plasmapen", JSON.stringify(responseJson.data));
          dispatch(saveUserResult(responseJson.data))
          dispatch(saveUserToken(responseJson.data.access_token))
        } else {
          setalert_sms(responseJson.message);
          setMy_Alert(true);
        }
      } else {
        setalert_sms(err);
        setMy_Alert(true);
      }
    }
    // }
  };


  return (
    <View style={styles.container}>
      {/* <LinearGradient
          colors={['rgba(48, 0, 118, 0.83)', 'rgba(83, 4, 95, 0.83)','rgba(48, 0, 118, 0.83)', 'rgba(83, 4, 95, 0.83)']}
          style={{height:dimensions.SCREEN_HEIGHT,width:'100%'}}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
         > */}
      <ImageBackground
        style={{ height: 500 }}
        resizeMode='stretch'
        source={require('../../assets/Group_Login.png')}>
        <View style={{ height: insets.top }} />
        <AuthHeader
          height={60}
          paddingHorizontal={15}
          press1={() => {
            props.navigation.goBack();
          }}
          img1={require('../../assets/arrow.png')}
          img1width={40}
          img1height={40}
          Text1={'Sign In'}
          backgroundColor={'transparent'}
        />
      </ImageBackground>
      {/* </LinearGradient> */}
      <View
        style={{
          height: dimensions.SCREEN_HEIGHT,

          position: 'absolute',
          width: '100%',
          // marginHorizontal: 20,
          // backgroundColor: Mycolors.BG_COLOR,
          borderRadius: 15,
          alignSelf: 'center',
          top: '31%',
          // flex:1
        }}>
        <View
          style={{
            // height: (dimensions.SCREEN_HEIGHT * 20) / 100,
            height: 40,
            width: '78%',
            marginHorizontal: 50,
            // position: 'absolute',
            // justifyContent: 'center',
            // alignItems: 'center',
            top: -40,
          }}>
          <Image
            resizeMode="contain"
            source={require('../../assets/Plasmapen_icon.png')}
            style={{ height: '100%', width: '100%' }}
          />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              height: 310,

              // position: 'absolute',
              width: '90%',
              marginHorizontal: 20,
              backgroundColor: Mycolors.BG_COLOR,
              borderRadius: 15,
              alignSelf: 'center',
              // top: '37%',
              borderColor: '#fff',
              borderWidth: 0.5,
              paddingHorizontal: 20,
              shadowColor: '#000000',
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowRadius: 5,
              shadowOpacity: 1.0,
              elevation: 5,
            }}>

            <View
              style={{
                marginTop: 25,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TextInputArea
                value={email}
                setValue={setemail}
                placeholder={'Email Address'}
                placeholderTextColor={'#4F5168'}
                TextInputWidth={'100%'}
                hasViewBorder
                icon={true}
                img={require('../../assets/Email_icon.png')}
              />

              <View style={{ height: 10 }} />
              {/* <View style={{width: dimensions.SCREEN_WIDTH - 40, marginTop: 30}}> */}
              <TextInputArea
                placeholder="Password"
                placeholderTextColor={'#4F5168'}
                // secureTextEntry={}
                // secureTextEntry={secureTextEntry}
                required={true}
                value={pass}
                hasViewBorder
                setValue={setpass}
                isSecure={secureTextEntry}
                icon={true}
                img={require('../../assets/lock.png')}
                secondIcon={secureTextEntry ? require('../../assets/white_eye.png') : require('../../assets/eye_crossed.png')}
                secondIconPress={() => {
                  setsecureTextEntry((state) => (!state))
                  // console.log(secureTextEntry);
                }}
              // myTextInputRef={passWordRef}
              // onSubmitEditing={() => confirmPassWordRef.current.focus()}
              />
            </View>


            <TouchableOpacity onPress={() => { }} style={{}}>
              <Text
                style={[
                  styles.textStyle,
                  {
                    color: Mycolors.TEXT_COLOR,
                    alignSelf: 'flex-end',
                    marginTop: 20, fontFamily: FONTFAMILY
                  },
                ]}
                onPress={() => {
                  props.navigation.navigate('ForgotPassword')
                }}>
                Forgot your password?
              </Text>
            </TouchableOpacity>

            <MyButtons
              title="Sign In"
              height={60}
              width={'100%'}
              borderRadius={5}
              fontWeight={'700'}
              alignSelf="center"
              press={() => {
                LoginPressed()
              }}
              marginHorizontal={20}
              titlecolor={Mycolors.BG_COLOR}
              backgroundColor={Mycolors.Purple}
              marginVertical={10}
            />
            {/* </ScrollView> */}
          </View>

          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              // height: (dimensions.SCREEN_HEIGHT * 28) / 100,
              // position: 'absolute',
              width: '100%',
              // bottom: 0,
            }}>
            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 20,
              }}>
              <View
                style={{
                  width: '30%',
                  borderWidth: 1,
                  borderTopColor: '#4556A6',
                }}
              />
              <View
                style={{
                  backgroundColor: '#4556A6',
                  borderRadius: 10,
                  padding: 10,
                  marginHorizontal: 20,
                }}>
                <Text style={{fontFamily:FONTFAMILY,color: '#fff'}}>OR</Text>
              </View>
              <View
                style={{
                  width: '30%',
                  borderWidth: 1,
                  borderTopColor: '#4556A6',
                }}
              />
            </View> */}

            {/* <TouchableOpacity
              style={{
                backgroundColor: '#fff',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection:'row',
                padding:15,
                borderColor: '#fff',
                borderWidth: 0.5,
                shadowColor: '#000000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowRadius: 5,
                shadowOpacity: 1.0,
                elevation: 5,
                width: '90%',
              marginHorizontal: 20,
              }}>
              <Image source={require('../../assets/logo_fb.png')} style={{height:26,width:26}} />
              <Text style={{fontFamily:FONTFAMILY,color:'#6A6A6A',fontWeight:'500',marginLeft:15}} >Login with Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#fff',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection:'row',
                padding:15,
                borderColor: '#fff',
                borderWidth: 0.5,
                shadowColor: '#000000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowRadius: 5,
                shadowOpacity: 1.0,
                elevation: 5,
                width: '90%',
              marginHorizontal: 20,
              marginTop:10
              }}>
              <Image source={require('../../assets/logo_google.png')} style={{height:26,width:26}} />
              <Text style={{fontFamily:FONTFAMILY,color:'#6A6A6A',fontWeight:'500',marginLeft:15}} >Login with Google</Text>
            </TouchableOpacity> */}

            <View style={{ flexDirection: 'row', alignSelf: 'center', top: 20 }}>
              <Text
                style={[styles.textStyle, { color: Mycolors.TEXT_COLOR }]}
                onPress={() => { }}>
                Don't have an account?
              </Text>
              <Text
                style={[styles.textStyle, { color: '#4556A6' }]}
                onPress={() => {
                  props.navigation.navigate('SignUp')
                  // setforgotModal(false);
                  // setloginModal(false);
                  // setresetModal(false);
                  // setSignUpModal(true);
                  // setverificationModal(false);
                }}>
                {' '}
                Signup
              </Text>
            </View>

            <View style={{ width: 20, height: 200 }}></View>
          </View>
        </ScrollView>
      </View>


      {My_Alert ? (
        <MyAlert
          sms={alert_sms}
          okPress={() => {
            setMy_Alert(false);
          }}
        />
      ) : null}
      {loading ? <Loader /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Mycolors.BG_COLOR,
  },
  textStyle: {
    fontSize: 14,
    alignSelf: 'center', fontFamily: FONTFAMILY
    // color: Mycolors.ORANGE,
  },
  input: {
    height: 55,
    width: '100%',
    fontSize: 13,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 10,
    color: Mycolors.TEXT_COLOR,
    paddingLeft: 20,
    paddingRight: 10,
    backgroundColor: Mycolors.LogininputBox,
  },
  signupinput: {
    height: 50,
    width: '100%',
    fontSize: 12,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 10,
    color: Mycolors.TEXT_COLOR,
    paddingLeft: 12,
    paddingRight: 10,
    backgroundColor: Mycolors.LogininputBox,
  },
  root: { padding: 20, minHeight: 300 },
  title: { textAlign: 'center', fontSize: 30 },
  codeFieldRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: {
    width: 55,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Mycolors.LogininputBox,
    borderRadius: 12,
    // borderBottomColor: Mycolors.TEXT_COLOR,
    // borderBottomWidth: 1,
  },
  cellText: {
    color: Mycolors.TEXT_COLOR,
    fontSize: 36,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: '#007AFF',
    borderBottomWidth: 2,
  },
});
export default Login;
