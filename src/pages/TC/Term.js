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
import { FONTFAMILY } from '../../utility/fonts';

const Term = props => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [modleSaveCard, SetModleSaveCard] = useState(false);
  const [modleShippingAddress, SetModleShippingAddress] = useState(false);
  const [pass, setpass] = useState('');

  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');
  const [cardList, setCardList] = useState([
    {
      id: '1',
      img: require('../../assets/Mastercard_logo.png'),
      cardNum: '1111',
      expires: '24/22',
    },
    {
      id: '2',
      img: require('../../assets/visacard_logo.png'),
      cardNum: '5967',
      expires: '04/27',
    },
  ]);

  const [shippingAddress, setShippingAddress] = useState([
    {
      id: '1',
      check: true,
      type: 'Home',
      address: '5331 Rexford Court, Montgomery AL 36116',
    },
    {
      id: '2',
      check: false,
      type: 'Office',
      address: '5331 Rexford Court, Montgomery AL 36116',
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

 

  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <HomeHeader2
          height={60}
          // paddingHorizontal={15}
          title={'Terms and Conditions'}
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
         
          <Text style={{fontFamily:FONTFAMILY,width:'95%',color:'#fff',alignSelf:'center'}}>By accessing and using the PlasmaPen™ website you accept the contents of this Agreement. If you do not agree to the Terms and Conditions of Use for this service, you may not use the PlasmaPen™ website.
We may modify this Agreement at anytime. Any modifications made to this Agreement will be effective immediately upon posting on the site. By accessing the PlasmaPen™ website you agree to be bound by the Terms and Conditions of Use posted on the site at the time of your access or use. You agree to review the Terms and Conditions of Use posted on the PlasmaPen™ website each time you use the PlasmaPen™ website so that you are aware of any modifications made to this Agreement. We reserve the right at any time and from time to time to modify or discontinue, temporarily or permanently the PlasmaPen™ website, or any part thereof, with or without notice.
The PlasmaPen™ website should not be used for emergency or urgent medical issues that require immediate medical attention. In a medical emergency, dial 911 (in the United States) or call or seek care with your local emergency services provider or Emergency Room.
The PlasmaPen™ website is provided by PlasmaPen™ to improve the health care of its members. The website allows members to discuss health issues for free with medical doctors. From the PlasmaPen™ website a member or user can set up and communicate with a doctor on many health issues. Upon connecting with a doctor(s), the doctor(s) will provide medical information on the information that you provide to them. The information provided is to assist you in making a medical decision and should not be used for self-diagnosis or treatment, or as a substitute for professional medical advice from your primary care doctor.
The general information provided on the PlasmaPen™ website is not a substitute for the advice of your personal physician or other qualified health care professional. Always seek the advice of your physician or other qualified health care professional with any questions you may hav</Text>






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
export default Term;
