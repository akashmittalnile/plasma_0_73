import React, {useState, useEffect} from 'react';
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
  KeyboardAvoidingView,
} from 'react-native';
import MyButtons from '../../component/MyButtons';
import MyInputText from '../../component/MyInputText';
import {dimensions, Mycolors} from '../../utility/Mycolors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import {saveUserResult, saveUserToken} from '../../redux/actions/user_action';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {baseUrl, forgotpass, requestPostApi,} from '../../WebApi/Service';
import Loader from '../../WebApi/Loader';
import Toast from 'react-native-simple-toast';
import MyAlert from '../../component/MyAlert';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
// import DropDownPicker from 'react-native-dropdown-picker';
import {CallingCodePicker} from '@digieggs/rn-country-code-picker';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import DatePicker from 'react-native-datepicker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
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
import { FONTFAMILY } from '../../utility/fonts';

const ForgotPassword = props => {
  // variables : state
  const [email, setemail] = useState('');
  const [pass, setpass] = useState('');
  const [loading, setLoading] = useState(false);
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');

  const Validation = () => {
    var EmailReg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var nameReg = /[^a-zA-Z- ]/g;
    var OneDecimalPoint = /^(\d*)\.{0,1}(\d){0,1}$/;
     if(email == '' || email.trim().length == 0){
      Toast.show('Please Enter Email');
      return false
    }else if(!EmailReg.test(email)){
      Toast.show('Please Enter Valid Email');
      return false
    }else{
    return true
    }
   
  };

  const ResetPressed = async () => {
   
    if (Validation()){
     //  props.navigation.navigate('Otp');
      setLoading(true);
      let formdata = new FormData();
      
      formdata.append('email', email);
      formdata.append('password', pass);
       

      const {responseJson, err} = await requestPostApi(
        forgotpass,
        formdata,
        'POST',
        '',
      );
      setLoading(false);
      console.log('the res==>>', responseJson);
      if (err == null) {
        if (responseJson.status) {
          console.log({"ResetPressed":responseJson});
          props.navigation.navigate('Otp',{otp:responseJson.data.otp,email:email});

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





  //UI
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        resizeMode="stretch"
        style={{height: 500}}
        source={require('../../assets/LoginImage2.png')}>
        <AuthHeader
          height={60}
          paddingHorizontal={15}
          press1={() => {
            props.navigation.goBack();
          }}
          img1={require('../../assets/arrow.png')}
          img1width={40}
          img1height={40}
          Text1={'Forgot Password'}
          backgroundColor={'transparent'}
        />
      </ImageBackground>
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
            style={{height: '100%', width: '100%'}}
          />
        </View>
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              height: 420,

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
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                resizeMode="contain"
                source={require('../../assets/Forgot_psswd_icon.png')}
                style={{height: 150, width: 150}}
              />
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '90%',
                marginHorizontal: 20,
              }}>
              <Text  style={{fontFamily:FONTFAMILY,
                  color: Mycolors.Black,
                  fontSize: 30,
                  fontWeight: '700', fontFamily:FONTFAMILY
                }}>
                Forgot Password?{' '}
              </Text>
              <Text  style={{fontFamily:FONTFAMILY,
                  color: Mycolors.Black,
                  fontSize: 14,
                  fontWeight: '400',
                  textAlign: 'center', fontFamily:FONTFAMILY
                }}>
                We Will Send An 4 Digit OTP In Your Registered
              </Text>
            </View>
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
            </View>

            <MyButtons
              title="Send OTP"
              height={60}
              width={'100%'}
              borderRadius={5}
              fontWeight={'700'}
              alignSelf="center"
              press={() => {
                ResetPressed()
                
              }}
              marginHorizontal={20}
              titlecolor={Mycolors.BG_COLOR}
              backgroundColor={Mycolors.Purple}
              marginVertical={10}
            />
          </View>
          <View style={{width: 20, height: 100}}></View>
        </ScrollView>
        </KeyboardAvoidingView>
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
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
export default ForgotPassword;
