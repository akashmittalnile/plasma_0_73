import React, { useEffect, useState, useRef, useCallback, useMemo, memo } from 'react';
import { View, Image, Text, StyleSheet, SafeAreaView, ImageBackground, TextInput, Linking, BackHandler, FlatList, TouchableOpacity, Platform, Alert, PermissionsAndroid, ScrollView, StatusBar, Share, RefreshControl } from 'react-native';
import { Mycolors, dimensions } from '../../utility/Mycolors';
import HomeHeader from '../../component/HomeHeader';
import LinearGradient from 'react-native-linear-gradient'
import MyButtons from '../../component/MyButtons';
// import { Rating } from 'react-native-ratings';
import { ImageSlider, ImageCarousel } from "react-native-image-slider-banner";
import { add_cart, follow_unfollow, home, remove_cart, requestGetApi, requestGetWithoutBody, requestPostApi } from '../../WebApi/Service';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../WebApi/Loader';
import { saveUserResult, onLogoutUser, saveSelectedHairdresser, saveSeviceNavigation, saveSelectedService, saveSaloonDetails, saveUserToken, } from '../../redux/actions/user_action';
import MySearchBar from '../../component/MySearchBar';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { addToWishlist, toggleCartAddRemove } from '../../WebApi/GlobalAPICalls';
import Toast from 'react-native-simple-toast';
import { setCart } from '../../redux/reduxSlices/cartSlice';
import { StrikeThough } from '../../utility/FontStyles';
import ShareComponent, { handleShare } from '../../component/ShareComponent';
import useAPI from '../../utility/hooks/useAPI';
import CircularProgress from '../../component/CircularProgress';
import LessonComp from '../../component/LessonComp';
import { useIsFocused } from '@react-navigation/native';
import { sliceTitle, TYPE } from '../../utility/MyFunctions';
import { Pages } from 'react-native-pages';
import Modal from "react-native-modal";
import { setMsgUnseenData } from '../../redux/reduxSlices/unseenMessageCountSlice';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { FONTFAMILY } from '../../utility/fonts';
import MySearchBarForHome from '../../component/MySearchBarForHome';
import moment from 'moment';
import { Rating } from 'react-native-ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';


const transformData = (data) => {

  if (!data) {
    return null
  }

  try {

    if (Object.keys(data).length === 0 || !data) {
      return null
    }

    const markedDates = {};

    Object.keys(data.calendarColorData).forEach((monthYear) => {
      const [month, year] = monthYear.split('-');
      const days = data.calendarColorData[monthYear].days;

      Object.keys(days).forEach((day) => {
        const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        if (days[day].color) {
          markedDates[date] = {
            customStyles: {
              container: {
                backgroundColor: days[day].color
              },
              text: {
                color: 'white',
                fontWeight: 'bold'
              }
            }
          };
        }
        else if (date == moment(new Date()).format('YYYY-MM-DD')) {
          markedDates[date] = {
            customStyles: {
              container: {
                backgroundColor: days[day].color
              },
              text: {
                color: Mycolors.Purple,
                fontWeight: 'bold'
              }
            }
          };
        }
      });
    });
    console.log({ markedDates });
    return markedDates;
  } catch (error) {
    console.error("transformData error", data);
    return null
  }
};

const Announcements = memo(({ announcement, setAnnouncementModal,
  setAnnouncementModalData }) => {

  return <View style={{
    height: 220, width: responsiveWidth(95), backgroundColor: 'transparent',
  }}>

    <Pages>
      {announcement.map((item, index) => {

        const { id, title,
          description,
          image } = item

        return (
          <View key={id}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 193,
              width: responsiveWidth(93),
              // backgroundColor: Mycolors?.Purple,
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <View>
              <ImageBackground
                source={require('../../assets/MaskBackground.png')}
                style={{ overflow: 'hidden', width: dimensions.SCREEN_WIDTH, height: 193, justifyContent: 'center' }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginTop: 20,
                    paddingHorizontal: 30,
                    justifyContent: 'space-between',
                    // marginHorizontal: 12,
                  }}
                >
                  <View style={{ flexDirection: 'column', width: dimensions.SCREEN_WIDTH * 0.50, }}>
                    <Text
                      style={{
                        fontWeight: '700',
                        fontSize: 16,
                        color: "white",
                        fontFamily: FONTFAMILY,
                      }}
                    >
                      {/* {item.title} */}
                      {title}
                    </Text>
                    <Text
                      style={{ fontSize: 14, color: "white", marginTop: 5, height: 'auto', fontFamily: FONTFAMILY }}
                    >
                      {/* {item?.description === undefined
              ? ''
              : item.description.length > 50
                ? `${item?.description.substring(0, 50)}.....`
                : `${item?.description.substring(0, 50)}`} */}
                      {sliceTitle(description, 60)}
                    </Text>
                    <TouchableOpacity
                      style={{
                        height: 36,
                        width: 99,
                        borderRadius: 5,
                        backgroundColor: 'white',
                        marginTop: 8,
                        marginBottom: 30,
                      }}
                      onPress={() => {
                        // setEditModal(true), setDataModal(item);
                        setAnnouncementModal(true)
                        setAnnouncementModalData(item)
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 13,
                          color: "black",
                          fontFamily: FONTFAMILY,
                          marginTop: 8,
                          alignSelf: 'center',
                        }}
                      >
                        Read More
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Image
                    source={{ uri: image }}
                    style={{ height: 160, width: 160, borderRadius: 20, marginTop: -15 }}

                  />
                  {/* require('../../assets/user-default.png') */}
                </View>
              </ImageBackground>
            </View>
          </View>
        )
      })}

    </Pages>
  </View>
})



