
import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Text, StyleSheet, SafeAreaView, ImageBackground, TextInput, Linking, BackHandler, FlatList, TouchableOpacity, Platform, Alert, PermissionsAndroid, ScrollView, StatusBar } from 'react-native';
import { Mycolors, dimensions } from '../../utility/Mycolors';
import LinearGradient from 'react-native-linear-gradient'
import MyButtons from '../../component/MyButtons';
import { Rating } from 'react-native-ratings';
import { ImageSlider, ImageCarousel } from "react-native-image-slider-banner";
import { home, imgUrl, facilities, favorite, current_salon_by_hairdresser, all_services, requestGetApi, requestPostApi } from '../../WebApi/Service';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../WebApi/Loader';
import { saveUserResult, onLogoutUser, saveSelectedHairdresser, saveSeviceNavigation, saveSelectedService, saveSaloonDetails, saveUserToken, } from '../../redux/actions/user_action';
import MySearchBar from '../../component/MySearchBar';
import HomeHeader2 from '../../component/HomeHeader2';
// import Video, {VideoRef} from 'react-native-video';
import Video from 'react-native-video';
import TextInputArea from '../../component/TextInputArea';
import useAPI from '../../utility/hooks/useAPI';
import { FONTFAMILY } from '../../utility/fonts';

const Notification = (props) => {
  const [searchValue, setsearchValue] = useState('')
  const [homeData, sethomeData] = useState('')
  const dispatch = useDispatch();
  // const [loading, setLoading] = useState(false)
  const userdetaile = useSelector(state => state.user.user_details)
  const [lod, setlod] = useState(false);
  const [promo, setpromo] = useState('')
  const [select2, setselect2] = useState('')
  const [data, setdata] = useState([])

  const { getAPI, loading, postAPI } = useAPI()

  async function getNotifications() {

    const res = await getAPI({ endPoint: 'notifications' })
    if (!res) {
      return
    }

    setdata(res?.data?.data)


  }

  async function notificationSeen() {

    const res = await postAPI({ endPoint: 'notification-seen', toastEnable:false, loaderOn:false })

    console.log({"notificationSeen": res});
    if (!res) {
      return
    }

  


  }

  useEffect(() => {
    getNotifications()
    notificationSeen()
  }, [])






  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1, }}>
      <SafeAreaView />
      <StatusBar />


      {/* ******************Header******************** */}
      <HomeHeader2
        height={60}
        // paddingHorizontal={15}
        title={'Notifications'}
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

      <ScrollView>
        {data.length > 0 ?
          <View style={{ marginTop: 10, }}>
            <FlatList
              data={data}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {

                const { sender_name,
                  sender_image,
                  title,
                  seen,
                  image,
                  message,
                  type,
                  created_date } = item
                return (
                  <View style={{ flexDirection: "row", width: dimensions.SCREEN_WIDTH * 95 / 100, alignSelf: 'center', marginTop: 15, backgroundColor: '#fff', borderRadius: 7, padding: 10, alignItems: 'center' }}>
                    <Image style={{ height: 40, width: 40, borderRadius: 22 }} source={{uri: sender_image}}></Image>
                    <View style={{ marginLeft: 15 }}>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 11, color: "#000", }}>{sender_name}</Text>
                        {/* <Text style={{fontFamily:FONTFAMILY, fontSize: 11, color: "#B357C3", }}> #5566283hjhgf28</Text> */}
                      </View>
                      <View style={{ width: dimensions.SCREEN_WIDTH * 70 / 100 }}>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000", marginVertical: 5 }}>{message}</Text>
                      </View>
                      <Text style={{fontFamily:FONTFAMILY, fontSize: 10, color: "gray", }}>{created_date}</Text>
                    </View>
                  </View>

                )
              }}
              keyExtractor={item => item.id}
            />
          </View>

          :
          <View style={{ alignSelf: 'center', marginTop: 50 }}>
            <Image style={{ height: 104, width: 150, borderRadius: 22, alignSelf: 'center' }} source={require("../../assets/Group64514.png")}></Image>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#fff", textAlign: 'center', marginTop: 10 }}>No Notification Yet</Text>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#fff", textAlign: 'center', marginTop: 10, width: dimensions.SCREEN_WIDTH * 70 / 100 }}>Stay Connected!  &  Informed with Our Notification Center</Text>
            <TouchableOpacity style={{ width: dimensions.SCREEN_WIDTH * 60 / 100, height: 50, backgroundColor: "#B357C3", borderRadius: 7, marginTop: 40, justifyContent: "center", alignSelf: 'center' }}
              onPress={() => { getNotifications() }}>
              <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#fff", textAlign: "center", fontWeight: "600" }}>Refresh</Text>
            </TouchableOpacity>
          </View>

        }


        {loading ?
          <Loader />
          : null
        }
        <View style={{ width: 50, height: 100 }} />
      </ScrollView>

    </LinearGradient>
  );
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

});
export default Notification