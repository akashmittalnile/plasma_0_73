import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
} from 'react-native';
import MyButtons from '../../component/MyButtons';
import MyInputText from '../../component/MyInputText';
import { dimensions, Mycolors } from '../../utility/Mycolors';
import TextInputArea from '../../component/TextInputArea';
import { useSelector, useDispatch } from 'react-redux';
import { baseUrl, reset_password, requestPostApi } from '../../WebApi/Service';
import Loader from '../../WebApi/Loader';
import Toast from 'react-native-simple-toast';
import MyAlert from '../../component/MyAlert';
import AuthHeader from '../../component/AuthHeader';
import { saveUserResult, saveUserToken } from '../../redux/actions/user_action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FONTFAMILY } from '../../utility/fonts';
const ChangePassword = props => {
  // variables : state
  const dispatch = useDispatch();
  const [pass, setpass] = useState('');
  const [cpass, setcpass] = useState('');
  const [loading, setLoading] = useState(false);
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');
  const Validation = () => {
    if (pass == '' || pass.trim().length == 0) {
      Toast.show('Please Enter Password');
      return false
    } else if (cpass == '' || cpass.trim().length == 0) {
      Toast.show('Please Enter Confirm Password');
      return false
    } else if (cpass != pass) {
      Toast.show('Password and Confirm Password should be same');
      return false
    } else {
      return true
    }

  };
  const resetclicked = async () => {
    // LoginPressed('hi');
    console.log("resetclicked start");
    try {
      if (Validation()) {
        let formdata = new FormData();
        formdata.append("email", props.route.params.email);
        formdata.append("otp", props.route.params.otp);
        formdata.append("password", pass);
        setLoading(true)
        const { responseJson, err } = await requestPostApi(reset_password, formdata, 'POST', '')
        setLoading(false)
        if (err == null) {
          if (responseJson.status) {
            // props.navigation.navigate('Welcome');
            // return
            AsyncStorage.setItem("plasmapen", JSON.stringify(responseJson?.data));
            dispatch(saveUserResult(responseJson?.data))
            dispatch(saveUserToken(responseJson?.data?.access_token))
          } else {
            Toast.show(responseJson.message);
          }
        } else {
          setalert_sms(err)
          setMy_Alert(true)
        }
      }
    } catch (error) {
      console.log("resetclicked", error);
    } finally {
      setLoading(false)
      console.log("resetclicked finally",);
    }
  };


  //UI
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        resizeMode="stretch"
        style={{ height: 500 }}
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
          Text1={'Change Password'}
          backgroundColor={'transparent'}
        />
      </ImageBackground>
      <View
        style={{
          height: dimensions.SCREEN_HEIGHT,
          position: 'absolute',
          width: '100%',
          borderRadius: 15,
          alignSelf: 'center',
          top: '31%',

        }}>
        <View
          style={{
            height: 40,
            width: '78%',
            marginHorizontal: 50,
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
              height: 480,
              width: '90%',
              marginHorizontal: 20,
              backgroundColor: Mycolors.BG_COLOR,
              borderRadius: 15,
              alignSelf: 'center',
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
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image
                resizeMode="contain"
                source={require('../../assets/Chnage_psswd_icon.png')}
                style={{ height: 150, width: 150 }}
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
                }}>Change Password</Text>
              <Text  style={{fontFamily:FONTFAMILY,
                  color: Mycolors.Black,
                  fontSize: 14,
                  fontWeight: '400',
                  textAlign: 'center', fontFamily:FONTFAMILY
                }}>
                Please Create New Login Password
              </Text>
            </View>
            <View
              style={{
                marginTop: 25,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
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
            </View>
            <View
              style={{
                marginTop: 4,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
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
            </View>

            <MyButtons
              title="Change Password"
              height={60}
              width={'100%'}
              borderRadius={5}
              fontWeight={'700'}
              alignSelf="center"
              press={() => {
                resetclicked()
              }}
              marginHorizontal={20}
              titlecolor={Mycolors.BG_COLOR}
              backgroundColor={Mycolors.Purple}
              marginVertical={10}
            />
          </View>
          <View style={{ width: 20, height: 100 }}></View>
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
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
export default ChangePassword;
