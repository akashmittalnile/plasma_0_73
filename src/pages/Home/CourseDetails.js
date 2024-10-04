import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TextInput,
  Linking,
  BackHandler,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
  PermissionsAndroid,
  ScrollView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { Mycolors, dimensions } from '../../utility/Mycolors';
import LinearGradient from 'react-native-linear-gradient';
import MyButtons from '../../component/MyButtons';
import { Rating } from 'react-native-ratings';
import { ImageSlider, ImageCarousel } from 'react-native-image-slider-banner';
import {
  course_details,
  follow_unfollow,
  requestGetApi,
  requestPostApi,
} from '../../WebApi/Service';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../WebApi/Loader';
import {
  saveUserResult,
  onLogoutUser,
  saveSelectedHairdresser,
  saveSeviceNavigation,
  saveSelectedService,
  saveSaloonDetails,
  saveUserToken,
} from '../../redux/actions/user_action';
import MySearchBar from '../../component/MySearchBar';
import HomeHeader2 from '../../component/HomeHeader2';
// import Video, {VideoRef} from 'react-native-video';
import Video from 'react-native-video';
import Toast from 'react-native-simple-toast';
import { addToWishlist, toggleCartAddRemove } from '../../WebApi/GlobalAPICalls';
import { useAddToCartMutation, selectIsLoading, selectHasError } from '../../redux/reduxSlices/cartSlice';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import useHideBottomTab from '../../utility/hooks/useHideBottomTab';
import ReviewRating from '../../component/ReviewRating';
import useAPI from '../../utility/hooks/useAPI';
import { handleShare } from '../../component/ShareComponent';
import { StrikeThough } from '../../utility/FontStyles';
import CircularProgress from '../../component/CircularProgress';
import AddToCartHandleComponent from '../../component/AddToCartHandleComponent';
import NewModal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import RNFetchBlob from 'rn-fetch-blob';
import { FONTFAMILY } from '../../utility/fonts';
import { requestDownloadingPermission } from '../../utility/MyFunctions';
import VideoPlayer from '../../component/VideoPlayer';

