import React, { useEffect, useState } from 'react'
import { View, Keyboard, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Mycolors } from '../utility/Mycolors';
import { useSelector, useDispatch } from 'react-redux';
import { requestGetWithoutBody } from '../WebApi/Service';
import Toast from 'react-native-simple-toast';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { emptyCart, setCart } from '../redux/reduxSlices/cartSlice';
import useAPI from '../utility/hooks/useAPI';
import { FONTFAMILY } from '../utility/fonts';

const HomeHeader = (props) => {

  const navigation = useNavigation()

  const userdetaile = useSelector(state => state.user.user_details);
  const cart = useSelector(state => state.cart.cartItems);
  const cartCount = cart?.length

  const [notificationCount, setnotificationCount] = useState({})

  console.log({ cartCount }, { cart });

  const { getAPI, postAPI } = useAPI()

  const dispatch = useDispatch()

  const isFocussed = useIsFocused()

  // const isFocussed = useIsFocused()

  const getCartList = async () => {


    const { responseJson, err } = await requestGetWithoutBody(`cart-list`, userdetaile.access_token)

    console.log('cart-list==>>', responseJson);
    if (err == null) {
      if (responseJson.status) {


        console.log("cart-list", responseJson.data);
        // Toast.show(responseJson?.message);

        dispatch(setCart(responseJson))

      } else {

        console.log("else");

        dispatch(setCart(responseJson))

      }
    } else {
    }
  };

  async function getNotificationCount() {
    const res = await getAPI({ endPoint: 'notification-count', toastEnable: false })
    console.log({ "notificationCount": res });
    setnotificationCount(res)
  }

  useEffect(() => {

    if (isFocussed) {
      getCartList()
      getNotificationCount()
    }

    // isFocussed && getCartList()

    return () => {

    }
  }, [isFocussed])




  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", width: '95%', alignSelf: "center", marginTop: 10 }}>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={props?.press ? props?.press : (navigation.openDrawer ? navigation?.openDrawer : () => { })}>
          <Image style={{ height: 25, width: 25, }} source={require("../assets/elemen3.png")}></Image>
        </TouchableOpacity>

        <Image style={{ height: 42, width: 42, marginLeft: 10, borderRadius: 20,borderWidth: 2, borderColor: 'white' }} source={{ uri: userdetaile?.user?.profile_image }}></Image>

        <View>
          <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#fff", marginLeft: 10, fontFamily: FONTFAMILY }}>Good Afternoon</Text>
          <Text style={{fontFamily:FONTFAMILY, fontSize: 20, color: "#DF81EF", marginLeft: 10, fontFamily:FONTFAMILY }}>{userdetaile?.user?.name}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={
            // props.press1 ? props.press1 : () => { }
            () => {
              // navigation.push("ProductCart")
              // console.log(props.navigation.navigate("ProductCart"));
              // navigation.navigate('Notification')
              navigation.navigate('Notification')
              // navigation.navigate('Cart')

            }
          }

        >

          <Image style={{ height: 25, width: 25, marginRight: 10 }} source={require("../assets/notification.png")}></Image>
          {notificationCount?.data != 0 && <View style={[{ backgroundColor: 'white', borderRadius: 50, height: 15, width: 15, position: 'absolute', zIndex: 22, justifyContent: 'center', alignItems: 'center' }]}><Text style={{fontFamily:FONTFAMILY, color: '#53045F', fontSize: 14 }}>{notificationCount?.data}</Text></View>}
          {/* {cartCount != 0 && <View style={[{ backgroundColor: 'white', borderRadius: 50, height: 15, width: 15, position: 'absolute', zIndex: 22, justifyContent: 'center', alignItems: 'center' }]}><Text style={{fontFamily:FONTFAMILY, color: '#53045F', fontSize: 14 }}>{cartCount}</Text></View>} */}
        </TouchableOpacity>
        <TouchableOpacity onPress={() =>
          navigation.navigate("ProductCart")

          // props.press2 ? props.press2 : () => { }
        }>
          <Image style={{ height: 25, width: 25, tintColor: "#fff" }} source={require("../assets/shoppingbag.png")}></Image>{cartCount != 0 && <View style={[{ backgroundColor: 'white', borderRadius: 50, height: 15, width: 15, position: 'absolute', zIndex: 22, justifyContent: 'center', alignItems: 'center' }]}><Text style={{fontFamily:FONTFAMILY, color: '#53045F', fontSize: 14, fontFamily: FONTFAMILY }}>{cartCount}</Text></View>}
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: Mycolors.BG_COLOR
  },
  input: {
    paddingLeft: 15,
    paddingRight: 15,
    height: 40,
    width: '100%',
    fontSize: 13,
    // borderColor: Mycolors.GrayColor,
    // borderWidth:1,
    backgroundColor: Mycolors.LogininputBox,
    borderRadius: 15,
    color: Mycolors.TEXT_COLOR,
    //   textAlignVertical: 'top',
  },
});
export default HomeHeader;


