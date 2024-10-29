// import { FONTFAMILY } from '../utility/fonts';
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
  follow_unfollow,
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
import useHideBottomTab from '../../utility/hooks/useHideBottomTab';
import { reloadCommunity } from '../../redux/reduxSlices/communitySlice'
import NoDataFound, { NoDataFoundModule } from '../../component/NoDataFound';
import { Pages } from 'react-native-pages';
import { FONTFAMILY, FONTFAMILYSEMIBOLD } from '../../utility/fonts';

const BlogDetails = props => {
  const dispatch = useDispatch();
  // const [loading, setLoading] = useState(false);

  const [modleSaveCard, SetModleSaveCard] = useState(false);
  const [modleShippingAddress, SetModleShippingAddress] = useState(false);
  const [pass, setpass] = useState('');

  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');

  const [data, setdata] = useState()

  // useHideBottomTab()

  const { getAPI, loading, postAPI } = useAPI()

  const updateCommunity = useSelector(state => state.community.updateCommunity);

  const communityID = props.route.params.communityID;
  console.log("props.route", props.route.params);
  console.log({ updateCommunity });

  async function getCommunityDetails() {


    const res = await getAPI({ endPoint: `community-details/${communityID}` })
    if (!res) {
      return
    }

    setdata(res?.data)



  }

  const toggleFollow = async (status) => {

    await postAPI({
      endPoint: follow_unfollow, bodyJSON: {
        id: 1,
        status: status
      }
    })
    // getCommunityDetails()
    dispatch(reloadCommunity())



  }

  useEffect(() => {

    getCommunityDetails()

  }, [updateCommunity]);

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
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1, padding: 5 }}>
      <SafeAreaView style={{ flex: 1, }}>
        <HomeHeader2
          height={60}
          // paddingHorizontal={15}
          title={'Community Details'}
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
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => {
                getCommunityDetails()
              }} />}
          style={{ width: (dimensions.SCREEN_WIDTH), alignSelf: 'center' }}>

          <View style={{ height: 230, width: dimensions.SCREEN_WIDTH }}>
            <Pages>

              {data?.images?.map((item, index) => <ImageBackground style={{
                height: 220, width: dimensions.SCREEN_WIDTH,
                // borderRadius: 7,
                borderTopLeftRadius: 7, borderTopRightRadius: 7,
                overflow: 'hidden', resizeMode: 'stretch', alignSelf: 'center'
              }} resizeMode='stretch'
                // source={require("../../assets/Rectangle1047.png")}
                source={{ uri: item?.image }}
              // source={{ uri: 'https://www.niletechinnovations.com/projects/plasmapen/public/uploads/product/Copy-of-Plasma-Pen-Classic-Render-009.webp' }}
              >

              </ImageBackground>

              )}


            </Pages>
          </View>
          
          <View style={{ width: '100%', padding: 10, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 16, color: "#fff", padding: 5, lineHeight: 24, fontWeight: '600', fontFamily:FONTFAMILYSEMIBOLD }}>{data?.name}</Text>

            <View style={{ flexDirection: "row", width: dimensions.SCREEN_WIDTH * 95 / 100, marginVertical: 5 }}>
              <View style={{ flexDirection: 'row', width: 120, marginRight: 5 }}>
                <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 14, color: "#fff", paddingVertical: 4, marginLeft: 4, fontFamily:FONTFAMILYSEMIBOLD }}>By- </Text>
                <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 14, color: "#B357C3", paddingVertical: 4, fontFamily:FONTFAMILYSEMIBOLD }}>{data?.created_by}</Text>

              </View>

              <View style={{ flexDirection: "row", padding: 4, marginLeft: 10 }}>
                <Image style={{ height: 19, width: 19, marginTop: -1, tintColor: '#fff' }} source={require("../../assets/calendar.png")}></Image>
                <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 14, color: "#B357C3", marginLeft: 3 , fontFamily:FONTFAMILYSEMIBOLD}}> {data?.updated_at.split(" ")[0]}</Text>
              </View>

              <TouchableOpacity style={{ height: 23, backgroundColor: "transparent", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginLeft: 10, paddingHorizontal: 10 }}>
                <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#B357C3", textAlign: "center", fontFamily:FONTFAMILY }}>Skin care tips</Text>
              </TouchableOpacity>


            </View>

            <View style={{}}>

              <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#fff", marginTop: 5, marginLeft: 10 , fontFamily:FONTFAMILY}}>{data?.description}</Text>
              {/* <WebView
                      originWhitelist={['*']}
                    source={{ html: '<p>Skincare is not just about looking good, it’s about caring for the health and wellbeing of your skin. Today, information about skincare is readily available online, but it’s not always accurate. With a quick search on social media, you can find posts detailing the best products for your skin, and hacks to ensure that your skin is always looking flawless. But, there’s no guarantee that this information is anything more than a common myth. It’s important to debunk skincare myths, as misinformation can lead to ineffective routines, wasted money on products that don’t work, and even damage to your skin. </p>' }}
                    />    */}


            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 0,
              gap: 20,
              width: '100%',
              height: 38,
              marginTop: 10
              // backgroundColor: 'blue'
            }}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: data?.created_by_profile }} style={{
                  width: 32, // Adjust for potential rounding differences
                  height: 32, borderRadius: 100
                }} />
                <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 15, color: "#fff", padding: 5, lineHeight: 24, fontWeight: '600', marginLeft: 5 , fontFamily:FONTFAMILYSEMIBOLD}}>{data?.community_follower} Followers</Text>
              </View>
              <TouchableOpacity onPress={() => toggleFollow(data?.is_followed ? 0 : 1)} style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                // padding: 5, // Use a single value for uniform padding
                // gap: 7,
                margin: '0 auto', // Center the view horizontally
                width: 94,
                height: 38,
                backgroundColor: '#B357C3',
                borderRadius: 5,
                shadowColor: '#23356F', // Extracted from box-shadow
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 13,
              }}>
                <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 15, color: "#fff", padding: 5, lineHeight: 24, fontFamily:FONTFAMILYSEMIBOLD }}>{data?.is_followed ? 'Unfollow' : 'Follow'}</Text>
              </TouchableOpacity>
            </View>

          </View>

          <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 15, color: "#fff", padding: 5, lineHeight: 24, fontWeight: '600', marginLeft: 5, fontFamily:FONTFAMILYSEMIBOLD }}>Posts</Text>

          {data?.posts?.map((item, index) => {

            console.log(item?.is_like);

            return <>
              <TouchableOpacity onPress={() => props.navigation.navigate("PostDetails", { postID: item?.id })} key={index} style={{ width: '95%', backgroundColor: 'white', borderRadius: 10, justifyContent: 'space-evenly', alignItems: 'center', marginBottom: 40, alignSelf: 'center' }}>

                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 10, height: 50, }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: 30, height: 30, borderRadius: 25 }} source={{ uri: item?.created_by_profile }} />

                    <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 13, color: "#262626", fontWeight: '500', marginLeft: 3, fontFamily:FONTFAMILYSEMIBOLD }}> {item?.created_by}</Text>
                  </View>


                  <View style={{ flexDirection: "row", padding: 4, marginLeft: 10 }}>
                    {/* <Image style={{ height: 18, width: 18, marginTop: -1, tintColor: 'grey' }} source={require("../../assets/calendar.png")}></Image> */}
                    <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 13, color: "grey", fontFamily:FONTFAMILYSEMIBOLD }}> {item?.updated_at}</Text>
                    <Image style={{ height: 18, width: 18, marginTop: -1, tintColor: 'grey', marginLeft: 3 }} source={require("../../assets/calendar.png")}></Image>
                  </View>

                </View>

                <Image style={{ width: '100%', height: 220, }} source={{ uri: item.images[0].image }} />

                <View style={{ alignSelf: 'flex-start', padding: 10 }}>

                  <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 13, color: "grey", color: "#262626", fontWeight: '500', fontFamily:FONTFAMILYSEMIBOLD }}> {item?.title}</Text>
                  <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "grey", color: "#262626", marginTop: 2 , fontFamily:FONTFAMILY}}> {item?.description}</Text>
                </View>


                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingVertical: 10 }}>

                  {/* <Image style={{ width: 40, height: 40, borderRadius: 25 }} source={{ uri: item.created_by_profile }} /> */}

                  <TouchableOpacity disabled style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: '#B357C3', paddingHorizontal: 8, paddingVertical: 5, marginRight: 20 }}>
                    <Image style={{ width: 18, height: 18, tintColor: "white" }} source={{ uri: item?.is_like ? "https://cdn-icons-png.flaticon.com/128/1077/1077035.png" : 'https://cdn-icons-png.flaticon.com/512/1077/1077086.png' }} />
                    <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 13, color: "white", marginLeft: 3, fontFamily:FONTFAMILYSEMIBOLD }}> {item?.like_count} Likes</Text>
                  </TouchableOpacity>


                  <TouchableOpacity disabled style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: '#B357C3', paddingHorizontal: 8, paddingVertical: 5 }}>
                    <Image style={{ width: 18, height: 18, tintColor: "white" }} source={{ uri: true ? "https://cdn-icons-png.flaticon.com/512/1380/1380338.png" : 'https://cdn-icons-png.flaticon.com/512/1381/1381635.png' }} />
                    <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 13, color: "white", marginLeft: 3, fontFamily:FONTFAMILYSEMIBOLD }}> {item?.comment_count} Comments</Text>
                  </TouchableOpacity>
                </View>



              </TouchableOpacity>
            </>
          }
          )}

          <View style={{ height: 50 }} />
          {data?.posts?.length < 1 && <NoDataFoundModule />}


          {/* <View>
            <WebView
              // originWhitelist={['*']}
              source={{ html: '<h1>Hello world</h1>' }}
            />
          </View> */}


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