const CourseHistory = props => {
  const [searchValue, setsearchValue] = useState('');
  const [homeData, sethomeData] = useState('');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const userdetaile = useSelector(state => state.user.user_details);
  const [lod, setlod] = useState(false);
  const [select1, setselect1] = useState('');
  const [select2, setselect2] = useState('');
  const [pus, setpus] = useState(false)
  const [resData, setresData] = useState('')
  const [defaultRating, setdefaultRating] = useState(0)
  const [defaultReviewText, setdefaultReviewText] = useState('')

  const [data, setdata] = useState([
    {
      id: '1',
      title: 'Dual Tip and Diamond Probes',
    },
    {
      id: '2',
      title: 'Colloidal Silver',
    },
    {
      id: '3',
      title: 'Tinted Aftercare Balm with SPF50',
    },
    {
      id: '4',
      title: 'Advanced Repair Healing Lotion',
    },
    {
      id: '5',
      title: 'Brightening Essence and Cream',
    },
    {
      id: '6',
      title: 'Barrier Film',
    },
    {
      id: '7',
      title: 'Premium Clingfilm',
    },
    {
      id: '8',
      title: 'Clip Cord Covers',
    },
  ]);
  const [data2, setdata2] = useState([
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'defaultReviewText Item',
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
  const [reloadGetAPI, setreloadGetAPI] = useState(false)
  const [completeModal, setcompleteModal] = useState(false)
  const [modalMsg, setModalMsg] = useState("")
  const { getCartList, AddToCartErrorComp, showAddToCartErrorComp, postAPI, deleteAPI } = useAPI()
  const modalRef = useRef(null);

  // const [addToCart, { isLoading, error }] = useAddToCartMutation();
  const isFocused = useIsFocused()
  const courseID = props.route.params.data.id
  const typeID = 1
  // const { 
  //   } = props.route.params
  const cart = useSelector(state => state.cart)

  async function deleteReview(reviewID) {
    setLoading(true)
    const res = await deleteAPI({ endPoint: 'delete-rating?id=' + reviewID })
    setreloadGetAPI((val) => !val)
    setLoading(false)
  }


  const navigation = useNavigation();

  useHideBottomTab()

  function reload() {
    setreloadGetAPI((val) => !val)
  }

  const handleAddToCart = async () => {

    console.log("useAddToCartMutation", useAddToCartMutation.addToCart,
      // cart
    );
    // return
    try {
      await useAddToCartMutation.addToCart({ id: 2, type: 1 });
      // Handle successful addition (e.g., show a success message)
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };


  const getCourseDetail = async () => {

    setLoading(true);
    const { responseJson, err } = await requestGetApi(course_details + courseID, '', 'GET', userdetaile.access_token)

    setLoading(false);
    console.log('the courses data is==>>', responseJson.data.lessons[1]);

    console.log("getCourseDetail", JSON.stringify(responseJson));
    if (err == null) {
      if (responseJson.status) {

        setresData(responseJson.data);
        if (responseJson?.data?.course_status == 2) {
          setModalMsg(responseJson?.data?.course_status_name)
          setcompleteModal(true)
        }


      } else {

      }
    } else {
    }
  };






  useEffect(() => {
    getCourseDetail()
  }, [reloadGetAPI])

  useEffect(() => {
    isFocused && getCourseDetail()
  }, [isFocused])


  useEffect(() => {
    if (isFocused) {
      // setpus(false)
    } else {
      setpus(true)
    }
  }, [isFocused])




  // async function addToWishlist(course, type) {

  //   let formdata = new FormData();
  //   formdata.append('id', course);
  //   formdata.append('type', type);

  //   // setLoading(true);
  //   const { responseJson, err } = await requestPostApi(
  //     "add-wishlist",
  //     formdata,
  //     'POST',
  //     userdetaile.access_token,
  //   );
  //   // setLoading(false);
  //   console.log('The edit profile responce is==>>', responseJson);
  //   if (err == null) {
  //     if (responseJson.status) {
  //       Toast.show(responseJson.message);
  //       // getCourseDetail()
  //     } else {
  //     }
  //   } else {
  //     console.log('The error is==>>', err);
  //   }
  // }

  // const requestDownloadingPermission = async () => {
  //   if (Platform.OS == 'ios') {
  //     downloadInvoice();
  //   } else {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //         {
  //           title: 'Downloading Permission',
  //           message:
  //             'PlasmaPen needs access to your downloading manager ',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         },
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         downloadInvoice();
  //       } else {
  //         console.log('Download permission denied');
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   }

  // };

  const downloadInvoice = async () => {
    // setShowLoader(true);
    setLoading(true)
    console.log('downloadInvoice', resData?.certificate);
    let pdfUrl = resData?.certificate
    let DownloadDir =
      Platform.OS == 'ios'
        ? RNFetchBlob.fs.dirs.DocumentDir
        : RNFetchBlob.fs.dirs.DownloadDir;
    const { dirs } = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const configfb = {
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: 'Arkansas',
      path: `${dirToSave}.pdf`,
    };
    console.log('here');
    const configOptions = Platform.select({
      ios: {
        fileCache: configfb.fileCache,
        title: configfb.title,
        path: configfb.path,
        appendExt: 'pdf',
      },
      android: configfb,
    });
    Platform.OS == 'android'
      ? RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: `${DownloadDir}/.pdf`,
          description: 'Arkansas',
          title: `${orderData?.data?.order_number} invoice.pdf`,
          mime: 'application/pdf',
          mediaScannable: true,
        },
      })
        .fetch('GET', `${pdfUrl}`)
        .then(res => {
          // setShowLoader(false);
          console.log('The file saved to ', res);
          setLoading(false)
        })
        .catch(error => {
          // setShowLoader(false);
          console.error("downloadInvoice", error);
          setLoading(false)
        }).finally(() => {
          setLoading(false)
        })
      : RNFetchBlob.config(configOptions)
        .fetch('GET', `${pdfUrl}`, {})
        .then(res => {
          // setShowLoader(false);
          if (Platform.OS === 'ios') {
            RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
            RNFetchBlob.ios.previewDocument(configfb.path);
          }
          console.log('The file saved to ', res);
          setLoading(false)
        })
        .catch(e => {
          // setShowLoader(false);
          console.log('The file saved to ERROR', e.message);
          setLoading(false)
        }).finally(() => {
          setLoading(false)
        })

  };

  return (
    <>
      <AddToCartErrorComp />
      <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1 }}>
        <SafeAreaView />
        <StatusBar />
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              getCourseDetail()
            }} />}
        >
          {/* ******************Header******************** */}
          <HomeHeader2
            height={60}
            // paddingHorizontal={15}
            title={'Course Details'}
            press1={() => {
              props.navigation.goBack();
            }}
            img1={require('../../assets/arrow_right_black.png')}
            img1width={25}
            img1height={25}
            // press2={() => {
            //   props.navigation.navigate('Notification');
            // }}
            // img2={require('../../assets/notification.png')}
            // img2width={25}
            // img2height={25}
            // press3={() => {
            //   props.navigation.navigate('Cart');
            // }}
            // img3={require('../../assets/shoppingbag.png')}
            // img3width={25}
            // img3height={25}
            backgroundColor={'transparent'}
          />
          {/* <View
            style={{
              width: dimensions.SCREEN_WIDTH - 20,
              height: 220,
              // height: 250,
              // backgroundColor: 'green',
              alignSelf: 'center',
              borderRadius: 10,
              overflow: 'hidden',
            }}>
            <Video
              repeat={true}
              source={{ uri: encodeURI(resData?.video) }}
              style={{ width: '100%', height: 200, resizeMode: 'stretch' }}
              controls={true}
              paused={pus}
              resizeMode="stretch"
            />

          </View> */}

          <VideoPlayer
            viewStyle={{
              width: dimensions.SCREEN_WIDTH - 20,
              height: 220,
              // height: 250,
              // backgroundColor: 'green',
              alignSelf: 'center',
              borderRadius: 10,
              overflow: 'hidden',
            }}
            pus={pus}
            file={resData?.video}
          />

          <View>
            <Text
              style={{
                fontSize: 18,
                color: '#fff',
                fontWeight: '600',
                padding: 10,
              }}>
              About: {resData?.title}
            </Text>
          </View>

          <View
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* <Text style={[{fontFamily:FONTFAMILY, fontSize: 25, color: '#B357C3' }, StrikeThough]}>${resData?.course_fee}</Text> */}
            <Text style={[{ fontFamily: FONTFAMILY, fontSize: 25, color: '#B357C3', marginLeft: 10 },]}>${resData?.course_status == 2 ? resData?.add_on_fee : resData?.course_sale_fee}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Image
                style={{ height: 18, width: 18, marginLeft: 15, }}
                source={require('../../assets/star.png')}></Image>
              <Text allowFontScaling={false} style={{ fontSize: 18, color: '#fff', }}>{" " + resData?.rating}</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              alignItems: 'center',
              width: '95%',
              alignSelf: 'center',
            }}>
            <Image
              style={{ height: 25, width: 25 }}
              source={require('../../assets/booksquare.png')}></Image>
            <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: '#fff', marginLeft: 8 }}>
              {resData?.lesson_count} Lessons
            </Text>
            <Image
              style={{ height: 25, width: 25, marginLeft: 10 }}
              source={require('../../assets/tasksquare.png')}></Image>
            <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: '#fff', marginLeft: 8 }}>
              {resData?.total_quiz} Quiz Questions
            </Text>
          </View>

          {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '95%',
              alignItems: 'center',
              marginTop: 20,
              alignSelf: 'center',
            }}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{ height: 28, width: 28 }}
                source={require('../../assets/Rectangle103.png')}></Image>
              <Text  style={{fontFamily:FONTFAMILY,
                  fontSize: 12,
                  color: 'grey',
                  marginTop: 5,
                  marginLeft: 10,
                }}>
                {' '}
                +1182 anrolled
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: '48%',
                paddingVertical: 12,
                borderRadius: 4,
                justifyContent: 'center',
                backgroundColor: '#fff',
              }}
              onPress={() => {
                setselect1(true);
              }}>
              <Text style={{fontFamily:FONTFAMILY, color: '#000', textAlign: 'center' }}>
                View Praticipants
              </Text>
            </TouchableOpacity>
          </View> */}
          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 25,
            }}>
            <TouchableOpacity
              style={{
                width: '49%',
                paddingVertical: 8,
                borderRadius: 4,
                justifyContent: 'center',
                backgroundColor: '#fff',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              // disabled={resData?.wishlist}
              onPress={async () => {
                console.log("ddd");
                // return
                // setselect1(false);
                setLoading(true)
                // courseID
                // await addToWishlist(courseID, typeID, userdetaile.access_token)
                await addToWishlist(courseID, 1, userdetaile.access_token)
                // setLoading(false)
                await getCartList()
                getCourseDetail()
              }}>
              <Image
                style={{
                  height: 20,
                  width: 20,
                  tintColor: "#B357C3",
                  marginRight: 10,

                }}
                source={require('../../assets/heartFilled.png')}></Image>
              <Text style={{ fontFamily: FONTFAMILY, color: '#000', textAlign: 'center' }}>
                {resData?.wishlist ? "Remove From Wishlist" : "Add to Wishlist"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: '49%',
                paddingVertical: 8,
                borderRadius: 4,
                justifyContent: 'center',
                backgroundColor: '#B357C3',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => {
                setselect1(true);
                handleShare(resData?.title)
              }}>
              <Image
                style={{
                  height: 20,
                  width: 20,
                  tintColor: '#fff',
                  marginRight: 10,
                }}
                source={require('../../assets/ShareNetwork.png')}></Image>
              <Text style={{ fontFamily: FONTFAMILY, color: '#fff', textAlign: 'center' }}>Share</Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: 15.5,
              color: '#fff',
              fontWeight: '600',
              padding: 10,
              marginTop: 10,
            }}>
            Course Details
          </Text>
          <Text
            style={{
              fontSize: 13.5,
              color: '#fff',
              fontWeight: '500',
              width: '95%',
              alignSelf: 'center',
            }}>
            {resData?.description}
          </Text>
          {/* Acitivity card */}

          {resData?.purchased && <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: Mycolors.Purple,
              marginTop: 20,
              width: '95%',
              alignSelf: 'center',
              height: 90,
              borderRadius: 6,
              alignItems: 'center',
            }}>
            <ImageBackground resizeMode='cover' style={{ height: 90, width: '100%', marginLeft: 0, overflow: 'hidden' }} source={require("../../assets/wave_lines-bg.png")} >
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 90, }}>
                {/* <View style={{ width: 45, height: 45, borderWidth: 4, borderColor: "#fff", borderRadius: 25, marginLeft: 10 }}>

  </View> */}
                {/* <Image
                  source={require('../../assets/round_progressbar.png')}
                  style={{ width: 45, height: 45, marginLeft: 10 }}
                /> */}
                <View style={{ marginLeft: 10 }}>
                  <CircularProgress size={45} strokeWidth={4} progress={resData?.completion_status} color="#3b5998" />
                </View>
                <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                  <Text style={{ fontFamily: FONTFAMILY, fontSize: 14, color: '#fff', fontWeight: '500' }}>
                    {resData?.completion_status}% Complete
                  </Text>
                  {/* <Text
                    style={{
                      fontSize: 11,
                      color: '#fff',
                      fontWeight: '500',
                      marginTop: 3,
                    }}>
                    Last activity on 4 April 2024
                  </Text> */}
                </View>
              </View>
            </ImageBackground>
          </View>}
          {/* <View style={styles.mainView}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: Mycolors.BG_COLOR,
              marginTop: 20,
              width: '95%',
              alignSelf: 'center',
              height: 70,
              borderRadius: 6,
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../../assets/Purple_book.png')}
                style={{width: 45, height: 45, marginLeft: 10}}
              />
              <View style={{justifyContent: 'center', marginLeft: 10}}>
                <Text style={{fontFamily:FONTFAMILY,fontSize: 14, color: '#000', fontWeight: '600'}}>
                  Dual Tip and Diamond Probes
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={require('../../assets/TImezone_clock.png')}
                    style={{width: 18, height: 18, marginLeft: 0}}
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      color: '#000',
                      fontWeight: '500',
                      marginLeft: 5,
                    }}>
                    15:00
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                width: '5%',
                height: 35,
                backgroundColor: '#fff',
                borderRadius: 5,
                justifyContent: 'center',
                alignSelf: 'center',
                marginRight: 10,
              }}>
              <Image
                source={require('../../assets/arrow-black-up.png')}
                style={{width: 24, height: 24}}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: dimensions.SCREEN_WIDTH - 45,
              alignSelf: 'center',
             marginTop:20
            }}>
            <Text style={{fontFamily:FONTFAMILY,fontSize: 18, color: '#292D32'}}>Recommended Product</Text>

            <TouchableOpacity
              style={{
                height: 30,
                width: '18%',
                backgroundColor: '#B357C3',
                borderRadius: 7,
                justifyContent: 'center',
                alignSelf: 'center',
              }}
              onPress={() => {
                // props.navigation.navigate('HomeViewAll');
              }}>
              <Text style={{fontFamily:FONTFAMILY,fontSize: 13, color: '#fff', textAlign: 'center'}}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

        <View style={{ marginTop: 20, right:0,justifyContent:"center",alignItems:'center',height:230 ,width: dimensions.SCREEN_WIDTH - 45,marginBottom:10,}}>
          <FlatList
            data={data2}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item,index }) => {
              return (
                <TouchableOpacity style={{ width: dimensions.SCREEN_WIDTH * 75 / 100, marginLeft: 25,
                  // borderWidth:0.5,
                  // borderColor:'#EAEDF7',
                  paddingVertical:4,
                  backgroundColor:'#fff',
                shadowColor:'#000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                elevation:3,
                shadowOpacity:0.5,
                borderRadius:10,
                zIndex:999 }}>
                  <ImageBackground style={{ height: 150, width: '100%', borderTopLeftRadius: 7, borderTopRightRadius: 7,  overflow: 'hidden' }} source={require("../../assets/Rectangle.png")}>
                  </ImageBackground>

                  <View style={{ width: '100%',  borderBottomLeftRadius: 5, borderBottomRightRadius: 5, padding: 10 }}>
                    <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000", padding: 5 }}>{resData?.title}</Text>

                    <View style={{ flexDirection: "row" }}>

                      <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }}>${resData?.course_fee}</Text>

                      <View style={{ flexDirection: "row", padding: 4, marginLeft: 25 }}>
                        <Image style={{ height: 12, width: 12, marginTop: 4 }} source={require("../../assets/star.png")}></Image>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000", }}> 4.7</Text>
                      </View>
                    </View>
                  </View>

                </TouchableOpacity>

              )
            }}
            keyExtractor={item => item.id}
          />
        </View>
        </View> */}
          <FlatList
            data={resData?.lessons}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {

                    if (!(resData?.purchased)) {
                      setModalMsg("You need to buy this course in order to view the course content.")
                      setcompleteModal(true)
                      return
                    }

                    if (resData?.course_status == 2) {
                      setModalMsg(resData?.course_status_name)
                      setcompleteModal(true)
                      return
                    }

                    props.navigation.navigate('Disclaimers', { data: item, courseImage: resData?.image, courseData: resData, courseID })
                  }}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: Mycolors.BG_COLOR,
                    marginTop: 20,
                    width: '95%',
                    alignSelf: 'center',
                    height: 70,
                    borderRadius: 6,
                    alignItems: 'center',
                    overflow: 'hidden' 
                  }}>
                  <View style={{ flexDirection: 'row',overflow: 'hidden'  }}>
                    <Image
                      source={require('../../assets/Purple_book.png')}
                      style={{ width: 45, height: 45, marginLeft: 10 }}
                    />
                    <View style={{ justifyContent: 'center', marginLeft: 10,overflow: 'hidden',flexShrink: 1 }}>
                      <Text
                        style={{ fontFamily: FONTFAMILY, fontSize: 14, color: '#000', fontWeight: '600', overflow: 'hidden',flexShrink: 1 , paddingRight: 2}}>
                        {item?.lesson_name}
                        {/* Lorem ipsum aaaaaaaaaa */}
                      </Text>
                      {/* <View style={{ flexDirection: 'row' }}>
                      <Image
                        source={require('../../assets/TImezone_clock.png')}
                        style={{ width: 18, height: 18, marginLeft: 0 }}
                      />
                      <Text
                        style={{fontFamily:FONTFAMILY,
                          fontSize: 11,
                          color: '#000',
                          fontWeight: '500',
                          marginLeft: 5,
                        }}>
                        15:00
                      </Text>
                    </View> */}
                    </View>
                  </View>
                  <View
                    style={{
                      width: '5%',
                      height: 35,
                      backgroundColor: '#fff',
                      borderRadius: 5,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginRight: 10,
                    }}>
                    {/* <Image
                    source={require('../../assets/arrow-down-black.png')}
                    style={{width: 24, height: 24}}
                  /> */}
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          {/******* *Rating card UI******* */}
          {(resData?.purchased && resData?.course_status != 2) && <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#4556A6',
              marginTop: 20,
              width: '95%',
              alignSelf: 'center',
              height: 90,
              borderRadius: 6,
              alignItems: 'center',
            }}>
            <ImageBackground resizeMode='cover' style={{ height: 90, width: '100%', marginLeft: 0, overflow: 'hidden' }} source={require("../../assets/wave_lines-bg.png")} >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 90, }}>
                  {/* <View style={{ width: 45, height: 45, borderWidth: 4, borderColor: "#fff", borderRadius: 25, marginLeft: 10 }}>

  </View> */}
                  <Image
                    source={require('../../assets/star-icon.png')}
                    style={{ width: 45, height: 45, marginLeft: 10 }}
                  />
                  <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                    <Text style={{ fontFamily: FONTFAMILY, fontSize: 14, color: '#fff', fontWeight: '500' }}>
                      Rating & Review
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        color: '#fff',
                        fontWeight: '500',
                        marginTop: 3,
                      }}>{resData?.rating} {`(${resData?.review_list &&
                        resData?.review_list.length})`}

                    </Text>
                  </View>
                </View>
                {resData?.is_reviewed == null && <TouchableOpacity onPress={() => console.log(modalRef.current?.openModal())} style={{ width: "40%", height: 40, backgroundColor: "#fff", borderRadius: 5, justifyContent: "center", alignSelf: "center", marginRight: 10 }}>
                  <Text style={{ fontFamily: FONTFAMILY, fontSize: 12, color: "#4556A6", textAlign: "center", fontWeight: "700" }}>Write your Review</Text>
                </TouchableOpacity>
                }
              </View>
            </ImageBackground>
          </View>}
          {/* review box Flatlist UI*/}
          {(resData?.purchased && resData?.course_status != 2) && <FlatList
            data={
              resData?.review_list ||
              []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <View
                  onPress={() => { }}
                  style={{
                    // flexDirection: 'row',
                    justifyContent: 'center',
                    backgroundColor: Mycolors.BG_COLOR,
                    marginTop: 20,
                    width: '95%',
                    alignSelf: 'center',
                    // height: 140,
                    borderRadius: 6,
                    alignItems: 'center',
                    paddingVertical: 10
                  }}>
                  <View style={{ flexDirection: 'row', width: '100%', }}>
                    <Image
                      // source={require('../../assets/Rectangle103.png')}
                      source={{ uri: item?.review_by_profile }}
                      style={{ width: 36, height: 36, marginLeft: 10 }}
                    />
                    <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                      <Text
                        style={{ fontFamily: FONTFAMILY, fontSize: 14, color: '#000', fontWeight: '600' }}>
                        {item?.review_by_name}
                      </Text>


                    </View>
                    <View style={{ position: 'absolute', right: 10, top: 4 }}>
                      <Text
                        style={{
                          fontFamily: FONTFAMILY,
                          fontSize: 12,
                          color: '#000',
                          fontWeight: '300',
                          marginLeft: 5,
                        }}>
                        {item?.review_on.split(" ")[0]}
                      </Text>
                    </View>

                  </View>
                  <View style={{ alignSelf: 'center', width: '95%', marginTop: 10, }}>
                    <View style={{ width: 90 }}>
                      <Rating
                        type='star' // The type of rating to display (default is star)
                        ratingCount={5} // Number of stars you want (default is 5)
                        imageSize={18} // Size of each star
                        startingValue={parseFloat(item?.rating)} // Default rating value
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 11,
                        color: '#000',
                        fontWeight: '500',
                        // marginLeft: 5,
                        lineHeight: 25, marginTop: 2,
                      }}>
                      {item?.review}
                    </Text>

                    {item?.my_review &&
                      <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                        <TouchableOpacity
                          onPress={() => {
                            // setdefaultRating(parseFloat(item?.rating))
                            // setdefaultReviewText(item?.review)
                            modalRef.current?.openEditModal(item?.id, parseFloat(item?.rating), item?.review)
                            console.log('ddd');
                          }}
                          style={{
                            flexDirection: 'row',

                            // alignItems: 'center',
                            // height: 10,
                            width: responsiveWidth(15),
                            // backgroundColor:'red',
                            marginLeft: -5
                          }}
                        // onPress={_editHandler}
                        >
                          <Image
                            source={require('../../assets/edit.png')}
                            resizeMode="contain"
                            style={{
                              height: responsiveHeight(2),
                              width: responsiveWidth(7),
                            }}
                            tintColor={"#8B4098"}
                          />
                          <Text style={[{
                            fontFamily: FONTFAMILY,
                            fontSize: responsiveFontSize(1.6),
                            fontWeight: '600',

                            color: "#307DBF",
                          }, { color: '#8B4098' }]}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                          deleteReview(item?.id)
                        }}
                          style={{
                            flexDirection: 'row',

                            // alignItems: 'center',
                            // height: 10,
                            width: responsiveWidth(15),
                            // backgroundColor:'red',
                            // marginLeft: -5
                          }}
                        // onPress={_editHandler}
                        >
                          <Image
                            source={require('../../assets/trash.png')}
                            resizeMode="contain"
                            style={{
                              height: responsiveHeight(1.8),
                              width: responsiveWidth(6.8),
                            }}
                            tintColor={"red"}
                          />
                          <Text style={[{
                            fontFamily: FONTFAMILY,
                            fontSize: responsiveFontSize(1.6),
                            fontWeight: '600',


                          }, { color: 'red' }]}>Delete</Text>
                        </TouchableOpacity>
                      </View>}

                  </View>
                </View>
              );
            }}
          />
          }

          <View style={{ width: 50, height: 250 }} />
        </ScrollView>
        <>{true && <>
          {(resData?.purchased && resData?.course_status != 2) ? <>
            {(resData?.course_completed != "0") &&
              <View
                style={{
                  width: '100%',
                  height: 100,
                  backgroundColor: 'rgba(255, 255, 255,1)',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  position: 'absolute',
                  bottom: 0,
                  zIndex: 111,
                  alignItems: 'center', justifyContent: 'center'
                }}>
                {/* <View style={{ flexDirection: 'row', margin: 15, alignItems: 'center' }}>
              <Text style={{fontFamily:FONTFAMILY, fontSize: 25, color: '#B357C3' }}>${resData?.course_fee}</Text>
              <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: '#000' }}>
                {' '}
                (include all the taxas if applied*)
              </Text>
            </View> */}
                <View
                  style={{
                    width: '95%',
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // marginTop: 50,
                    // backgroundColor: 'red'
                  }}>
                  <TouchableOpacity
                    style={{
                      width: '48%',
                      paddingVertical: 8,
                      borderRadius: 4,
                      justifyContent: 'center',
                      backgroundColor: '#fff',
                      flexDirection: 'row',
                      alignItems: 'center',
                      shadowColor: '#000000',
                      shadowOffset: {
                        width: 0,
                        height: 3,
                      },
                      shadowRadius: 5,
                      shadowOpacity: 0.2,
                      elevation: 5,
                    }}
                    onPress={() => {
                      console.log(resData?.certificate);
                      props.navigation.navigate("DisclaimersPdf", { pdfData: resData?.certificate })
                    }}>
                    {/* <Image
                      style={{
                        height: 20,
                        width: 20,
                        tintColor: '#000',
                        marginRight: 10,
                      }}
                      source={require('../../assets/shopbag.png')}></Image> */}
                    <Text
                      style={{ color: '#4556A6', textAlign: 'center', fontWeight: 600 }}>
                      {"View Certificate"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: '48%',
                      paddingVertical: 8,
                      borderRadius: 4,
                      justifyContent: 'center',
                      backgroundColor: '#B357C3',
                      flexDirection: 'row',
                      alignItems: 'center',
                      shadowColor: '#000000',
                      shadowOffset: {
                        width: 0,
                        height: 3,
                      },
                      shadowRadius: 5,
                      shadowOpacity: 0.2,
                      elevation: 5,
                    }}
                    onPress={() => {
                      requestDownloadingPermission(resData?.certificate)
                    }}>
                    <Text style={{ fontFamily: FONTFAMILY, color: '#fff', textAlign: 'center' }}>{"Download Certificate"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }</> :
            <View
              style={{
                width: '100%',
                height: 170,
                backgroundColor: '#fff',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                position: 'absolute',
                bottom: 0,
                zIndex: 111,
              }}>
              <View style={{ flexDirection: 'row', margin: 15, alignItems: 'center' }}>
                <Text style={{ fontFamily: FONTFAMILY, fontSize: 25, color: '#B357C3' }}>${resData?.course_status == 2 ? resData?.add_on_fee : resData?.course_sale_fee}</Text>
                {resData?.course_status == 2 && <Text style={{ fontFamily: FONTFAMILY, fontSize: 12, color: '#B357C3' }}>
                  {" (*This is the discounted add on price for course)"}
                </Text>}
              </View>
              <View
                style={{
                  width: '95%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 5,
                }}>

                <AddToCartHandleComponent style={{ width: '100%' }} startLoader={() => setLoading(true)} id={courseID} type={1} in_cart={resData?.in_cart} addRemoveButton={true} callback={getCourseDetail}>

                  <View
                    style={{
                      width: 190,
                      height: 35,
                      paddingVertical: 8,
                      borderRadius: 4,
                      justifyContent: 'center',
                      backgroundColor: '#fff',
                      flexDirection: 'row',
                      alignItems: 'center',
                      shadowColor: '#000000',
                      shadowOffset: {
                        width: 0,
                        height: 3,
                      },
                      shadowRadius: 5,
                      shadowOpacity: 0.2,
                      elevation: 5,
                    }}
                  // onPress={async () => {
                  //   // setselect1(false);

                  //   console.log("ddd");
                  //   setLoading(true)
                  //   await toggleCartAddRemove(courseID, 1, userdetaile.access_token, resData?.in_cart ? 'remove-cart' : 'add-cart', getCourseDetail, async (msg) => {

                  //     showAddToCartErrorComp({

                  //       approveFunc: async () => {
                  //         await toggleCartAddRemove(courseID, 1, userdetaile.access_token, resData?.in_cart ? 'remove-cart' : 'add-cart')
                  //         await getCourseDetail()

                  //       },

                  //       msg: msg,



                  //     }
                  //     )

                  //     // await getCourseDetail()


                  //   })


                  //   // await getCourseDetail()
                  //   setLoading(false)

                  // }}
                  >
                    <Image
                      style={{
                        height: 20,
                        width: 20,
                        tintColor: '#000',
                        marginRight: 10,
                      }}
                      source={require('../../assets/shopbag.png')}></Image>
                    <Text
                      style={{ color: '#4556A6', textAlign: 'center', fontWeight: 600 }}>
                      {resData?.in_cart ? 'Remove from Cart' : 'Add to Cart'}
                    </Text>
                  </View>
                </AddToCartHandleComponent>

                <AddToCartHandleComponent style={{ width: '100%' }} startLoader={() => setLoading(true)} id={courseID} type={1} in_cart={resData?.in_cart} buyBtn={true} callback={getCourseDetail}>
                  <View
                    style={{
                      width: 190,
                      height: 36,
                      paddingVertical: 8,
                      borderRadius: 4,
                      justifyContent: 'center',
                      backgroundColor: '#B357C3',
                      flexDirection: 'row',
                      alignItems: 'center',
                      shadowColor: '#000000',
                      shadowOffset: {
                        width: 0,
                        height: 3,
                      },
                      shadowRadius: 5,
                      shadowOpacity: 0.2,
                      elevation: 5,
                    }}
                    onPress={async () => {
                      if (resData?.in_cart) {
                        props.navigation.navigate('ProductCart')
                        return
                      }

                      console.log("ddd");
                      setLoading(true)
                      // await toggleCartAddRemove(courseID, 1, userdetaile.access_token, resData?.in_cart ? 'remove-cart' : 'add-cart')
                      // props.navigation.navigate('ProductCart')

                      await toggleCartAddRemove(courseID, 1, userdetaile.access_token, resData?.in_cart ? 'remove-cart' : 'add-cart', async () => {
                        await getCourseDetail()
                        props.navigation.navigate('ProductCart')

                      }, async (msg) => {

                        showAddToCartErrorComp({

                          approveFunc: async () => {
                            await toggleCartAddRemove(courseID, 1, userdetaile.access_token, resData?.in_cart ? 'remove-cart' : 'add-cart')
                            await getCourseDetail()
                            props.navigation.navigate('ProductCart')

                          },

                          msg: msg,



                        }
                        )




                      })

                      // await getCourseDetail()
                      setLoading(false)
                    }}>
                    <Text style={{ fontFamily: FONTFAMILY, color: '#fff', textAlign: 'center', fontWeight: 600 }}>Buy Now</Text>
                  </View>
                </AddToCartHandleComponent>
              </View>
            </View>
          }


        </>
        }
        </>

        <NewModal
          isVisible={isFocused && completeModal}
          swipeDirection="down"
          onSwipeComplete={e => {
            setcompleteModal(false);

          }}
          coverScreen={true}
          backdropColor="transparent"
          style={{
            flex: 1,
            justifyContent: 'center',
            margin: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              height: 'auto',
              backgroundColor: Mycolors.BG_COLOR,
              borderRadius: 10,
              padding: 20,
              margin: 0,
              bottom: 0,
              marginHorizontal: 20,
            }}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
              <View style={{}}>
                <View
                  style={{ justifyContent: 'center', alignSelf: 'center' }}>
                  <Image
                    source={require('../../assets/courseBuyModal.png')}
                    style={{
                      width: 150,
                      height: 100,
                      alignSelf: 'center',
                      borderRadius: 5,
                      resizeMode: 'stretch',
                    }} />

                </View>
                <Text style={{ fontFamily: FONTFAMILY, textAlign: 'center', marginTop: 8, color: '#B357C3', fontWeight: '500', marginBottom: 8 }}>{modalMsg}</Text>
                {/* <Text style={{fontFamily:FONTFAMILY, textAlign: 'center', marginTop: 8, color: '#000', fontWeight: '400', fontSize: 11, lineHeight: 18 }}>Thank you for purchasing course . We received your order and Successfully placed. </Text> */}

                {/* <View style={{height: 20}} /> */}
                <MyButtons
                  title="Close"
                  height={45}
                  width={'100%'}
                  borderRadius={5}
                  fontWeight={'600'}
                  alignSelf="center"
                  press={() => {
                    setcompleteModal(false);

                    // props.navigation.navigate("MyorderStack")
                  }}
                  marginHorizontal={20}
                  titlecolor={Mycolors.BG_COLOR}
                  backgroundColor={Mycolors.Purple}
                  marginVertical={10}
                />
              </View>
            </KeyboardAwareScrollView>
          </View>
        </NewModal>
        {loading ? <Loader /> : null}
      </LinearGradient>
      <ReviewRating startLoader={() => setLoading(true)} type={1} id={courseID} ref={modalRef} callback={() => {
        setreloadGetAPI((val) => !val)
      }} reviewID={resData?.is_reviewed}
        defaultRating={defaultRating}
        defaultReviewText={defaultReviewText}
      />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainView: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Mycolors.BG_COLOR,
    borderRadius: 6,
    marginTop: 20
  },
});
export default CourseHistory;

const CardOpen = ({ item }) => {
  return <View key={item.id} style={styles.mainView}></View>;
};
