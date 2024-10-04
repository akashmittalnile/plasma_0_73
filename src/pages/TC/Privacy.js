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

const Privacy = props => {
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
          title={'Privacy policy'}
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
         
          
        <Text style={{fontFamily:FONTFAMILY,width:'95%',color:'#fff',alignSelf:'center'}}>This privacy notice for Plasma Pen Ltd ('Company', 'we', 'us', or 'our',), describes how and why we might collect, store, use, and/or share ('process') your information when you use our services ('Services'), such as when you:Visit our website at http://plasmapenuk.com, or any website of ours that links to this privacy notice Engage with us in other related ways, including any sales, marketing, or eventsQuestions or concerns? Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at info@plasmapenuk.com.</Text>
<Text style={{fontFamily:FONTFAMILY,width:'95%',color:'#fff',alignSelf:'center'}}>This summary provides key points from our privacy notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for. You can also click here to go directly to our table of contents.What personal information do we process? When you visit, use, or navigate our Services, we may process personal information depending on how you interact with Plasma Pen Ltd and the Services, the choices you make, and the products and features you use. Click here to learn more.Do we process any sensitive personal information? We do not process sensitive personal information.Do we receive any information from third parties? We do not receive any information from third parties.How do we process your information? We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud </Text>







          
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
export default Privacy;
