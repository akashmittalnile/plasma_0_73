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
  TouchableOpacity,ImageBackground
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
import { WebView } from 'react-native-webview';
import { FONTFAMILY } from '../../utility/fonts';

const Quiz = props => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [modleSaveCard, SetModleSaveCard] = useState(false);
  const [modleShippingAddress, SetModleShippingAddress] = useState(false);
  const [pass, setpass] = useState('');

  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');
  
  
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
          title={'Quiz'}
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
         
        <ImageBackground style={{ height: 200, width: '100%', borderTopLeftRadius: 7, borderTopRightRadius: 7,  overflow: 'hidden' }} resizeMode='stretch' source={require("../../assets/Rectangle1036.png")}>
                    
                    </ImageBackground>
  
                    <View style={{ width: '100%',   padding: 10 }}>
                      <Text style={{fontFamily:FONTFAMILY, fontSize: 15, color: "#fff", padding: 5,lineHeight:19 }}>The Science Behind Healthy Skin: Debunking Common Skincare Myths</Text>
  
                      <View style={{ flexDirection: "row" ,width:dimensions.SCREEN_WIDTH*95/100}}>
                        <View style={{flexDirection:'row',width:120,marginRight:5}}>
                          <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#fff", paddingVertical: 4, marginLeft:4 }}>By-</Text>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#B357C3", paddingVertical: 4, }}>PlasmaPen UK</Text>
  
                        </View>
                      
                        <View style={{ flexDirection: "row", padding: 4, marginLeft: 10 }}>
                          <Image style={{ height: 18, width: 18, marginTop: -1,tintColor:'#fff' }} source={require("../../assets/calendar.png")}></Image>
                          <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#B357C3",marginLeft:3 }}>Apr 30,2024</Text>
                        </View>
  
                        <TouchableOpacity style={{ height: 23,  backgroundColor: "transparent", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginLeft: 10,paddingHorizontal:10}}>
                          <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#B357C3", textAlign: "center" }}>Skin care tips</Text>
                        </TouchableOpacity>
  
  
                      </View>
  
                      <View style={{  }}>
  
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#fff", marginTop: 5, marginLeft: 10 }}>Skincare is not just about looking good, it’s about caring for the health and wellbeing of your skin. Today, information about skincare is readily available online, but it’s not always accurate. With a quick search on social media, you can find posts detailing the best products for your skin, and hacks to ensure that your skin is always looking flawless. But, there’s no guarantee that this information is anything more than a common myth. It’s important to debunk skincare myths, as misinformation can lead to ineffective routines, wasted money on products that don’t work, and even damage to your skin.</Text>
                        {/* <WebView
                      originWhitelist={['*']}
                    source={{ html: '<p>Skincare is not just about looking good, it’s about caring for the health and wellbeing of your skin. Today, information about skincare is readily available online, but it’s not always accurate. With a quick search on social media, you can find posts detailing the best products for your skin, and hacks to ensure that your skin is always looking flawless. But, there’s no guarantee that this information is anything more than a common myth. It’s important to debunk skincare myths, as misinformation can lead to ineffective routines, wasted money on products that don’t work, and even damage to your skin. </p>' }}
                    />    */}
  

                      </View>
  
                    </View>
          
          <View>
         <WebView
        // originWhitelist={['*']}
        source={{ html: '<h1>Hello world</h1>' }}
        />   
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
export default Quiz;
