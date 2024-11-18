import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Text, StyleSheet, SafeAreaView, ImageBackground, TextInput, Linking, BackHandler, FlatList, TouchableOpacity, Platform, Alert, PermissionsAndroid, ScrollView, StatusBar, useWindowDimensions, RefreshControl } from 'react-native';
import { Mycolors, dimensions } from '../../utility/Mycolors';
import HomeHeader from '../../component/HomeHeader';
import LinearGradient from 'react-native-linear-gradient'
import MyButtons from '../../component/MyButtons';
import { Rating } from 'react-native-ratings';
import { ImageSlider, ImageCarousel } from "react-native-image-slider-banner";
import { add_cart, product_details, remove_cart, requestGetApi, requestPostApi, update_product_quantity } from '../../WebApi/Service';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../WebApi/Loader';
import { saveUserResult, onLogoutUser, saveSelectedHairdresser, saveSeviceNavigation, saveSelectedService, saveSaloonDetails, saveUserToken, } from '../../redux/actions/user_action';
import MySearchBar from '../../component/MySearchBar';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import HomeHeader2 from '../../component/HomeHeader2';
import RenderHtml from 'react-native-render-html';
import { addToWishlist, toggleCartAddRemove, updateCartQty } from '../../WebApi/GlobalAPICalls';
import { StrikeThough } from '../../utility/FontStyles';
import useAPI from '../../utility/hooks/useAPI';
import { handleShare } from '../../component/ShareComponent';
import { FONTFAMILY, FONTFAMILYSEMIBOLD } from '../../utility/fonts';
import ReviewRating from '../../component/ReviewRating';
import { Pages } from 'react-native-pages';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import AddToCartHandleComponent from '../../component/AddToCartHandleComponent';



