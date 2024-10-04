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
import {
  all_salon,
  add_booking,
  changePass,
  user_profile,
  home,
  requestGetApi,
  requestPostApi,
  imgUrl,
} from '../../WebApi/Service';
import {useSelector, useDispatch} from 'react-redux';
import Loader from '../../WebApi/Loader';
import Toast from 'react-native-simple-toast';
import MyAlert from '../../component/MyAlert';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import HomeHeader from '../../component/HomeHeader';
import HomeHeader2 from '../../component/HomeHeader2';
import TextInputArea from '../../component/TextInputArea';
import {MyIcon} from '../../utility/index';
import TextInputArea2 from '../../component/TextInputArea2';

const NotificationsSetting = props => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [modleSaveCard, SetModleSaveCard] = useState(false);
  const [modleShippingAddress, SetModleShippingAddress] = useState(false);
  const [pass, setpass] = useState('');

  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');
  

  const [data, setData] = useState([
    {
      id: '1',
       msg:"Receive an email when someone replies to my discussion",
    },
    {
      id: '2',
      msg:'Receive All App Notifications',
    },
  ]);

  useEffect(() => {}, []);

  const resetStacks = page => {
    props.navigation.reset({
      index: 0,
      routes: [{name: page}],
      params: {resentotp: false},
    });
  };

  const logoutPressed = () => {
    AsyncStorage.clear();
    dispatch(onLogoutUser());
  };

  const Mydesign = (img, lbl, press) => {
    return (
      <View style={{height: 60, justifyContent: 'center'}}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={press}>
          <Image
            source={img}
            style={{width: 20, height: 21, alignSelf: 'center'}}></Image>
          <Text
            style={{
              color: Mycolors.TEXT_COLOR,
              marginLeft: 23,
              fontWeight: '500',
              fontSize: 16,
            }}>
            {lbl}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <HomeHeader2
          height={60}
          // paddingHorizontal={15}
          title={'Notification Settings'}
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
        <ScrollView>
          <View
            style={{
              justifyContent: 'center',
              width: '90%',
              alignSelf: 'center',
              marginTop: 20,
            }}>
           
              <Text  style={{fontFamily:FONTFAMILY,
                  color: Mycolors.BG_COLOR,
                  fontWeight: '500',
                  fontSize: 18,
                }}>
                My courses
              </Text>
              
            {data.map((item, index) => {
              return (
                <>
                  <TouchableOpacity
                    key={index}
                    style={{
                      width: '100%',
                      borderColor: Mycolors.GrayColor,
                      borderWidth: 0.02,
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 17,
                      paddingHorizontal: 17,
                      borderRadius: 7,
                      backgroundColor: '#fff',
                      marginTop: 15,
                      justifyContent: 'space-between',
                    }}
                    onPress={() => {}}>
                    <View style={{width: 30, height: 30}}>
                    <Image resizeMode='contain'
                        source={require('../../assets/tick-square.png')}
                        style={{
                          width: '100%',
                          height: '100%',
                          alignSelf: 'center',
                          borderRadius: 5,
                           
                        }}/>
                    </View>
                    <View style={{marginLeft: 0, width: '85%'}}>
                      <Text
                        style={{fontFamily:FONTFAMILY,
                          color: Mycolors.TEXT_COLOR,
                          fontWeight: '300',
                          fontSize: 14,
                        }}>
                        {item.msg}
                      </Text>
 
                    </View>
                     
                  </TouchableOpacity>
                </>
              );
            })}
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
export default NotificationsSetting;
