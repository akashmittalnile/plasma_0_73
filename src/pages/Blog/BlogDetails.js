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
  TouchableOpacity, ImageBackground,
  RefreshControl
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
import { WebView } from 'react-native-webview';
import useAPI from '../../utility/hooks/useAPI';
import { Pages } from 'react-native-pages';
import { FONTFAMILY, FONTFAMILYEXTRABOLD, FONTFAMILYSEMIBOLD } from '../../utility/fonts';

const BlogDetails = props => {
  const dispatch = useDispatch();
  // const [loading, setLoading] = useState(false);

  const [modleSaveCard, SetModleSaveCard] = useState(false);
  const [modleShippingAddress, SetModleShippingAddress] = useState(false);
  const [pass, setpass] = useState('');

  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');
  const [data, setdata] = useState({
    "title": "Social Network",
    "description": "Whether you’re starting to notice the fine lines and wrinkles that come with ageing, or you are struggling to hide acne scars, Plasma Pen and CoolJet can help. Though cosmetic surgery is always an option, albeit an invasive and often costly one, Plasma Pen and CoolJet provide non-surgical solutions to many common skin concerns. Non-surgical cosmetic solutions are designed to provide subtle enhancements that look natural, rather than an over the top overhaul to the way that you look. Whether you want to reduce the appearance of wrinkles, fine lines or skin imperfections, non-surgical treatments do so in a natural looking way.",
    "price": null,
    "images": [
      {
        "id": 12,
        "image": "https://www.niletechinnovations.com/projects/plasmapen/public/uploads/blog/75732842-a1d5-422a-bb85-e097b81c11e4.f1703162864_4b32b63c5c28c858e051e9d1a2a717a1.jpg"
      },
      {
        "id": 11,
        "image": "https://www.niletechinnovations.com/projects/plasmapen/public/uploads/blog/depositphotos_59344707-stock-photo-multi-ethnic-crowd.jpg"
      },
      {
        "id": 10,
        "image": "https://www.niletechinnovations.com/projects/plasmapen/public/uploads/blog/istockphoto-839295596-612x612.jpg"
      }
    ],
    "status": "1",
    "created_at": "06-24-2024 11:04AM",
    "updated_at": "06-24-2024 11:04AM"
  })

  const blogID = props.route.params.blogID;
  const { getAPI, loading } = useAPI()


  async function getBlogDetails() {

    const res = await getAPI({ endPoint: `blog-details/${blogID}` })
    if (!res) {
      return
    }

    setdata(res?.data)


  }

  useEffect(() => {
    getBlogDetails()

  }, []);

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
          title={'Blog Details'}
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
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              getBlogDetails()

            }} />}>

          <View style={{ height: 220, width: dimensions.SCREEN_WIDTH }}>
            <Pages>

             {data?.images?.map((item, index)=><ImageBackground key={index} style={{ height: 210, width: dimensions.SCREEN_WIDTH, borderTopLeftRadius: 7, borderTopRightRadius: 7, overflow: 'hidden' }} resizeMode='stretch' source=
                // {require("../../assets/Rectangle1036.png")}
                {{ uri: item.image }}
              >
              </ImageBackground>)} 
              

            </Pages>
          </View>

          <View style={{ width: '100%', padding: 10 }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 16, color: "#fff", padding: 5, lineHeight: 19, fontFamily:FONTFAMILYSEMIBOLD }}>{data?.title}</Text>

            <View style={{ flexDirection: "row", width: dimensions.SCREEN_WIDTH * 95 / 100 }}>
              <View style={{ flexDirection: 'row', width: 120, marginRight: 5 }}>
                <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#fff", paddingVertical: 4, marginLeft: 4, fontFamily:FONTFAMILYSEMIBOLD}}>By- </Text>
                <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 14, color: "#B357C3", paddingVertical: 4, fontFamily:FONTFAMILYSEMIBOLD}}>{data?.created_by}</Text>

              </View>

              <View style={{ flexDirection: "row", padding: 4, marginLeft: 10 }}>
                <Image style={{ height: 19, width: 19, marginTop: -1, tintColor: '#fff' }} source={require("../../assets/calendar.png")}></Image>
                <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 14, color: "#B357C3", marginLeft: 3, fontFamily:FONTFAMILYSEMIBOLD }}>{data?.updated_at.split(" ")[0]}</Text>
              </View>

              <TouchableOpacity style={{ height: 23, backgroundColor: "transparent", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginLeft: 10, paddingHorizontal: 10 }}>
                <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 14, color: "#B357C3", textAlign: "center", fontFamily:FONTFAMILYSEMIBOLD }}>Skin care tips</Text>
              </TouchableOpacity>


            </View>

            <View style={{}}>

              <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#fff", marginTop: 5, marginLeft: 10, fontFamily:FONTFAMILY }}>{data?.description}</Text>
              {/* <WebView
                      originWhitelist={['*']}
                    source={{ html: '<p>Skincare is not just about looking good, it’s about caring for the health and wellbeing of your skin. Today, information about skincare is readily available online, but it’s not always accurate. With a quick search on social media, you can find posts detailing the best products for your skin, and hacks to ensure that your skin is always looking flawless. But, there’s no guarantee that this information is anything more than a common myth. It’s important to debunk skincare myths, as misinformation can lead to ineffective routines, wasted money on products that don’t work, and even damage to your skin. </p>' }}
                    />    */}


            </View>

          </View>

          <View>
            {/* <WebView
        // originWhitelist={['*']}
        source={{ html: '<h1>Hello world</h1>' }}
        />    */}
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
export default BlogDetails;
