import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  useColorScheme,
  Alert,
  TextInput,
  Keyboard,
  TouchableOpacity,
  ImageBackground, FlatList,
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
import { products, requestGetApi, requestPostApi, } from '../../WebApi/Service';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../WebApi/Loader';
import Toast from 'react-native-simple-toast';
import MyAlert from '../../component/MyAlert';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import HomeHeader from '../../component/HomeHeader';
import HomeHeader2 from '../../component/HomeHeader2';
import MySearchBar from '../../component/MySearchBar';
import { handleShare } from '../../component/ShareComponent';
import useAPI from '../../utility/hooks/useAPI';
import NoDataFound from '../../component/NoDataFound';
import { addToWishlist } from '../../WebApi/GlobalAPICalls';
import AddToCartHandleComponent from '../../component/AddToCartHandleComponent';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { FONTFAMILY } from '../../utility/fonts';
import { StrikeThough } from '../../utility/FontStyles';


const ProductViewAll = (props) => {
  const [loading, setLoading] = useState(false)
  const [flag, setFlag] = useState('http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg')
  const userdetaile = useSelector(state => state.user.user_details);
  const [code, setcode] = useState('+1')
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [select1, setselect1] = useState(false)
  const [data, setdata] = useState([])
  const { getAPI } = useAPI()


  useEffect(() => {
    getProductdata()
  }, [])

  const searchProduct = async (searchVal) => {
    setLoading(true);
    const res = await getAPI({ endPoint: products + '?search=' + searchVal })
    if (res) {
      setdata(res?.data)
    }

    setLoading(false);
  }

  const getProductdata = async () => {
    setLoading(true);
    let formdata = new FormData();
    formdata.append('id', userdetaile.id);
    const { responseJson, err } = await requestGetApi(products, '', 'GET', userdetaile.access_token)

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


  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1, }}>
      <SafeAreaView />
      <StatusBar />

      {/* ******************Header******************** */}
      <HomeHeader2
        height={60}
        // paddingHorizontal={15}
        title={'Plasma Pen Store'}
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
      {/* ******************Search******************** */}
      <MySearchBar placeHolder={'Products'} onSearchSubmit={searchProduct} />
      <ScrollView>

        <View style={{ marginTop: 10, }}>
          <FlatList
            data={data}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {

              const { title,
                price,
                rating, images, sale_price, wishlist } = item

              return (
                <View style={{ width: dimensions.SCREEN_WIDTH * 95 / 100, alignSelf: 'center', marginTop: 15 }}
                  onPress={() => { props.navigation.navigate('ProductDetails', { data: item }) }}>
                  <TouchableOpacity activeOpacity={0.5}
                    onPress={() => {
                      // props.navigation.navigate('ProductDetails', { data: item })
                      console.log(item?.id);
                    }} style={{ width: '100%' }}>
                    <ImageBackground style={{ height: 170, width: '100%', borderTopLeftRadius: 7, borderTopRightRadius: 7, overflow: 'hidden' }} source={{ uri: images[0].image }}>
                      <View style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: 5 }}>
                        <TouchableOpacity onPress={async () => {
                          await addToWishlist(item?.id, 2, userdetaile.access_token)
                          getProductdata()
                        }} style={{ marginRight: 10 }}>

                          <Image style={{ height: 25, width: 25, tintColor: "#B357C3", }} source={wishlist ? require("../../assets/heartFilled.png") : require("../../assets/heart.png")}></Image>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                          handleShare(title)
                        }} style={{ marginRight: 10 }}>
                          <Image style={{ height: 25, width: 25, }} source={require("../../assets/ShareNetwork.png")}></Image>
                        </TouchableOpacity>
                      </View>


                    </ImageBackground>
                  </TouchableOpacity>


                  <View style={{ width: '100%', backgroundColor: '#fff', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, padding: 10 }}>
                    <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000", padding: 5 }}>{title}</Text>

                    <View style={{ flexDirection: "row" }}>

                      <Text style={[{fontFamily:FONTFAMILY, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2,  }, StrikeThough]}>${price}</Text>
                      <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }}>${sale_price}</Text>

                      <View style={{ flexDirection: "row", padding: 4, marginLeft: 25 }}>
                        <Image style={{ height: 12, width: 12, marginTop: 1 }} source={require("../../assets/star.png")}></Image>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000", }}> {rating}</Text>
                      </View>


                    </View>

                    <View style={{ width: responsiveWidth(90), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>

                      <AddToCartHandleComponent startLoader={() => setLoading(true)} id={item?.id} type={2} in_cart={item?.in_cart} addRemoveButton={true} callback={getProductdata}>
                        <View style={{ width: responsiveWidth(42), paddingVertical: 10, borderRadius: 4, justifyContent: 'center', backgroundColor: '#B357C3' }}>
                          <Text style={{fontFamily:FONTFAMILY, color: '#fff', textAlign: 'center' }}> {item?.in_cart ? "Remove from Cart" : "Add to cart"} </Text>
                        </View>
                      </AddToCartHandleComponent>

                      <AddToCartHandleComponent startLoader={() => setLoading(true)} id={item?.id} type={2} in_cart={item?.in_cart} buyBtn={true} callback={getProductdata}>
                        <View style={{ width: responsiveWidth(42), paddingVertical: 10, borderRadius: 4, justifyContent: 'center', backgroundColor: '#4556A6' }}>
                          <Text style={{fontFamily:FONTFAMILY, color: '#fff', textAlign: 'center' }}>Buy Now</Text>
                        </View>
                      </AddToCartHandleComponent>

                    </View>

                  </View>

                </View>

              )
            }}
            keyExtractor={item => item.id}
            ListEmptyComponent={<NoDataFound styles={{ marginTop: '32%' }} />}
          />
        </View>





        {loading ?
          <Loader />
          : null
        }
        <View style={{ width: 50, height: 150 }} />
      </ScrollView>
    </LinearGradient>

  );
}
const styles = StyleSheet.create({


});
export default ProductViewAll