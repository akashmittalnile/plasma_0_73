import React, { useState, useEffect } from 'react';
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
  TouchableOpacity, FlatList, ImageBackground
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
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../WebApi/Loader';
import Toast from 'react-native-simple-toast';
import MyAlert from '../../component/MyAlert';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import HomeHeader from '../../component/HomeHeader';
import HomeHeader2 from '../../component/HomeHeader2';
import TextInputArea from '../../component/TextInputArea';
import { MyIcon } from '../../utility/index';
import TextInputArea2 from '../../component/TextInputArea2';
import MySearchBar from '../../component/MySearchBar';
import { FONTFAMILY } from '../../utility/fonts';

const Community = props => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [modleSaveCard, SetModleSaveCard] = useState(false);
  const [modleShippingAddress, SetModleShippingAddress] = useState(false);
  const [pass, setpass] = useState('');

  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');
  const [data, setdata] = useState([
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'Cricket',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'CoolJet',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Plasma Pen',
    },
  ])


  useEffect(() => { }, []);

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



  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <HomeHeader2
          height={60}
          // paddingHorizontal={15}
          title={'Community'}
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

        <MySearchBar placeHolder={'Search by community'} />
        <ScrollView>

          <View style={{ marginTop: 10, }}>
            <FlatList
              data={data}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity style={{ width: dimensions.SCREEN_WIDTH * 95 / 100, alignSelf: 'center', marginTop: 15 }}
                    onPress={() => { props.navigation.navigate('CommunityDetails') }}>
                    <ImageBackground style={{ height: 170, width: '100%', borderRadius: 7, overflow: 'hidden', alignSelf: 'center' }} resizeMode='stretch' source={require("../../assets/Rectangle.png")}>
                      <View style={{ width: '100%', height: '100%', alignSelf: 'center', padding: 10 }}>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 10, color: '#53045F', fontFamily:FONTFAMILY }}>3 new Post</Text>
                        <View style={{ width: '45%', marginTop: 10 }}>
                          <Text style={{fontFamily:FONTFAMILY, fontSize: 17, color: '#4556A6', fontWeight: '600', lineHeight: 23, fontFamily:FONTFAMILY }}>The new home of cooljet</Text>
                          <View style={{ width: 100, height: 27, backgroundColor: '#000', justifyContent: 'center', borderRadius: 5, marginTop: 10 }}>
                            <Text style={{fontFamily:FONTFAMILY, fontSize: 10, color: '#fff', textAlign: 'center', fontFamily:FONTFAMILY }}>Community</Text>
                          </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>
                          <View style={{ flexDirection: 'row', zIndex: 999 }}>
                            <Image style={{ height: 28, width: 28, }} source={require("../../assets/Rectangle103.png")}></Image>
                            <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "grey", marginTop: 5, marginLeft: 10, fontFamily:FONTFAMILY }}> +1182 anrolled</Text>
                          </View>
                          <Image style={{ height: 15, width: 100, }} source={require("../../assets/Plasmapen_icon.png")}></Image>
                        </View>

                      </View>


                    </ImageBackground>
                  </TouchableOpacity>

                )
              }}
              keyExtractor={item => item.id}
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
export default Community;
