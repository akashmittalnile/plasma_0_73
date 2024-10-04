
import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Text, StyleSheet, SafeAreaView, ImageBackground, TextInput, Linking, BackHandler, FlatList, TouchableOpacity, Platform, Alert, PermissionsAndroid, ScrollView, StatusBar, RefreshControl } from 'react-native';
import { Mycolors, dimensions } from '../../utility/Mycolors';
import LinearGradient from 'react-native-linear-gradient'
import MyButtons from '../../component/MyButtons';
import { Rating } from 'react-native-ratings';
import { ImageSlider, ImageCarousel } from "react-native-image-slider-banner";
import { home, imgUrl, facilities, favorite, current_salon_by_hairdresser, all_services, requestGetApi, requestPostApi, cart_list, coupon_applied, cartItemType, remove_applied_coupon } from '../../WebApi/Service';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../WebApi/Loader';
import { saveUserResult, onLogoutUser, saveSelectedHairdresser, saveSeviceNavigation, saveSelectedService, saveSaloonDetails, saveUserToken, } from '../../redux/actions/user_action';
import MySearchBar from '../../component/MySearchBar';
import HomeHeader2 from '../../component/HomeHeader2';
// import Video, {VideoRef} from 'react-native-video';
import Video from 'react-native-video';
import TextInputArea from '../../component/TextInputArea';
// import {
//   LeadingActions,
//   SwipeableList,
//   SwipeableListItem,
//   SwipeAction,
//   TrailingActions,
// } from 'react-swipeable-list';
import Toast from 'react-native-simple-toast';
import { apiCallWrapper, updateCartQty } from '../../WebApi/GlobalAPICalls';
import { setCart } from '../../redux/reduxSlices/cartSlice';
import { StrikeThough } from '../../utility/FontStyles';
import NoDataFound, { NoDataFoundModule } from '../../component/NoDataFound';
import CouponPicker from './CouponPicker';
import useAPI from '../../utility/hooks/useAPI';
import LessonComp from '../../component/LessonComp';
import { removeNull, sliceTitle } from '../../utility/MyFunctions';
import { useIsFocused } from '@react-navigation/native';
import { FONTFAMILY } from '../../utility/fonts';

