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
  Keyboard, FlatList,
  TouchableOpacity, ImageBackground, Dimensions
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
import { imgUrl } from '../../WebApi/Service';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../WebApi/Loader';
import Toast from 'react-native-simple-toast';
import MyAlert from '../../component/MyAlert';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import HomeHeader from '../../component/HomeHeader';
import HomeHeader2 from '../../component/HomeHeader2';
import { WebView } from 'react-native-webview';
import Pdf from 'react-native-pdf';
import { FONTFAMILY } from '../../utility/fonts';

const DisclaimersPdf = props => {

  console.log("DisclaimersPdf", props?.route?.params?.pdfData);
  const pdfData = props?.route?.params?.pdfData
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [clickedData, setclickedData] = useState(true);
  const [modleShippingAddress, SetModleShippingAddress] = useState(false);
  const [cpage, setcpage] = useState('');
  const [tpage, settpage] = useState('');
  const source = { uri: pdfData};
  // const source = { uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', cache: true };
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');
  const [data, setdata] = useState([
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
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
          title={'PDF'}
          press1={() => {
            props.navigation.goBack();
          }}
          img1={require('../../assets/arrow_right_black.png')}
          img1width={25}
          img1height={25}
          // press2={() => { props.navigation.navigate('Notification') }}
          // img2={require('../../assets/notification.png')}
          // img2width={25}
          // img2height={25}
          // press3={() => { }}
          // img3={require('../../assets/shoppingbag.png')}
          // img3width={25}
          // img3height={25}
          backgroundColor={'transparent'}
        />
        {clickedData != '' ?
          <View style={styles.container2}>
            {/* <View style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30, zIndex: 999, borderRadius: 5, justifyContent: 'center', }}>
              <TouchableOpacity onPress={() => { setclickedData('') }}>
                <Image source={require('../../assets/crossed.png')} style={{ height: 25, width: 25, alignSelf: 'center' }}></Image>
              </TouchableOpacity>
            </View> */}
            <Pdf
              source={source}
              onLoadComplete={(numberOfPages, filePath) => {
                settpage(numberOfPages)
                console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                setcpage(page)
                console.log(`Current page: ${page}`);
              }}
              onError={(error) => {
                console.log(error);
              }}
              onPressLink={(uri) => {
                console.log(`Link pressed: ${uri}`);
              }}
              style={styles.pdf} />
            <View style={{ position: 'absolute', bottom: 40, height: 30, zIndex: 999, borderRadius: 5, justifyContent: 'center', }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%', alignSelf: 'center' }}>
                <Text style={{fontFamily:FONTFAMILY, color: '#000', fontSize: 14, fontWeight: '700' }}>{cpage} of {tpage}</Text>

                <View style={{ flexDirection: 'row', top: -10 }}>
                  {/* <TouchableOpacity onPress={() => { setclickedData('') }} style={{ backgroundColor: '#B357C3', borderRadius: 5, padding: 4 }}>
                    <Image source={require('../../assets/import.png')} style={{ height: 25, width: 25, alignSelf: 'center' }}></Image>
                  </TouchableOpacity> */}
                  {/* 
       <TouchableOpacity onPress={()=>{setclickedData('')}} style={{backgroundColor:'#B357C3',borderRadius:5,padding:4}}>
       <Image source={require('../../assets/crossed.png')} style={{height:25,width:25,alignSelf:'center'}}></Image>
       </TouchableOpacity>
       */}

                </View>
              </View>
            </View>
          </View>
          :
          // <ScrollView>

          //   <ImageBackground style={{ height: 200, width: '100%', borderTopLeftRadius: 7, borderTopRightRadius: 7, overflow: 'hidden' }} resizeMode='stretch' source={require("../../assets/Rectangle1036.png")}>

          //   </ImageBackground>

          //   <View style={{ width: '100%', padding: 10 }}>
          //     <Text style={{fontFamily:FONTFAMILY, fontSize: 16, color: "#fff", padding: 5, lineHeight: 19, fontWeight: '600' }}>About: Accessories & Consumables</Text>
          //     <View style={{ flexDirection: 'row', marginTop: 5 }}>
          //       <Text style={{fontFamily:FONTFAMILY, fontSize: 18, color: "#fff", lineHeight: 19, fontWeight: '700' }}>2</Text>
          //       <Text style={{fontFamily:FONTFAMILY, fontSize: 18, color: "#B357C3", lineHeight: 19, fontWeight: '700' }}>/18</Text>
          //     </View>


          //     <View style={{ width: '100%', height: 40, justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
          //       <TouchableOpacity style={{ height: 35, justifyContent: 'center', backgroundColor: '#fff', borderRadius: 5, width: '32%' }}>
          //         <Text style={{fontFamily:FONTFAMILY, textAlign: 'center', color: '#4556A6', fontSize: 12, fontWeight: '600' }}>Course List</Text>
          //       </TouchableOpacity>
          //       <TouchableOpacity style={{ height: 35, justifyContent: 'center', backgroundColor: '#fff', borderRadius: 5, width: '32%' }}>
          //         <Text style={{fontFamily:FONTFAMILY, textAlign: 'center', color: '#4556A6', fontSize: 12, fontWeight: '600' }}>Mark incomplete</Text>
          //       </TouchableOpacity>
          //       <TouchableOpacity style={{ height: 35, justifyContent: 'center', backgroundColor: '#fff', borderRadius: 5, width: '32%' }}>
          //         <Text style={{fontFamily:FONTFAMILY, textAlign: 'center', color: '#4556A6', fontSize: 12, fontWeight: '600' }}>Continue</Text>
          //       </TouchableOpacity>
          //     </View>


          //     <View style={{ marginTop: 10, }}>
          //       <FlatList
          //         data={data}
          //         showsHorizontalScrollIndicator={false}
          //         renderItem={({ item, index }) => {
          //           return (
          //             <TouchableOpacity style={{ flexDirection: "row", width: dimensions.SCREEN_WIDTH * 95 / 100, alignSelf: 'center', marginTop: 5, backgroundColor: '#fff', borderRadius: 7, padding: 10, alignItems: 'center', justifyContent: 'space-between' }}
          //               onPress={() => { setclickedData(item) }}>
          //               <View style={{ flexDirection: "row", }}>
          //                 <Image style={{ height: 35, width: 35, borderRadius: 22, top: 5 }} source={require("../../assets/Rectangle104.png")}></Image>
          //                 <View style={{ marginLeft: 15 }}>

          //                   <View style={{ width: dimensions.SCREEN_WIDTH * 70 / 100 }}>
          //                     <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000", marginVertical: 5 }}>Course Successfully Purchesed!</Text>
          //                   </View>
          //                   <View style={{ flexDirection: "row" }}>
          //                     <Image style={{ height: 15, width: 15, borderRadius: 7 }} source={require("../../assets/TImezone_clock.png")}></Image>
          //                     <Text style={{fontFamily:FONTFAMILY, fontSize: 10, color: "#000", marginLeft: 5 }}>01:25</Text>
          //                   </View>
          //                 </View>
          //               </View>
          //               <Image style={{ height: 20, width: 20, }} source={index == 1 ? require("../../assets/play.png") : require("../../assets/verify.png")}></Image>

          //             </TouchableOpacity>

          //           )
          //         }}
          //         keyExtractor={item => item.id}
          //       />
          //     </View>

          //   </View>

          // </ScrollView>
          <></>
        }
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
  container2: {
    // position:'absolute',
    // zIndex:999,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
});
export default DisclaimersPdf;