const Home = (props) => {
  const [searchValue, setsearchValue] = useState('')
  const [homeData, sethomeData] = useState('')
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const userdetaile = useSelector(state => state.user.user_details)
  const cart = useSelector(state => state.cart.cartItems);
  const [lod, setlod] = useState(false);
  const [select1, setselect1] = useState('')
  const [select2, setselect2] = useState('')
  const [selected, setSelected] = useState('');

  const [data, setdata] = useState(null)
  const [data2, setdata2] = useState(null)
  const [blogs, setblogs] = useState([{
    "id": "",
    "title": "",
    "description": "",
    "views": "",
    "status": "",
    "created_at": "",
    "updated_at": "",
    "images": [
      {
        "id": "",
        "image": ""
      },
      {
        "id": "",
        "image": ""
      },
      {
        "id": "",
        "image": ""
      }
    ]
  }])
  const [community, setcommunity] = useState([])
  const [announcement, setannouncement] = useState([])
  const [markedDates, setmarkedDates] = useState(null)

  const [isReviewed, setisReviewed] = useState(false)
  const [announcementModal, setAnnouncementModal] = useState(false)
  const [announcementModalData, setAnnouncementModalData] = useState(null)
  const [rating, setRating] = useState(0);
  const updateCommunity = useSelector(state => state.community.updateCommunity);

  const { getCartList, AddToCartErrorComp, showAddToCartErrorComp, postAPI, getAPI } = useAPI()

  const isFocussed = useIsFocused()

  useEffect(() => {
    isFocussed && getHomedata()
  }, [cart, updateCommunity])

  useEffect(() => {
    unseen_message_count()
    // user_details()
  }, [isFocussed])

  function HomeCatModule({ imgSrc = require('../../assets/penVertical.png'), titleImg = require('../../assets/plasmaLogo.png'), onPress = () => { } }) {

    return <TouchableOpacity onPress={onPress} style={{ width: (dimensions.SCREEN_WIDTH * 0.46), height: (dimensions.SCREEN_WIDTH * 0.6), borderRadius: 10, overflow: 'hidden' }}>
      <ImageBackground style={{ width: '100%', height: '100%', flexDirection: 'row', }} source={require('../../assets/ImageBack.png')}>
        <Image style={{ height: (dimensions.SCREEN_WIDTH * 0.5), width: 90, position: 'absolute', zIndex: 888, right: -5, bottom: 0 }} source={imgSrc} />

        <View style={{ backgroundColor: 'transparent', zIndex: 5555, height: '100%', width: '70%', paddingLeft: 10, justifyContent: 'space-evenly', paddingVertical: 20 }}>
          <Text style={{ fontFamily: FONTFAMILY, fontSize: 14, color: "#fff", fontWeight: 'bold', }}>See Why</Text>

          <Image style={{ height: 20, width: '100%', borderRadius: 3 }} source={titleImg} />

          <Text style={{ fontFamily: FONTFAMILY, fontSize: 14, color: "#FFC200", fontWeight: 'bold', }}>{'Trusted\nWorldwide'}</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={{ fontFamily: FONTFAMILY, fontSize: 14, color: "#fff", fontWeight: 'bold', }}>Course All</Text>
            <Image style={{ height: 15, width: 15, marginLeft: 5 }} source={require('../../assets/rightArrow.png')} />
          </View>
        </View>


      </ImageBackground>
    </TouchableOpacity>
  }


  async function postAppReviewRating() {

    console.log(rating);
    // return
    const res = await postAPI({
      endPoint: 'reviews', bodyJSON: {
        rating: rating
      }
    })

    getHomedata()
    if (!res) {

    }
  }

  // useEffect(() => {
  //   getHomedata()
  // }, [cart, updateCommunity])

  // const getCartList = async () => {


  //   const { responseJson, err } = await requestGetWithoutBody(`cart-list`, userdetaile.access_token)

  //   console.log('cart-list==>>', responseJson);
  //   if (err == null) {
  //     if (responseJson.status) {


  //       console.log("cart-list", responseJson.data);
  //       // Toast.show(responseJson?.message);

  //       dispatch(setCart(responseJson))

  //     } else {

  //       console.log("else");

  //       dispatch(setCart(responseJson))

  //     }
  //   } else {
  //   }
  // };

  const toggleFollow = async (status, id) => {

    console.log("toggleFollow", { status, id });
    // return
    setLoading(true);
    await postAPI({
      endPoint: follow_unfollow, bodyJSON: {
        id: id,
        status: status
      }
    })
    setLoading(false);
    getHomedata()


  }

  const getHomedata = async () => {
    setLoading(true);
    let formdata = new FormData();
    formdata.append('id', userdetaile.id);
    const { responseJson, err } = await requestGetApi(home, '', 'GET', userdetaile.access_token)

    setLoading(false);
    console.log('the Home data is==>>', responseJson.data);
    if (err == null) {
      if (responseJson.status) {
        console.log({ responseJson });
        // return
        setdata(responseJson.data.course);
        setdata2(responseJson.data.product);
        setblogs(responseJson.data.blog);
        setcommunity(responseJson?.data?.community)
        setmarkedDates({ calendarColorData: responseJson.data.calendarColorData });
        setannouncement(responseJson.data.announcement);
        setisReviewed(responseJson.data.isReviewed);
        console.log('===========================responseJson.data.product=========');
        console.log(responseJson.data.product[0].images);
        console.log('====================================');
        // getCartList()
      } else {

      }
    } else {
    }
  };

  // async function toggleCartAddRemove(course, type, access_token, action_type = 'add-cart') {

  //   let formdata = new FormData();
  //   formdata.append('id', course);
  //   formdata.append('type', type);

  //   setLoading(true);
  //   const { responseJson, err } = await requestPostApi(
  //     action_type,
  //     formdata,
  //     'POST',
  //     access_token,
  //   );
  //   setLoading(false);
  //   console.log('The edit profile responce is==>>', responseJson, err);
  //   if (err == null) {
  //     if (responseJson.status) {

  //       console.log(responseJson.message);
  //       Toast.show(responseJson.message);
  //       getHomedata()
  //       getCartList()
  //       return

  //       // getCourseDetail()
  //     } else {

  //       Toast.show(responseJson.message);
  //       return
  //     }
  //   } else {
  //     console.log('The error is==>>', err);
  //   }
  // }

  const handleWishlist = async (id, type) => {
    setLoading(true)
    await addToWishlist(id, type, userdetaile.access_token)
    setLoading(false)
    getHomedata()
  }

  const markedDatesData = useMemo(
    () => {
      return transformData(markedDates)
    },
    [markedDates]
  )


  async function unseen_message_count() {
    try {
      const res = await getAPI({ endPoint: 'unseen-message-count' })
      console.log("unseen_message_count", { res });
      dispatch(setMsgUnseenData(res))

    } catch (error) {
      console.log("unseen_message_count", { error });
    }

  }



  const CARDTITLECOLOR = "#292D32"

  return (
    <>
      <AddToCartErrorComp />
      <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1, }}>
        <SafeAreaView />
        <StatusBar />
        {/* ******************Header******************** */}
        <HomeHeader press={() => { props.navigation.openDrawer() }} navigation={props.navigation} />
        {/* ******************Search******************** */}
        <View style={{ width: '95%', backgroundColor: 'transparent', marginLeft: 'auto', marginRight: 'auto' }}>
          <TouchableOpacity style={{ width: '100%' }} onPress={() => {
            props.navigation.navigate("HomeSearch")
          }}>
            <MySearchBarForHome disabled placeHolder={'Courses and Products'} />
          </TouchableOpacity>
          <ScrollView refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => {
                getHomedata()
                getCartList()
              }} />}
            style={{}}>


            {/* Announcements */}

            <Announcements announcement={announcement}
              setAnnouncementModal={setAnnouncementModal}
              setAnnouncementModalData={setAnnouncementModalData} />

            {/* New Plasmapen and Cooljet Component */}
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <HomeCatModule onPress={() => { props.navigation.navigate('HomeViewAll', { category_id: 2 }) }} />
              <HomeCatModule onPress={() => { props.navigation.navigate('HomeViewAll', { category_id: 1 }) }} imgSrc={require('../../assets/cooljetVertical.png')} titleImg={require('../../assets/cooljetLogo.png')} />

            </View>

            {/* ******************* */}

            {/* ****************************Tranding View All****************** */}
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: "space-between", width: "100%", alignSelf: "center" }}>

                <Text style={{ fontFamily: FONTFAMILY, fontSize: 18, color: "#fff", fontWeight: '700', }}>Trending Courses</Text>

                <TouchableOpacity style={{ height: 30, width: '18%', backgroundColor: "#B357C3", borderRadius: 5, justifyContent: "center", alignSelf: "center", }}
                  onPress={() => {
                    //  props.navigation.navigate('HomeViewAll')
                    props.navigation.navigate('HomeSearch', { comingFrom: TYPE.COURSE })

                  }}>
                  <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "#fff", textAlign: "center", fontWeight: '600' }}>View All</Text>
                </TouchableOpacity>


              </View>

              {/* ****************************Tranding flatlist****************** */}
              <View style={{ marginTop: 10, width: dimensions.SCREEN_WIDTH * 97 / 100, alignSelf: 'flex-start', right: 5 }}>
                <FlatList
                  data={data ? data : []}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity style={{
                        width: dimensions.SCREEN_WIDTH * 75 / 100, marginRight: 10,

                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 8,
                        },
                        shadowOpacity: 0.10,
                        shadowRadius: 4.65,

                        elevation: 13,
                      }}
                        onPress={() => {

                          props.navigation.navigate('CourseDetails', { data: item, })
                        }}>
                        <ImageBackground style={{ height: 180, width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10, marginLeft: 10, overflow: 'hidden' }} resizeMode='stretch' source={{ uri: item.image }}>
                          <View style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: 5 }}>
                            <TouchableOpacity onPress={async () => {

                              console.log(item);

                              await handleWishlist(item?.id, 1)



                            }} style={{ marginRight: 10 }}>
                              <Image style={{ height: 25, width: 25, tintColor: "#B357C3", }} source={item?.wishlist ? require("../../assets/heartFilled.png") : require("../../assets/heart.png")}></Image>

                            </TouchableOpacity>
                            <ShareComponent title={item.title} />
                          </View>

                        </ImageBackground>

                        <View style={{ width: '100%', backgroundColor: '#fff', marginLeft: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, padding: 10 }}>
                          <Text style={{ fontFamily: FONTFAMILY, fontSize: 16, color: CARDTITLECOLOR, padding: 5, fontFamily: FONTFAMILY, fontWeight: '700' }}>{item.title}</Text>

                          <View style={{ flexDirection: "row", gap: 20, alignItems: 'center' }}>

                            {/* <Text style={[{fontFamily:FONTFAMILY, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }, , StrikeThough]}>${item.course_fee}</Text> */}
                            <Text style={{ fontFamily: FONTFAMILY, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }}>${item.course_sale_fee}</Text>

                            <View style={{ flexDirection: "row", padding: 4, }}>
                              <Image style={{ height: 12, width: 12, marginTop: 1 }} source={require("../../assets/star.png")}></Image>
                              <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "#000", }}>{' ' + item?.rating}</Text>
                            </View>

                            {/* <TouchableOpacity style={{ height: 23, width: 60, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginLeft: 20 }}>
                          <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#B357C3", textAlign: "center" }}>{item.lesson_count} lesson</Text>
                        </TouchableOpacity> */}

                            <LessonComp count={item?.lesson_count} style={{}} />


                          </View>

                          <View style={{ flexDirection: 'row', marginTop: 5 }}>

                            <Image style={{ height: 28, width: 28, marginLeft: 5 }} source={require("../../assets/Rectangle103.png")}></Image>
                            <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "black", marginTop: 5, marginLeft: 5 }}> {item?.total_purchase} Enrolled</Text>

                          </View>

                        </View>

                      </TouchableOpacity>

                    )
                  }}
                  keyExtractor={item => item.id}
                />
              </View>
            </View>


            {/* ****************************Store View All****************** */}

            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: "space-between", width: "100%", alignSelf: "center" }}>

                <Text style={{ fontFamily: FONTFAMILY, fontSize: 18, color: "#fff", fontWeight: '700', }}>Store</Text>

                <TouchableOpacity style={{ height: 30, width: '18%', backgroundColor: "#B357C3", borderRadius: 5, justifyContent: "center", alignSelf: "center", }}
                  onPress={() => {
                    // props.navigation.navigate('ProductViewAll') 
                    props.navigation.navigate('HomeSearch', { comingFrom: TYPE.PRODUCT })
                  }}>
                  <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "#fff", textAlign: "center", fontWeight: '600' }}>View All</Text>
                </TouchableOpacity>


              </View>

              {/* ****************************Store flatlist****************** */}
              <View style={{ marginTop: 10, width: dimensions.SCREEN_WIDTH * 97 / 100, alignSelf: 'flex-start', right: 5 }}>
                <FlatList
                  data={data2 ? data2 : []}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => {

                    //  const handleWishlist = async (id, type) => {
                    //     setLoading(true)
                    //     await addToWishlist(id, type, userdetaile.access_token)
                    //     setLoading(false)
                    //     await getHomedata()
                    //   }

                    return (
                      <TouchableOpacity onPress={() => {
                        props.navigation.navigate('ProductDetails', { data: item, })
                      }} style={{
                        width: dimensions.SCREEN_WIDTH * 75 / 100, marginRight: 10,

                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 8,
                        },
                        shadowOpacity: 0.10,
                        shadowRadius: 4.65,

                        // elevation: 13,
                        // backgroundColor:'red'
                      }}>
                        {/* <ImageBackground style={{ height: 180, width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10, marginLeft: 10, overflow: 'hidden' }} resizeMode='stretch' source={{ uri: item.images[0].image }}> */}
                        <ImageBackground style={{ height: 180, width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10, marginLeft: 10, overflow: 'hidden' }} resizeMode='stretch'
                          source=
                          // {item.images?.[0]?.image ? { uri: item.images?.[0]?.image } : require('../../assets/plasma.png')}
                          {{ uri: item.images?.[0]?.image }}
                        >
                          <View style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: 5 }}>
                            <TouchableOpacity onPress={async () => {

                              await handleWishlist(item?.id, 2)


                            }} style={{ marginRight: 10 }}>
                              <Image style={{ height: 25, width: 25, tintColor: "#B357C3", }} source={item?.wishlist ? require("../../assets/heartFilled.png") : require("../../assets/heart.png")}></Image>


                            </TouchableOpacity>
                            <ShareComponent title={item.title} />

                          </View>

                        </ImageBackground>

                        <View style={{ width: '100%', backgroundColor: 'white', marginLeft: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, paddingBottom: 10, padding: 5, }}>
                          <Text style={{ fontFamily: FONTFAMILY, fontSize: 16, color: CARDTITLECOLOR, padding: 5, fontFamily: FONTFAMILY, fontWeight: '700' }}>{sliceTitle(item.title, 24)}</Text>

                          <View style={{ flexDirection: "row", gap: 20, alignItems: 'center', marginBottom: 5 }}>

                            <View style={{ flexDirection: 'row' }}>
                              <Text style={[{ fontFamily: FONTFAMILY, fontSize: 14, color: "#B357C3", padding: 4, }, StrikeThough]}>${item.price}</Text>
                              <Text style={{ fontFamily: FONTFAMILY, fontSize: 14, color: "#B357C3", padding: 4, }}>${item.sale_price}</Text>
                            </View>
                            <View style={{ flexDirection: "row", padding: 4, }}>
                              <Image style={{ height: 12, width: 12, marginTop: 1 }} source={require("../../assets/star.png")}></Image>
                              <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "#000", }}> {item?.rating}</Text>
                            </View>
                          </View>


                          <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5 }}>
                            <TouchableOpacity onPress={async () => {
                              setLoading(true)
                              // await toggleCartAddRemove(item?.id, 2, userdetaile.access_token, item?.in_cart ? remove_cart : add_cart)
                              // // await getHomedata()
                              // await getCartList()



                              await toggleCartAddRemove(item?.id, 2, userdetaile.access_token, item?.in_cart ? remove_cart : add_cart, async () => {

                                await getCartList()

                                setLoading(false)

                              }, async (msg) => {

                                showAddToCartErrorComp({

                                  approveFunc: async () => {
                                    await toggleCartAddRemove(item?.id, 2, userdetaile.access_token, item?.in_cart ? remove_cart : add_cart)
                                    await getCartList()
                                    // getCartList()
                                    setLoading(false)

                                  },

                                  msg: msg,
                                  cancelFunc: () => { setLoading(false) }



                                }
                                )



                              })
                              // setLoading(false)
                            }} style={{ width: '48%', paddingVertical: 10, borderRadius: 4, justifyContent: 'center', backgroundColor: '#B357C3' }}>
                              <Text style={{ fontFamily: FONTFAMILY, color: '#fff', textAlign: 'center', fontWeight: '600' }}>{item?.stock_available ? item?.in_cart ? 'Remove from Cart' : 'Add to Cart' : "Stock Out"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={async () => {

                              if (item?.in_cart) {
                                props.navigation.navigate('ProductCart')
                                return
                              }
                              setLoading(true)
                              // await toggleCartAddRemove(item?.id, 2, userdetaile.access_token, item?.in_cart ? remove_cart : add_cart)
                              // // props.navigation.navigate('ProductCart')
                              // // await getHomedata()
                              // await getCartList()


                              await toggleCartAddRemove(item?.id, 2, userdetaile.access_token, item?.in_cart ? remove_cart : add_cart, async () => {
                                props.navigation.navigate('ProductCart')
                                await getCartList()

                                setLoading(false)

                              }, async (msg) => {

                                showAddToCartErrorComp({

                                  approveFunc: async () => {
                                    await toggleCartAddRemove(item?.id, 2, userdetaile.access_token, item?.in_cart ? remove_cart : add_cart)
                                    props.navigation.navigate('ProductCart')
                                    await getCartList()
                                    // getCartList()
                                    setLoading(false)

                                  },

                                  msg: msg,
                                  cancelFunc: () => { setLoading(false) }



                                }
                                )



                              })





                              // setLoading(false)
                            }} style={{ width: '48%', paddingVertical: 10, borderRadius: 4, justifyContent: 'center', backgroundColor: '#4556A6' }}
                            >
                              <Text style={{ fontFamily: FONTFAMILY, color: '#fff', textAlign: 'center', fontWeight: '600' }}>Buy Now</Text>
                            </TouchableOpacity>

                          </View>


                        </View>

                      </TouchableOpacity>

                    )
                  }}
                  keyExtractor={item => item.id}
                />
              </View>
            </View>
            {/* **************************** message part****************** */}

            {/* <ImageBackground resizeMode='stretch' source={require('../../assets/Profile_last_img.png')} style={{ width: '100%', height: 180, marginTop: 15, alignSelf: 'center' }} >


          </ImageBackground> */}


            {/* ****************************Blog View All****************** */}
            <View style={{ marginBottom: 20 }}>

              <View style={{ flexDirection: 'row', justifyContent: "space-between", width: "100%", alignSelf: "center" }}>

                <Text style={{ fontFamily: FONTFAMILY, fontSize: 18, color: "#fff", fontWeight: '700', }}>Plasma Pen Blogs</Text>

                <TouchableOpacity style={{ height: 30, width: '18%', backgroundColor: "#B357C3", borderRadius: 5, justifyContent: "center", alignSelf: "center", }}
                  onPress={() => { props.navigation.navigate('Blog') }}>
                  <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "#fff", textAlign: "center", fontWeight: '600' }}>View All</Text>
                </TouchableOpacity>


              </View>

              {/* ****************************Blog flatlist****************** */}
              <View style={{ marginTop: 10, }}>
                <FlatList
                  data={blogs}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity style={{
                        width: dimensions.SCREEN_WIDTH * 80 / 95, alignSelf: 'center', marginRight: 10,
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 8,
                        },
                        shadowOpacity: 0.10,
                        shadowRadius: 4.65,

                        elevation: 13,
                      }}
                        onPress={() => { props.navigation.navigate('BlogDetails', { blogID: item?.id }) }}>
                        <ImageBackground style={{ height: 180, width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10, overflow: 'hidden' }} resizeMode='stretch' source=
                          // {require("../../assets/Rectangle1036.png")}
                          {{ uri: item.images[0].image }}
                        >

                        </ImageBackground>

                        <View style={{
                          width: '100%', backgroundColor: '#fff', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, padding: 10,
                          height: 'auto'
                          //  (dimensions.SCREEN_WIDTH * 80 / 148) / 1.31 
                        }}>
                          <Text style={{ fontFamily: FONTFAMILY, fontSize: 16, color: CARDTITLECOLOR, padding: 5, fontFamily: FONTFAMILY, fontWeight: '700' }}>{sliceTitle(item.title, 32)}</Text>

                          <View style={{ flexDirection: "row", width: dimensions.SCREEN_WIDTH * 80 / 100, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', marginRight: 5, marginLeft: 7 }}>
                              <Text style={{ fontFamily: FONTFAMILY, fontSize: 14, color: "#000", paddingVertical: 4, fontFamily: FONTFAMILY, fontWeight: '700' }}>By-</Text>
                              <Text style={{ fontFamily: FONTFAMILY, fontSize: 14, color: "#B357C3", paddingVertical: 4, fontFamily: FONTFAMILY, fontWeight: '700' }}>{item?.created_by}</Text>

                            </View>

                            <View style={{ flexDirection: "row", padding: 4, marginLeft: 5 }}>
                              <Image style={{ height: 15, width: 15, marginTop: -1 }} source={require("../../assets/calendar.png")}></Image>
                              <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "#B357C3", marginLeft: 3, fontFamily: FONTFAMILY, fontWeight: '700' }}>{item.updated_at.split(" ")[0]}</Text>
                            </View>

                            <TouchableOpacity style={{ height: 25, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginLeft: 5, paddingHorizontal: 10 }}>
                              <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "#B357C3", textAlign: "center", fontWeight: '700', fontFamily: FONTFAMILY, }}>Skin care tips</Text>
                            </TouchableOpacity>


                          </View>

                          <View style={{}}>

                            <Text style={{ fontFamily: FONTFAMILY, fontSize: 14, color: "#292D32", marginTop: 5, marginLeft: 5, height: 'auto', fontFamily: FONTFAMILY }}>{sliceTitle(item.description, 180)}</Text>

                          </View>
                          {/* <View style={{ height: 20, width: 100, backgroundColor: 'red' }} /> */}
                        </View>


                      </TouchableOpacity>

                    )
                  }}
                  keyExtractor={item => item.id}
                />
              </View>

            </View>
            {/* ****************************Community flatlist****************** */}




            <View style={{ marginBottom: 20 }}>


              <View style={{ flexDirection: 'row', justifyContent: "space-between", width: "100%", alignSelf: "center" }}>

                <Text style={{ fontFamily: FONTFAMILY, fontSize: 18, color: "#fff", fontWeight: '700', }}>Followed Communities</Text>

                <TouchableOpacity style={{ height: 30, width: '18%', backgroundColor: "#B357C3", borderRadius: 5, justifyContent: "center", alignSelf: "center", }}
                  onPress={() => { props.navigation.navigate('AllCommunities') }}>
                  <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "#fff", textAlign: "center", fontWeight: '600' }}>View All</Text>
                </TouchableOpacity>


              </View>
              <View style={{ marginTop: 10, width: dimensions.SCREEN_WIDTH * 97 / 100, alignSelf: 'flex-start', right: 5 }}>
                <FlatList
                  data={community}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity style={{
                        width: dimensions.SCREEN_WIDTH * 75 / 100, marginRight: 20,

                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 8,
                        },
                        shadowOpacity: 0.10,
                        shadowRadius: 4.65,

                        elevation: 13,
                      }}
                        onPress={() => {
                          if (!(item?.is_followed)) {
                            Toast.show("Please follow the community first")
                            return
                          }

                          props.navigation.navigate('CommunityDetails', { "communityID": item?.id })
                        }}>
                        <ImageBackground style={{ height: 180, width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10, overflow: 'hidden', marginLeft: 10, }} resizeMode='stretch'
                          // source={require("../../assets/Rectangle.png")}
                          source={{ uri: item?.images[0]?.image }}
                        // source={{ uri: 'https://www.niletechinnovations.com/projects/plasmapen/public/uploads/blog/75732842-a1d5-422a-bb85-e097b81c11e4.f1703162864_4b32b63c5c28c858e051e9d1a2a717a1.jpg' }}
                        // source={{ uri: 'https://www.niletechinnovations.com/projects/plasmapen/public/uploads/product/Copy-of-Plasma-Pen-Classic-Render-009.webp' }}
                        >
                          {/* <View style={{ width: '100%', height: '100%', alignSelf: 'center', padding: 10, backgroundColor: 'black', opacity: 0.5 }}>


                    </View> */}



                        </ImageBackground>

                        <View style={{ width: '100%', backgroundColor: '#fff', marginLeft: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, padding: 10 }}>

                          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, alignItems: 'center' }}>
                            <Text style={{ fontFamily: FONTFAMILY, fontSize: 16, color: CARDTITLECOLOR, fontFamily: FONTFAMILY, fontWeight: '700' }}>{sliceTitle(item?.name, 21)}</Text>
                            <TouchableOpacity style={{ backgroundColor: "#B357C3", borderRadius: 5, justifyContent: "center", alignSelf: "center", padding: 8 }}
                              onPress={() => { toggleFollow(item?.is_followed ? 0 : 1, item?.id) }}>
                              <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "#fff", textAlign: "center" }}>{item?.is_followed ? "Unfollow" : "Follow"}</Text>
                            </TouchableOpacity>
                          </View>

                          <View style={{ backgroundColor: 'transparent', flexDirection: 'row', width: '100%', marginTop: 5, alignItems: 'center', gap: 20 }}>
                            {/* <View style={{ width: 100, height: 27, backgroundColor: '#000', justifyContent: 'center', borderRadius: 5, }}>
                            <Text style={{fontFamily:FONTFAMILY, fontSize: 10, color: '#fff', textAlign: 'center' }}>Community</Text>
                          </View> */}


                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', }}>
                              <View style={{ flexDirection: 'row', zIndex: 999 }}>
                                <Image style={{ height: 28, width: 28, }} source={require("../../assets/Rectangle103.png")}></Image>
                                <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: CARDTITLECOLOR, marginTop: 5, marginLeft: 10 }}> {item?.community_follower} Followers</Text>
                              </View>
                              {/* <Image style={{ height: 15, width: 100, }} source={require("../../assets/Plasmapen_icon.png")}></Image> */}
                            </View>
                            <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: '#B357C3', opacity: 1, fontFamily: FONTFAMILY }}>{item?.community_post} Posts</Text>
                          </View>



                        </View>
                      </TouchableOpacity>

                    )
                  }}
                  keyExtractor={item => item.id}
                />
              </View>
            </View>



            {/*  */}

            {/* Goal New */}
            <TouchableOpacity onPress={() => props.navigation.navigate('CreateGoal')}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: Mycolors.Purple,
                marginTop: 5,
                width: '100%',
                alignSelf: 'center',
                height: 90,
                borderRadius: 10,
                alignItems: 'center',
                marginBottom: 20,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 8,
                },
                shadowOpacity: 0.10,
                shadowRadius: 4.65,

                elevation: 13,
              }}>
              <ImageBackground resizeMode='cover' style={{ height: 90, width: '100%', marginLeft: 0, overflow: 'hidden', paddingHorizontal: 15 }} source={require("../../assets/wave_lines-bg.png")} >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 90, }}>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={require('../../assets/goalIcon.png')}
                      style={{ width: 74, height: 68, }}
                    />
                    <Text style={{ fontFamily: FONTFAMILY, fontSize: 20, color: 'white', padding: 5, fontFamily: FONTFAMILY, fontWeight: '600', marginLeft: 10 }}>{"Set Your Goal"}</Text>
                  </View>
                  <View style={{ backgroundColor: "#fff", borderRadius: 5, justifyContent: "center", alignSelf: "center", paddingVertical: 15, paddingHorizontal: 30 }}>
                    <Text style={{ fontFamily: FONTFAMILY, fontSize: 16, color: "#4556A6", textAlign: "center", fontWeight: "700", fontFamily: FONTFAMILY, }}>{'Go'}</Text>
                  </View>

                </View>
              </ImageBackground>
            </TouchableOpacity>
            {/* ----------- Goal New */}
            {/* ****************************Schedule View All****************** */}


            {/* ****************************Schedule Calendra****************** */}
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: "space-between", width: "100%", alignSelf: "center" }}>

                <Text style={{ fontFamily: FONTFAMILY, fontSize: 18, color: "#fff", fontWeight: '700', fontFamily: FONTFAMILY }}>Schedule</Text>




              </View>
              <View style={{ marginTop: 10, borderRadius: 10, overflow: 'hidden', backgroundColor: '#fff', padding: 10 }}>
                <Calendar

                  onDayPress={day => {
                    setSelected(day.dateString);
                    console.log("day.dateString", day.dateString);
                    props.navigation.navigate('CalendarListScreen', { dateString: day.dateString })
                  }}
                  // markedDates={{
                  //   [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                  // }}
                  markedDates={markedDatesData ? {
                    ...markedDatesData,

                    // [selected]: { selected: false, disableTouchEvent: false }
                  } : {
                    // [selected]: { selected: false, disableTouchEvent: false }
                  }}
                  markingType={'custom'}
                />

                <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', marginTop: 25 }}>
                  <TouchableOpacity style={{ paddingVertical: 6, borderRadius: 5, justifyContent: 'center', backgroundColor: '#0000FF', paddingHorizontal: 20 }}
                    onPress={() => { }}>
                    <Text style={{ fontFamily: FONTFAMILY, color: '#fff', textAlign: 'center', fontSize: 10, fontWeight: '900', fontFamily: FONTFAMILY }}>Goal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ paddingVertical: 6, borderRadius: 5, justifyContent: 'center', backgroundColor: '#FFA500', paddingHorizontal: 20, marginLeft: 15 }}
                    onPress={() => { }}>
                    <Text style={{ fontFamily: FONTFAMILY, color: '#fff', textAlign: 'center', fontSize: 10, fontWeight: '900', fontFamily: FONTFAMILY }}>Schedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ paddingVertical: 6, borderRadius: 5, justifyContent: 'center', backgroundColor: '#EE82EE', paddingHorizontal: 20, marginLeft: 15 }}
                    onPress={() => { }}>
                    <Text style={{ fontFamily: FONTFAMILY, color: '#fff', textAlign: 'center', fontSize: 10, fontWeight: '900', fontFamily: FONTFAMILY }}>Goal and Schedule</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
            {/* ****************************last flatList****************** */}



            {/* Rating */}
            {!isReviewed && <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                // height: 193,
                width: '100%',
                // backgroundColor: Mycolors?.Purple,
                // backgroundColor: "white",
                borderRadius: 10,
                overflow: 'hidden',
                // alignSelf: 'center',
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 8,
                },
                shadowOpacity: 0.10,
                shadowRadius: 4.65,

                elevation: 13,
              }}
            >


              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  // marginTop: 20,
                  paddingHorizontal: 15,
                  justifyContent: 'space-between',
                  // marginHorizontal: 12,
                  backgroundColor: "red",
                  width: '100%',
                  // height: '100%',
                  paddingVertical: 15,
                  backgroundColor: "white",
                }}
              >
                <View style={{ flexDirection: 'column', width: dimensions.SCREEN_WIDTH * 0.50, backgroundColor: "white", }}>
                  <Text
                    style={{ fontSize: 16, color: CARDTITLECOLOR, fontFamily: FONTFAMILY, fontWeight: '700' }}
                  >
                    {/* {item.title} */}
                    Rate Us
                  </Text>
                  <Text
                    style={{
                      fontWeight: '700',
                      fontSize: 14,
                      color: "grey",
                      fontFamily: FONTFAMILY,
                      // marginTop: 8,
                      lineHeight: 24,
                    }}
                  >
                    Your Valuable Feedback!!
                  </Text>

                  {/* <View style={{ flexDirection: 'row', marginTop: 5, }}>
                    <Image
                      source={require('../../assets/star.png')}
                      style={{ height: responsiveHeight(2), width: responsiveHeight(2), borderRadius: 20, marginRight: responsiveWidth(1.2) }}
                    />
                    <Image
                      source={require('../../assets/star.png')}
                      style={{ height: responsiveHeight(2), width: responsiveHeight(2), borderRadius: 20, marginRight: responsiveWidth(1.2) }}
                    />
                    <Image
                      source={require('../../assets/star.png')}
                      style={{ height: responsiveHeight(2), width: responsiveHeight(2), borderRadius: 20, marginRight: responsiveWidth(1.2) }}
                    />
                    <Image
                      source={require('../../assets/star.png')}
                      style={{ height: responsiveHeight(2), width: responsiveHeight(2), borderRadius: 20, marginRight: responsiveWidth(1.2) }}
                    />
                    <Image
                      source={require('../../assets/star.png')}
                      style={{ height: responsiveHeight(2), width: responsiveHeight(2), borderRadius: 20, marginRight: responsiveWidth(1.2) }}
                    />
                  </View> */}


                  <View style={{ alignSelf: 'flex-start' }}>
                    <Rating
                      startingValue={rating}
                      type="star"
                      // rating={}
                      fractions={0} // Allow half-star ratings
                      readonly={false} // Allow user interaction
                      // onFinishRating={(rating) => {
                      //     console.log(rating);
                      //     // setRating(rating)

                      // }}
                      // reviewSize={50}
                      imageSize={responsiveHeight(2.5)}
                      style={{
                        // marginBottom: 20,
                        // height: 10
                        margin: 0
                      }}
                      onFinishRating={(val) => {
                        console.log("onFinishRating", val);
                        setRating(val)
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    style={{
                      height: 36,
                      width: 150,
                      borderRadius: 5,
                      backgroundColor: Mycolors.Purple,
                      marginTop: 8,
                      // marginBottom: 30,
                    }}
                    onPress={() => {
                      // setEditModal(true), setDataModal(item);
                      // setAnnouncementModal(true)

                      postAppReviewRating()
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: 12,
                        color: "white",
                        fontFamily: FONTFAMILY,
                        marginTop: 9,
                        alignSelf: 'center',
                      }}
                    >
                      Submit Rating
                    </Text>
                  </TouchableOpacity>
                </View>

                <Image
                  source={require('../../assets/cuate.png')}
                  style={{ height: 125, width: 125, borderRadius: 20, }}
                />
              </View>


            </View>
            }

            {/* {loading ?
            <Loader />
            : null
          } */}
            <View style={{ width: 50, height: 250 }} />
          </ScrollView>
        </View>
        {loading ?
          <Loader />
          : null
        }

        <Modal
          isVisible={announcementModal}
          swipeDirection="down"
          onBackdropPress={() => setAnnouncementModal(false)}
          onSwipeComplete={e => {
            setAnnouncementModal(false);
          }}
          // animationIn={'fadeIn'}
          // animationOut={'fadeOut'}
          scrollTo={() => { }}
          scrollOffset={1}
          propagateSwipe={true}
          coverScreen={false}
          backdropColor="transparent"
          style={{
            // justifyContent: 'flex-end',
            margin: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>

          <View
            style={{
              // height: '80%',
              backgroundColor: 'white',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              padding: 20,
              width: '99%',
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
              alignSelf: 'center',
              // marginTop: '25%',
              marginTop: '10%',
              paddingBottom: 25,
            }}>
            <View
              style={{
                // justifyContent: 'center',
                alignItems: 'center',
                // height: '100%',
                width: dimensions.SCREEN_WIDTH * 0.90,
                // backgroundColor: Mycolors?.Purple,
                borderRadius: 20,
                overflow: 'hidden',
              }}
            >
              {/* <Vies */}
              <View
                style={{
                  flexDirection: 'column',
                  // alignItems: 'flex-start',
                  marginTop: 4,
                  paddingHorizontal: 28,
                  justifyContent: 'space-between',
                  marginHorizontal: 12,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontWeight: '700',
                    fontSize: 16,
                    color: "black",
                    fontFamily: FONTFAMILY,
                  }}
                >
                  {/* {item.title} */}
                  {/* Annoucement */}
                  {announcementModalData?.title}
                </Text>

                <Image
                  source={{ uri: announcementModalData?.image }}
                  style={{ height: 125, width: 125, borderRadius: 20, marginTop: 20, }}
                />
                {/* <View style={{ flexDirection: 'column', width: dimensions.SCREEN_WIDTH * 0.50 }}> */}


                <Text
                  style={{
                    fontWeight: '700',
                    fontSize: 14,
                    color: "black",
                    fontFamily: FONTFAMILY,
                    marginTop: 20,
                    lineHeight: 24,

                  }}
                >
                  {/* {item?.description === undefined
                        ? ''
                        : item.description.length > 50
                          ? `${item?.description.substring(0, 50)}.....`
                          : `${item?.description.substring(0, 50)}`} */}
                  {announcementModalData?.description}
                </Text>
                <TouchableOpacity
                  style={{
                    // width: '85%',
                    height: 45,
                    backgroundColor: '#838E96',
                    alignSelf: 'center',
                    borderRadius: 5,
                    justifyContent: 'center',
                    padding: 10,
                    flexDirection: 'row',
                    marginTop: 20,
                  }}
                  onPress={() => { setAnnouncementModal(false) }}
                >
                  <Image source={require('../../assets/arrow.png')} style={{ width: 15, height: 15, alignSelf: 'center', tintColor: 'white', marginRight: 10 }}></Image>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontWeight: '600',
                      fontSize: 13,
                      color: 'white',
                    }}
                  >
                    {"Back to Home"}
                  </Text>
                </TouchableOpacity>
                {/* </View> */}


              </View>
              {/* </ImageBackground>
              </View> */}
            </View>
          </View>

        </Modal>

      </LinearGradient>
    </>
  );
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

});




export default Home