const ProductCart = (props) => {
  const [searchValue, setsearchValue] = useState('')
  const [homeData, sethomeData] = useState('')
  // const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const userdetaile = useSelector(state => state.user.user_details)
  const [lod, setlod] = useState(false);
  const [promo, setpromo] = useState('')
  const [select2, setselect2] = useState('')
  const [data, setdata] = useState({})
  const [courseCouponData, setCourseCouponData] = useState([])
  const [courseCouponPicker, setCourseCouponPicker] = useState(false)
  const [courseSelectedIDForCoupon, setCourseSelectedIDForCoupon] = useState(null)


  const [productCouponData, setProductCouponData] = useState([])
  const productDataForMainCartScreen = productCouponData.slice(0, 2)
  const [productCouponPicker, setProductCouponPicker] = useState(false)

  const { getAPI, postAPI } = useAPI()

  const isProduct = data?.type == cartItemType.product
  const couponCodeApplied = data?.data?.couponCode

  const isFocussed = useIsFocused()

  function selectProductDefaultAddress() {
    if (isProduct) {
      const default_address = data?.address?.find((item) => item?.default_address == 1)

      if (default_address) {
        return default_address
      }

    }

    return null
  }

  const shippingAddress = selectProductDefaultAddress()

  const cart = useSelector(state => state.cart.cartItems);

  const cartItems = Array.isArray(data?.data?.items) ? data?.data?.items : []
  // useEffect(() => {
  //   getCartData()
  // }, [cart])

  useEffect(() => {
    isFocussed && getCartData()
  }, [isFocussed])

  const getCartData = async () => {
    setLoading(true);
    const { responseJson, err } = await requestGetApi(cart_list, '', 'GET', userdetaile.access_token)

    setLoading(false);
    console.log('the courses data is==>>', responseJson);
    if (err == null) {
      if (responseJson.status) {

        console.log("getCartData", responseJson);

        if (responseJson?.type == cartItemType.product) {

          const res = await getAPI({ endPoint: 'coupons?type=2' })

          if (res) {
            setProductCouponData(res?.data)

            // console.log("setProductCouponData", res?.data);
          }

        }

        // dispatch(setCart(responseJson))
        setdata(responseJson)
        // setdata(responseJson.data);
        // Toast.show(responseJson.message);

      } else {
        setdata({})
        // Toast.show(responseJson.message);
        // dispatch(setCart(responseJson))
      }
    } else {
    }
  };




  async function togglePromo({ access_token = userdetaile?.access_token, action_type = coupon_applied, type = data?.type, promoCode = promo, courseID = null }) {

    console.log(courseID, promoCode, type);
    // return

    let formdata = new FormData();

    formdata.append('type', type);
    formdata.append('code', promoCode);
    formdata.append('course_id', courseID);

    setLoading(true);
    const { responseJson, err } = await requestPostApi(
      action_type,
      formdata,
      'POST',
      access_token,
    );
    setLoading(false);
    console.log('The edit profile responce is==>>', responseJson, err);
    if (err == null) {
      if (responseJson.status) {

        console.log(responseJson.message);
        Toast.show(responseJson.message);
        getCartData()
        return

        // getCourseDetail()
      } else {

        Toast.show(responseJson.message);
        return
      }
    } else {
      console.log('The error is==>>', err);
    }
  }

  // const leadingActions = () => (
  //   <LeadingActions>
  //     <SwipeAction onClick={() => console.info('swipe action triggered')}>
  //       Action name
  //     </SwipeAction>
  //   </LeadingActions>
  // );

  // const trailingActions = () => (
  //   <TrailingActions>
  //     <SwipeAction
  //       destructive={true}
  //       onClick={() => console.info('swipe action triggered')}
  //     >
  //       Delete
  //     </SwipeAction>
  //   </TrailingActions>
  // );

  function courseCouponHandleClick(item, index) {

    console.log(item, index);

    togglePromo({ promoCode: item?.code, courseID: courseSelectedIDForCoupon, type: 1, action_type: item?.applied ? remove_applied_coupon : coupon_applied })

  }

  function productCouponHandleClick(item, index) {

    console.log(item, index);
    // setpromo(item?.coupon_code)
    applyProductCoupon(item, index)

    // togglePromo({ promoCode: item?.code, courseID: item?.id, type: 1, action_type: item?.is_coupon_applied ? remove_applied_coupon : coupon_applied })

  }

  function removeProductCoupon(item, index) {

    togglePromo({ promoCode: item?.coupon_code, type: 2, action_type: remove_applied_coupon })

  }

  function applyProductCoupon(item, index) {

    togglePromo({ promoCode: item?.coupon_code, type: 2, action_type: coupon_applied })

  }

  async function removeItemCart(itemID) {

    await postAPI({
      endPoint: 'remove-cart', bodyJSON: {
        type: isProduct ? 2 : 1,
        id: itemID
      }
    })

    getCartData()

  }

  const marginTopBetweenCom = 25

  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1, }}>
      <SafeAreaView />
      <StatusBar />


      {/* ******************Header******************** */}
      <HomeHeader2
        height={60}
        // paddingHorizontal={15}
        title={'Cart'}
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
        // img3={require('../../assets/shoppingbag.png')}
        // img3width={25}
        // img3height={25}
        backgroundColor={'transparent'}
      />
      {/* <SwipeableList>
          <SwipeableListItem
          leadingActions={leadingActions()}
          trailingActions={trailingActions()}
          >
            Item content
          </SwipeableListItem>
        </SwipeableList> */}
      {cartItems?.length ?
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              getCartData()
            }} />}>


          <>
            <View style={{ marginTop: 10, }}>
              <FlatList
                data={cartItems}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {

                  return (
                    <View style={{ flexDirection: "row", width: dimensions.SCREEN_WIDTH * 95 / 100, alignSelf: 'center', marginTop: 15, backgroundColor: '#fff', borderRadius: 7, padding: 10, height: 150, alignItems: 'center', }}>
                      <Image style={{ height: 120, width: dimensions.SCREEN_WIDTH * 30 / 100, borderRadius: 7 }} source={
                        // require("../../assets/Rectangle104.png")
                        { uri: Array.isArray(item?.image) ? item?.image[0]?.image : item?.image }
                      }></Image>
                      <View style={{ marginLeft: 10, backgroundColor: 'transparent', height: 100, justifyContent: 'space-between', width: dimensions.SCREEN_WIDTH / 1.7 }}>

                        <View style={{ flexDirection: 'row', width: '100%', }}>
                          <Text style={{fontFamily:FONTFAMILY, fontSize: 16.5, color: "#000", }}>
                            {/* {item?.name?.length >= 10 ? (item?.name?.slice(0, 10)) : item?.name} */}
                            {sliceTitle(item?.name, 25)}
                          </Text>
                          <TouchableOpacity style={{ position: 'absolute', right: 1 }} onPress={() => {
                            removeItemCart(item?.id)
                          }}>
                            <Image style={{ width: 20, height: 20, }} tintColor={"#A13BB6"} source={require('../../assets/trash_icon.png')}></Image>
                          </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 8 }}>

                        {isProduct &&  <Text style={[{fontFamily:FONTFAMILY, fontSize: 16, color: "#B357C3", }, StrikeThough]}>$ {item?.regular_price || item?.pay_price}</Text>}
                          <Text style={{fontFamily:FONTFAMILY, fontSize: 16, color: "#B357C3", }}> $ {item?.sale_price || item?.pay_price}</Text>
                          <Image style={{ height: 12, width: 12, marginLeft: 15, marginTop: 2 }} source={require("../../assets/star.png")}></Image>
                          <Text style={{fontFamily:FONTFAMILY, fontSize: 15, color: "#000", }}> {item?.rating}</Text>
                        </View>

                        {isProduct ?
                          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, backgroundColor: 'transparent', width: '60%', height: 25, alignItems: 'center' }}>

                            <TouchableOpacity onPress={() => {
                              updateCartQty(0, setLoading, userdetaile.access_token, item?.id, item?.quantity, (resp) => { getCartData() }).catch((err) => console.error("updateCartQty", err))
                            }} style={{ width: 30, height: 25, backgroundColor: "#B357C3", justifyContent: "center", borderRadius: 8, alignItems: 'center' }}>
                              <Text style={{fontFamily:FONTFAMILY, fontSize: 20, color: "#fff", textAlign: "center", fontWeight: "400", marginBottom: 5 }}>-</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ width: 47, height: 25, backgroundColor: "#FBE7FE", justifyContent: "center", borderRadius: 4 }}>
                              <Text style={{fontFamily:FONTFAMILY, fontSize: 15, color: "#000", textAlign: "center", fontWeight: "400" }}>{item?.quantity}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                              updateCartQty(1, setLoading, userdetaile.access_token, item?.id, item?.quantity, (resp) => { getCartData() }).catch((err) => console.error("updateCartQty", err))
                            }} style={{ width: 30, height: 25, backgroundColor: "#B357C3", justifyContent: "center", borderRadius: 7 }}>
                              <Text style={{fontFamily:FONTFAMILY, fontSize: 20, color: "#fff", textAlign: "center", fontWeight: "400", marginBottom: 5 }}>+</Text>
                            </TouchableOpacity>

                          </View>
                          :
                          <>
                            <View style={{ flexDirection: 'row', width: 200, justifyContent: 'space-between',alignItems: 'center' }}>
                              {/* <TouchableOpacity style={{ paddingHorizontal: 5, paddingVertical: 5, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginTop: 8 }}>
                                <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#B357C3", textAlign: "center" }}>{item?.lesson_count} lessons</Text>
                              </TouchableOpacity> */}

                              <LessonComp count={item?.lesson_count} style={{ marginTop: 8 }} />

                              {item?.coupons?.length >= 1 && <TouchableOpacity onPress={() => {
                                // togglePromo({ promoCode: item?.coupons[0]?.code, courseID: item?.id, type: 1, action_type: item?.is_coupon_applied ? remove_applied_coupon : coupon_applied })

                                setCourseCouponData(item?.coupons)
                                setCourseCouponPicker(true)
                                setCourseSelectedIDForCoupon(item?.id)
                              }} style={{ paddingHorizontal: 8, paddingVertical: 7, backgroundColor: "#B357C3", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginTop: 8 }}>
                                <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "white", textAlign: "center",fontWeight: "500" }}>{item?.is_coupon_applied ? 'Change Coupon' : 'Apply Coupon'}</Text>
                              </TouchableOpacity>
                              }
                            </View>
                          </>
                        }

                      </View>
                    </View>

                  )
                }}
                keyExtractor={item => item.id}
              />
            </View>

            {/* {isProduct &&
              <>
                <View style={[{
                  width: '95%', backgroundColor: "white", borderRadius: 6, alignSelf: "center", marginTop: 20, borderColor: '#fff', borderWidth: 1.5,

                }, { borderWidth: 0, padding: 5 }]}>

                 

                  <View style={{ flexDirection: "row", alignSelf: 'center', }}>

                    <TextInput
                      // editable
                      // multiline
                      // numberOfLines={4}
                      // maxLength={40}
                      onChangeText={(text) => { setpromo(text) }}
                      value={promo}
                      style={{
                        height: '100%', width: "71%",
                        // borderWidth: 1, borderColor: '#fff',
                        borderRadius: 4, color: 'grey', marginLeft: 12
                      }}
                      placeholder='Promo Code'
                      placeholderTextColor={'grey'}


                    />

                    <TouchableOpacity onPress={() => {
                      apiCallWrapper(async () => togglePromo({}))
                    }} style={{ width: '23%', height: 45, backgroundColor: "#B357C3", borderRadius: 5, marginLeft: 10, justifyContent: "center", }}>
                      <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", textAlign: "center", fontWeight: "400" }}>Apply</Text>
                    </TouchableOpacity>

                  </View>

                </View>
              </>
            } */}

            {/* Coupon Header Section */}
            {isProduct && productCouponData?.length != 0 &&
              <View style={{ flexDirection: 'row', justifyContent: "space-between", width: "95%", alignSelf: "center", marginTop: marginTopBetweenCom, alignItems: '' }}>


                <Text style={{fontFamily:FONTFAMILY, fontSize: 18, color: "#fff", alignSelf: 'center', fontWeight: '500' }}>Coupons</Text>

                <TouchableOpacity style={{ height: 30, width: '18%', backgroundColor: "#B357C3", borderRadius: 7, justifyContent: "center", alignSelf: "center", }}
                  onPress={() => {
                    // props.navigation.navigate('HomeViewAll') 
                    setProductCouponPicker(true)
                  }}>
                  <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", textAlign: "center", fontWeight: "400" }}>View All</Text>
                </TouchableOpacity>


              </View>
            }
            {/* Coupon Header Section */}

            {isProduct && productDataForMainCartScreen?.length >= 1 &&

              productDataForMainCartScreen?.map((item, index) => <TouchableOpacity onPress={() => {
                // productCouponHandleClick(item, index)
                applyProductCoupon(item, index)
              }} key={index} style={{ width: '95%', backgroundColor: "#fff", alignSelf: "center", borderRadius: 8, padding: 20, marginTop: 20, flexDirection: "row", justifyContent: "space-between", alignItems: 'center', }}>
                {item?.coupon_code == couponCodeApplied &&
                  <TouchableOpacity onPress={() => {
                    removeProductCoupon(item, index)
                  }} style={{ position: 'absolute', right: -5, top: -9, padding: 2, backgroundColor: 'white', borderRadius: 50 }}>
                    <Image style={{ width: 20, height: 20, }} tintColor={"#A13BB6"} source={require('../../assets/crossed.png')}></Image>
                  </TouchableOpacity>}
                {/* <View style={{backgroundColor: "#2D005B", padding: 5}}> */}
                <View style={{ flexDirection: 'row' }}>
                  <Image style={{ width: 25, height: 25, alignSelf: "center", }} tintColor={"#A13BB6"} source={require('../../assets/ic_coupon.png')}></Image>
                  {/* </View> */}
                  <View style={{ flexDirection: 'column', marginLeft: 15 }}>
                    <Text style={[styles.cartPrice, { fontSize: 14.5 }]}>{String(item?.description).length >= 30 ? String(item?.description).slice(0, 35) + '...' : String(item?.description)}</Text>
                    <Text style={[styles.cartPrice, { color: '#1DA24A', fontSize: 14.5 }]}>Discount Amount: $ {item?.coupon_discount_amount},</Text>
                  </View>
                </View>
                <TouchableOpacity style={[{ flexDirection: 'column', borderStyle: 'dashed', }, { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', }]}>
                  <Text style={[styles.cartPrice, { color: '#B357C3', fontSize: 14.5 }]}>{item?.coupon_code}</Text>
                </TouchableOpacity>
                {/* <View style={[{ height: 1, overflow: 'hidden' }]}>
                <View style={[{ height: 2, borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed' }]}>
                <Text style={styles.cartPrice}>{"July30"}</Text>
                </View>
              </View> */}

              </TouchableOpacity>)

            }

            {(isProduct) &&

              <View style={{ flexDirection: 'row', justifyContent: "space-between", width: "95%", alignSelf: "center", marginTop: marginTopBetweenCom, alignItems: '' }}>


                <Text style={{fontFamily:FONTFAMILY, fontSize: 18, color: "#fff", alignSelf: 'center', fontWeight: '500' }}>Delivery Address</Text>

                <TouchableOpacity style={{ height: 30,  backgroundColor: "#B357C3", borderRadius: 30, justifyContent: "center", alignSelf: "center", }}
                  onPress={() => {
                    props.navigation.navigate('SipingAddress')

                  }}>
                  {/* <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", textAlign: "center", fontWeight: "400" }}>Change</Text> */}
                  <Image style={{ width: 30, height: 30, }} tintColor={'white'} source={require('../../assets/addPlus.png')}></Image>
                </TouchableOpacity>


              </View>}

            {(isProduct && shippingAddress) &&
              <>



                <TouchableOpacity
                  onPress={() => { }}

                  style={{
                    width: '95%',
                    borderColor: Mycolors.GrayColor,
                    borderWidth: 0.02,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 17,
                    paddingHorizontal: 17,
                    borderRadius: 7,
                    backgroundColor: '#fff',
                    marginTop: 15,
                    alignSelf: 'center'
                    //   justifyContent: 'space-between',
                  }}
                >

                  <View style={{}}>
                    <TouchableOpacity onPress={() => { }} style={{ height: 30, width: 30, borderRadius: 20, borderWidth: 1, borderColor: '#B357C3', justifyContent: 'center', marginRight: 10 }}>
                      {true == 1 && <View style={{ width: 20, height: 20, borderRadius: 15, backgroundColor: '#B357C3', alignSelf: 'center' }} />}
                    </TouchableOpacity>

                  </View>
                  <View style={{ marginLeft: 10, width: '68%' }}>
                    <Text
                      style={{
                        color: Mycolors.TEXT_COLOR,
                        fontWeight: '500',
                        fontSize: 16, fontFamily:FONTFAMILY
                        
                      }}>
                      {shippingAddress?.address_type}
                    </Text>

                    <Text
                      style={{
                        color: Mycolors.GrayColor,
                        fontWeight: '300',
                        fontSize: 14,
                        top: 2, fontFamily:FONTFAMILY
                      }}>
                      {removeNull(`${shippingAddress?.address_line_1}, ${shippingAddress?.address_line_2}, ${shippingAddress?.city}, ${shippingAddress?.state}, ${shippingAddress?.country}, ${shippingAddress?.zip_code}`)}
                    </Text>
                  </View>

                </TouchableOpacity>
              </>
            }

            {(isProduct && !shippingAddress) && 
            <NoDataFoundModule msg='No Address Found!' marginBottom={0} styles={{marginTop: 15}}/>
            }

              <View style={{ width: '95%', backgroundColor: "#fff", alignSelf: "center", borderRadius: 8, padding: 10, marginTop: marginTopBetweenCom }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 7 }}>

                  <Text style={[styles.cartPrice, { fontSize: 15 }]}>Sub Total({data?.data?.totalItem})</Text>
                  <Text style={[styles.cartPrice, { fontSize: 15 }]}>$ {data?.data?.subTotal}</Text>

                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 7 }}>

                  <Text style={[styles.cartPrice, { fontSize: 15 }]}>Tax</Text>
                  <Text style={[styles.cartPrice, { fontSize: 15 }]}>$ {data?.data?.tax}</Text>

                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 7 }}>

                  <Text style={[styles.cartPrice, { color: "#B357C3", fontSize: 15 }]}>Discount</Text>
                  <Text style={[styles.cartPrice, { color: "#B357C3", fontSize: 15 }]}> - $ {data?.data?.couponPrice}</Text>

                </View>
                <View style={{ width: '100%', height: 0.4, backgroundColor: '#000', marginTop: 7 }} />
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, marginBottom: 7 }}>

                  <Text style={[styles.cartPrice, { fontWeight: "500", fontSize: 16 }]}>Total</Text>
                  <Text style={[styles.cartPrice, { fontWeight: "500", fontSize: 16 }]}>$ {data?.data?.totalPrice}</Text>

                </View>





              </View>

            {isProduct ? <TouchableOpacity disabled={shippingAddress ? false : true} style={{ width: '95%', height: 50, backgroundColor: "#B357C3", borderRadius: 7, marginTop: marginTopBetweenCom, justifyContent: "center", alignSelf: 'center' }}
              onPress={() => {
                if (shippingAddress) {
                  props.navigation.navigate('ProductPaymentMethod', { address: shippingAddress?.id })
                  return
                }

                Toast.show("Select an Address!")

              }}>
              <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#fff", textAlign: "center", fontWeight: "400" }}>PROCEED TO PAYMENT</Text>
            </TouchableOpacity>
              :
              <TouchableOpacity style={{ width: '95%', height: 50, backgroundColor: "#B357C3", borderRadius: 7, marginTop: marginTopBetweenCom, justifyContent: "center", alignSelf: 'center' }}
                onPress={() => { props.navigation.navigate('ProductPaymentMethod') }}>
                <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#fff", textAlign: "center", fontWeight: "400" }}>PROCEED TO PAYMENT</Text>
              </TouchableOpacity>

            }
          </>




        </ScrollView>
        : <NoDataFound msg='Cart is Empty !' />
      }
      {loading ?
        <Loader />
        : null
      }
      <View style={{ width: 50, height: 45 }} />
      <CouponPicker showPicker={courseCouponPicker} title='Select a Coupon' arr={courseCouponData}
        handleClose={() => {
          setCourseCouponPicker(false)
        }}
        handleSubmit={courseCouponHandleClick}
        couponDescKey='description'
        couponCodeKey='code'
        discAmountKey='discount_amount'
        couponCodeApplied={(item, index) => {
          return item?.applied
        }}
        removeCoupon={courseCouponHandleClick}
      />

      <CouponPicker showPicker={productCouponPicker} title='Select a Coupon' arr={productCouponData}
        handleClose={() => {
          setProductCouponPicker(false)
        }}
        handleSubmit={productCouponHandleClick}
        couponDescKey='description'
        couponCodeKey='coupon_code'
        discAmountKey='coupon_discount_amount'
        // item?.coupon_code == couponCodeApplied
        couponCodeApplied={(item, index) => {
          return item?.coupon_code == couponCodeApplied
        }}
        removeCoupon={removeProductCoupon}
      />

    </LinearGradient>
  );
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  cartPrice: { fontSize: 14, color: "#000", fontWeight: "400", fontFamily:FONTFAMILY }

});
export default ProductCart