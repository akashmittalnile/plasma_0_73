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
import { FONTFAMILY } from '../../utility/fonts';



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
  }, [])

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
          title={'Details'}
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
          <View style={{ width: dimensions.SCREEN_WIDTH - 20, height: 250, backgroundColor: 'green', alignSelf: 'center', borderRadius: 10, overflow: 'hidden' }}>
            <ImageBackground source={{ uri: data?.images[0].image }} style={{ width: '100%', height: '100%' }} resizeMode='stretch'></ImageBackground>
          </View>
          <View>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 18, color: "#fff", fontWeight: "600", padding: 10 }}>{data?.title}</Text>

          </View>

          <View style={{ flexDirection: "row", marginLeft: 10, alignItems: 'center' }}>
            <Text style={[{fontFamily:FONTFAMILY, fontSize: 25, color: "#B357C3", }, StrikeThough]}>${data?.price}</Text>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 25, color: "#B357C3", }}> ${data?.sale_price}</Text>
            <Image style={{ height: 10, width: 10, marginLeft: 15, marginTop: 2 }} source={require("../../assets/star.png")}></Image>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#fff", }}> {data.rating}</Text>
          </View>
          {data?.in_cart &&
            <View style={{ flexDirection: "row", marginTop: 10, marginLeft: 10 }}>

              <TouchableOpacity onPress={() => {
                updateCartQty(0, setLoading, userdetaile.access_token, product_id, product_quantity, (resp) => { getProductdata() }).catch((err) => {
                  console.error("updateCartQty", err);
                })
              }} style={{ width: 30, height: 30, backgroundColor: "#B357C3", justifyContent: "center", borderRadius: 5 }}>
                <Text style={{fontFamily:FONTFAMILY, fontSize: 20, color: "#fff", textAlign: "center", fontWeight: "400" }}>-</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ width: 47, height: 30, backgroundColor: "#FBE7FE", justifyContent: "center", borderRadius: 5, marginHorizontal: 5 }}>
                <Text style={{fontFamily:FONTFAMILY, fontSize: 15, color: "#000", textAlign: "center", fontWeight: "400" }}>{product_quantity}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                updateCartQty(1, setLoading, userdetaile.access_token, product_id, product_quantity, (resp) => { getProductdata() }).catch((err) => {
                  console.error("updateCartQty", err);
                })
              }} style={{ width: 30, height: 30, backgroundColor: "#B357C3", justifyContent: "center", borderRadius: 5 }}>
                <Text style={{fontFamily:FONTFAMILY, fontSize: 20, color: "#fff", textAlign: "center", fontWeight: "400" }}>+</Text>
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
              <Image style={{ height: 20, width: 20, tintColor: '#000', marginRight: 10 }} source={require("../../assets/heart.png")}></Image>
              <Text style={{fontFamily:FONTFAMILY, color: '#000', textAlign: 'center' }}>{data?.wishlist ? "Remove From Wishlist" : "Add to Wishlist"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: '49%', paddingVertical: 8, borderRadius: 4, justifyContent: 'center', backgroundColor: '#B357C3', flexDirection: 'row', alignItems: 'center' }}
              onPress={async () => {
                {
                  // setselect1(true)
                  await handleShare(data?.title)
                }
              }}>
              <Image style={{ height: 20, width: 20, tintColor: '#fff', marginRight: 10 }} source={require("../../assets/ShareNetwork.png")}></Image>
              <Text style={{fontFamily:FONTFAMILY, color: '#fff', textAlign: 'center' }}>Share</Text>
            </TouchableOpacity>
          </View>

          <Text style={{fontFamily:FONTFAMILY, fontSize: 15, color: "#fff", fontWeight: "600", padding: 10, marginTop: 10 }}>Product Details</Text>
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


          {loading ?
            <Loader />
            : null
          }



          <View style={{ width: 50, height: 250 }} />
        </ScrollView>
        <View style={{ width: '100%', height: 170, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, position: 'absolute', bottom: 0, zIndex: 111 }}>

          <View style={{ flexDirection: "row", margin: 15, alignItems: 'center' }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 25, color: "#B357C3", }}>$ {data?.sale_price}</Text>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#000", }}> 
              {/* (include all the taxas if applied*) */}
              </Text>
          </View>
          <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
            <TouchableOpacity onPress={async () => {
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
              width: '48%', paddingVertical: 8, borderRadius: 4, justifyContent: 'center', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', shadowColor: '#000000',
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
              <Text style={{fontFamily:FONTFAMILY, color: '#4556A6', textAlign: 'center', fontWeight: 600 }}>{data?.in_cart ? "Remove from Cart" : "Add to Cart"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              width: '48%', paddingVertical: 8, borderRadius: 4, justifyContent: 'center', backgroundColor: '#B357C3', flexDirection: 'row', alignItems: 'center', shadowColor: '#000000',
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
              <Text style={{fontFamily:FONTFAMILY, color: '#fff', textAlign: 'center' }}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}
const styles = StyleSheet.create({


});
export default ProductOrderHistory