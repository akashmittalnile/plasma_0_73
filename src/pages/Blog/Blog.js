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
import useAPI from '../../utility/hooks/useAPI';
import { sliceTitle } from '../../utility/MyFunctions';
import { FONTFAMILY } from '../../utility/fonts';
import NoDataFound, { NoDataFoundModule } from '../../component/NoDataFound';

const Blog = props => {
  const dispatch = useDispatch();


  const [modleSaveCard, SetModleSaveCard] = useState(false);
  const [modleShippingAddress, SetModleShippingAddress] = useState(false);
  const [pass, setpass] = useState('');

  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');
  const [select1, setselect1] = useState('')
  const [select2, setselect2] = useState('')
  const [data, setdata] = useState([])

  const { getAPI, loading } = useAPI()

  const searchBlog = async (searchVal = '') => {

    const res = await getAPI({ endPoint: "blogs" + '?search=' + searchVal })
    if (res) {
      setdata(res?.data)
    }


  }


  useEffect(() => {

    searchBlog('')

  }, []);



  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <HomeHeader2
          height={60}
          // paddingHorizontal={15}
          title={'Blogs'}
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
        <MySearchBar placeHolder={'Blogs'} onSearchSubmit={(text) => {searchBlog(text) }} />
        <ScrollView>


          {/* ****************************Trcourse type****************** */}




          <View style={{ marginTop: 10, }}>
            <FlatList
              data={data}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => {
                const { id,
                  title,
                  description,
                  views,
                  status,
                  created_by,
                  updated_at,
                  images } = item
                return (



                  <TouchableOpacity key={id} style={{ width: dimensions.SCREEN_WIDTH * 95 / 100, alignSelf: 'center', marginTop: 15 }}
                    onPress={() => { props.navigation.navigate('BlogDetails', {blogID: id}) }}>
                    <ImageBackground style={{ height: 170, width: '100%', borderTopLeftRadius: 7, borderTopRightRadius: 7, overflow: 'hidden' }} resizeMode='stretch' source={{uri: images[0].image}}>

                    </ImageBackground>

                    <View style={{ width: '100%', backgroundColor: '#fff', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, padding: 10 }}>
                      <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000", padding: 5, lineHeight: 19, fontFamily:FONTFAMILY }}>{title}</Text>

                      <View style={{ flexDirection: "row", width: dimensions.SCREEN_WIDTH * 95 / 100 }}>
                        <View style={{ flexDirection: 'row', width: 120, marginRight: 5 }}>
                          <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#000", paddingVertical: 4, marginLeft: 4, fontFamily:FONTFAMILY }}>By-</Text>
                          <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#B357C3", paddingVertical: 4, fontFamily:FONTFAMILY }}>{created_by}</Text>

                        </View>

                        <View style={{ flexDirection: "row", padding: 4, marginLeft: 10 }}>
                          <Image style={{ height: 18, width: 18, marginTop: -1 }} source={require("../../assets/calendar.png")}></Image>
                          <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#B357C3", marginLeft: 3 , fontFamily:FONTFAMILY}}>{updated_at.split(" ")[0]}</Text>
                        </View>

                        <TouchableOpacity style={{ height: 23, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginLeft: 10, paddingHorizontal: 10 }}>
                          <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#B357C3", textAlign: "center", fontFamily:FONTFAMILY }}>Skin care tips</Text>
                        </TouchableOpacity>


                      </View>

                      <View style={{}}>

                        <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#292D32", marginTop: 5, marginLeft: 10, fontFamily:FONTFAMILY }}>{sliceTitle(description, 200)}</Text>

                      </View>

                    </View>

                  </TouchableOpacity>

                )
              }}
              keyExtractor={item => item.id}
              ListEmptyComponent={<NoDataFoundModule styles={{marginTop: '42%'}}/>}
            />
          </View>



          <View style={{ width: 200, height: 100 }} />

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
export default Blog;