const ProductOrderHistory = (props) => {

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const userdetaile = useSelector(state => state.user.user_details);
  const [profileData, setprofileData] = useState('');
  const [pass, setpass] = useState('');
  const [cpass, setcpass] = useState('');
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');

  const [profileModal, setprofileModal] = useState(true);
  const [resetModal, setresetModal] = useState(false);
  const [defaultRating, setdefaultRating] = useState(0)
  const [defaultReviewText, setdefaultReviewText] = useState('')

  const [reloadGetAPI, setreloadGetAPI] = useState(false)
  const modalRef = useRef(null);


  const [data, setdata] = useState({
    "title": "PLASMA PEN™ CLASSIC",
    "description": "Our original device, designed for all beauty, aesthetics, and spa professionals. The Plasma Pen™ Classic delivers non-invasive fibroblast skin treatments. You’ll witness next-generation skin lifting, tightening, rejuvenation, revitalization, resurfacing, and regeneration.",
    "price": "4450",
    "images": [
      {
        "id": 14,
        "image": "https://www.niletechinnovations.com/projects/plasmapen/public/uploads/product/Copy-of-Plasma-Pen-Classic-Render-009.webp"
      },
      {
        "id": 13,
        "image": "https://www.niletechinnovations.com/projects/plasmapen/public/uploads/product/PlasmaPen-Horizontal.webp"
      }
    ],
    "status": "1",
    "review_list": [],
    "wishlist": false,
    "created_at": "06-21-2024 05:26AM",
    "updated_at": "07-02-2024 10:37AM"
  }
  )

  // const { handleWishlist,
  //     } = props.route.params




  const product_quantity = data?.quantity
  const product_id = props.route.params.data.id
  const { getCartList, AddToCartErrorComp, showAddToCartErrorComp } = useAPI()

  const handleWishlist = async () => {
    setLoading(true)
    await addToWishlist(product_id, 2, userdetaile.access_token)
    setLoading(false)
    await getCartList()
    getProductdata()
  }




  useEffect(() => {
    getProductdata()
  }, [reloadGetAPI])

  const getProductdata = async () => {
    setLoading(true);
    const { responseJson, err } = await requestGetApi(product_details + product_id, '', 'GET', userdetaile.access_token)

    setLoading(false);
    console.log('the courses data is==>>', responseJson.data);
    if (err == null) {
      if (responseJson.status) {

        setdata(responseJson.data);

      } else {

      }
    } else {
    }
  };

  // updateCartQty(0, setLoading=()=>{}, userdetaile.access_token, product_id, product_quantity, () => { getProductdata() })



  const { width } = useWindowDimensions();

  async function deleteReview(reviewID) {
    setLoading(true)
    const res = await deleteAPI({ endPoint: 'delete-rating?id=' + reviewID })
    setreloadGetAPI((val) => !val)
    setLoading(false)
  }

  return (

    <>
      <AddToCartErrorComp />
      <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1, }}>
        <SafeAreaView />
        <StatusBar />


        {/* ******************Store Header******************** */}
        <HomeHeader2
          height={60}
          // paddingHorizontal={15}
          title={' Product Details'}
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
              getProductdata()
            }} />}>
          <View style={{ width: dimensions.SCREEN_WIDTH - 20, height: 240, alignSelf: 'center' }}>
            <Pages indicatorColor={data?.images?.length > 1 ?'rgb(255, 255, 255)' : 'transparent'}>
              {data?.images?.map((item) => <View style={{ width: dimensions.SCREEN_WIDTH - 20, height: 240, backgroundColor: 'transparent', alignSelf: 'center', borderRadius: 10, overflow: 'hidden' }}>
                <ImageBackground source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} resizeMode='stretch'></ImageBackground>
              </View>)}
            </Pages>
          </View>
          <View>
            <Text style={{ fontFamily: FONTFAMILY, fontSize: 18, color: "#fff", fontWeight: "600", padding: 10 }}>{data?.title}</Text>

          </View>

          <View style={{ flexDirection: "row", marginLeft: 10, alignItems: 'center' }}>
            <Text style={[{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 25, color: "#B357C3", }, StrikeThough]}>${data?.price}</Text>
            <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 25, color: "#B357C3", }}> ${data?.sale_price}</Text>
            <Image style={{ height: 18, width: 18, marginLeft: 15, marginTop: 2 }} source={require("../../assets/star.png")}></Image>
            <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 18, color: "#fff", }}> {data.rating}</Text>
          </View>
          {data?.in_cart &&
            <View style={{ flexDirection: "row", marginTop: 10, marginLeft: 10 }}>

              <TouchableOpacity onPress={() => {
                updateCartQty(0, setLoading, userdetaile.access_token, product_id, product_quantity, (resp) => { getProductdata() }).catch((err) => {
                  console.error("updateCartQty", err);
                })
              }} style={{ width: 30, height: 30, backgroundColor: "#B357C3", justifyContent: "center", borderRadius: 5 }}>
                <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 20, color: "#fff", textAlign: "center", fontWeight: "400" }}>-</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ width: 47, height: 30, backgroundColor: "#FBE7FE", justifyContent: "center", borderRadius: 5, marginHorizontal: 5 }}>
                <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 15, color: "#000", textAlign: "center", fontWeight: "400" }}>{product_quantity}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                updateCartQty(1, setLoading, userdetaile.access_token, product_id, product_quantity, (resp) => { getProductdata() }).catch((err) => {
                  console.error("updateCartQty", err);
                })
              }} style={{ width: 30, height: 30, backgroundColor: "#B357C3", justifyContent: "center", borderRadius: 5 }}>
                <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 20, color: "#fff", textAlign: "center", fontWeight: "400" }}>+</Text>
              </TouchableOpacity>

            </View>
          }





          <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 }}>
            <TouchableOpacity style={{ width: '49%', paddingVertical: 8, borderRadius: 4, justifyContent: 'center', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', }}
              onPress={async () => {
                console.log("sss");

                // setselect1(false)
                setLoading(true)
                await handleWishlist()

                setLoading(false)
                getProductdata()
              }}>
              <Image style={{ height: 20, width: 20, tintColor: data?.wishlist ?'#B357C3': '#000', marginRight: 10 }} source={data?.wishlist ? require("../../assets/heartFilled.png") : require("../../assets/heart.png")}></Image>
              <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, color: '#000', textAlign: 'center' }}>{data?.wishlist ? "Remove From Wishlist" : "Add to Wishlist"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: '49%', paddingVertical: 8, borderRadius: 4, justifyContent: 'center', backgroundColor: '#B357C3', flexDirection: 'row', alignItems: 'center' }}
              onPress={async () => {
                {
                  // setselect1(true)
                  await handleShare(data?.title)
                }
              }}>
              <Image style={{ height: 20, width: 20, tintColor: '#fff', marginRight: 10 }} source={require("../../assets/ShareNetwork.png")}></Image>
              <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, color: '#fff', textAlign: 'center' }}>Share</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 15, color: "#fff", padding: 10, marginTop: 10 }}>Product Details</Text>
          {/* <Text style={{fontFamily:FONTFAMILY, fontSize: 11, color: "#fff", fontWeight: "600", width: '95%', alignSelf: 'center' }}>{data?.description}</Text> */}

          <View style={{ width: '95%', marginLeft: 10 }}>

            <RenderHtml
              contentWidth={width}
              // source={data?.description}
              source={{ html: `${data?.description}` }}
              defaultTextProps={{ selectable: true }}
              tagsStyles={{
                body: {
                  whiteSpace: 'normal',
                  color: 'white'
                }
              }}
            />
          </View>
          {/* {data?.total_purchase && */}
          <>
            {/******* *Rating card UI******* */}
            {/* {(resData?.purchased && resData?.course_status != 2) &&  */}

            {(data?.is_reviewed != null) &&
            <>
            <View
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
                      <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 14, color: '#fff', fontWeight: '500' }}>
                        Rating & Review
                      </Text>
                      <Text
                        style={{
                          fontSize: 18,
                          color: '#fff',
                          fontWeight: '500',
                          marginTop: 3,
                        }}>
                        {data.rating} {`(${data?.review_list &&
                          data?.review_list?.length})`}

                      </Text>
                    </View>
                  </View>
                  {/* {resData?.is_reviewed == null &&  */}
                  <TouchableOpacity
                    onPress={() => console.log(modalRef.current?.openModal())}
                    style={{ width: "40%", height: 40, backgroundColor: "#fff", borderRadius: 5, justifyContent: "center", alignSelf: "center", marginRight: 10 }}>
                    <Text style={{ fontFamily: FONTFAMILY, fontSize: 12, color: "#4556A6", textAlign: "center", fontWeight: "700" }}>Write your Review</Text>
                  </TouchableOpacity>
                  {/* } */}
                </View>
              </ImageBackground>
            </View>




            <FlatList
              data={
                data?.review_list ||
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
                          style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 14, color: '#000', fontWeight: '600' }}>
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
            </>
}
            {/* } */}
          </>
          {/* } */}
          {loading ?
            <Loader />
            : null
          }



          <View style={{ width: 50, height: 250 }} />
        </ScrollView>
        <View style={{ width: '100%', height: 170, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, position: 'absolute', bottom: 0, zIndex: 111 }}>

          <View style={{ flexDirection: "row", margin: 15, alignItems: 'center' }}>
            <Text style={{ fontFamily: FONTFAMILY, fontSize: 25, color: "#B357C3", }}>$ {data?.sale_price}</Text>
            <Text style={{ fontFamily: FONTFAMILY, fontSize: 12, color: "#000", }}>
              {/* (include all the taxas if applied*) */}
            </Text>
          </View>
          <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
            <AddToCartHandleComponent startLoader={() => setLoading(true)} id={product_id} type={2} in_cart={data?.in_cart} addRemoveButton={true} callback={getProductdata}>
              {/* <View style={{ width: responsiveWidth(42), paddingVertical: 10, borderRadius: 4, justifyContent: 'center', backgroundColor: 'white', flexDirection: 'row' }}>
                <Image style={{ height: 20, width: 20, tintColor: '#000', marginRight: 10 }} source={require("../../assets/shopbag.png")}></Image>
                <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, color: '#fff', textAlign: 'center' }}> {data?.in_cart ? "Remove from Cart" : "Add to cart"} </Text>
              </View> */}


              <TouchableOpacity disabled={true}
                onPress={async () => {
                  setLoading(true)

                  await toggleCartAddRemove(product_id, 2, userdetaile.access_token, data?.in_cart ? remove_cart : add_cart, async () => {

                    await getCartList()
                    getProductdata()
                    setLoading(false)

                  }, async (msg) => {

                    showAddToCartErrorComp({

                      approveFunc: async () => {
                        await toggleCartAddRemove(product_id, 2, userdetaile.access_token, data?.in_cart ? remove_cart : add_cart)
                        await getCartList()
                        getProductdata()
                        setLoading(false)

                      },

                      msg: msg,



                    }
                    )

                    // await getCourseDetail()


                  })
                  setLoading(false)


                }} style={{
                  width: dimensions.SCREEN_WIDTH * 0.47, paddingVertical: 8, borderRadius: 4, justifyContent: 'center', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', shadowColor: '#000000',
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowRadius: 5,
                  shadowOpacity: 0.20,
                  elevation: 5,
                }}
              // onPress={() => { props.navigation.navigate('ProductCart') }}
              >
                <Image style={{ height: 20, width: 20, tintColor: '#000', marginRight: 10 }} source={require("../../assets/shopbag.png")}></Image>
                <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, color: '#4556A6', textAlign: 'center', fontWeight: 600 }}>{data?.in_cart ? "Remove from Cart" : "Add to Cart"}</Text>
              </TouchableOpacity>

            </AddToCartHandleComponent>

            <AddToCartHandleComponent startLoader={() => setLoading(true)} id={product_id} type={2} in_cart={data?.in_cart} buyBtn={true} addRemoveButton={false} callback={getProductdata}>
            <TouchableOpacity disabled={true} style={{
              width: dimensions.SCREEN_WIDTH * 0.47, paddingVertical: 9, borderRadius: 4, justifyContent: 'center', backgroundColor: '#B357C3', flexDirection: 'row', alignItems: 'center', shadowColor: '#000000',
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowRadius: 5,
              shadowOpacity: 0.20,
              elevation: 5,
            }}
              onPress={async () => {

                if (data?.in_cart) {
                  props.navigation.navigate('ProductCart')
                  return
                }

                setLoading(true)
                // await toggleCartAddRemove(data?.in_cart)
                // await toggleCartAddRemove(product_id, 2, userdetaile.access_token, data?.in_cart ? remove_cart : add_cart)
                // props.navigation.navigate('ProductCart')
                // await getCartList()
                // getProductdata()
                // setLoading(false)

                await toggleCartAddRemove(product_id, 2, userdetaile.access_token, data?.in_cart ? remove_cart : add_cart, async () => {

                  await getCartList()
                  getProductdata()
                  setLoading(false)
                  props.navigation.navigate('ProductCart')

                }, async (msg) => {

                  showAddToCartErrorComp({

                    approveFunc: async () => {
                      await toggleCartAddRemove(product_id, 2, userdetaile.access_token, data?.in_cart ? remove_cart : add_cart)
                      await getCartList()
                      getProductdata()
                      setLoading(false)
                      props.navigation.navigate('ProductCart')

                    },

                    msg: msg,



                  }
                  )

                  // await getCourseDetail()


                })
                setLoading(false)

              }}
            >
              <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, color: '#fff', textAlign: 'center' }}>Buy Now</Text>
            </TouchableOpacity>
            </AddToCartHandleComponent>
          </View>
        </View>
      </LinearGradient>
      <ReviewRating startLoader={() => setLoading(true)} type={2} id={product_id} ref={modalRef} callback={() => {
        setreloadGetAPI((val) => !val)
      }}
        // reviewID={resData?.is_reviewed}

        defaultRating={defaultRating}
        defaultReviewText={defaultReviewText}
      />
    </>
  );
}
const styles = StyleSheet.create({


});
export default ProductOrderHistory