
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
// import Slider from '@react-native-community/slider';
import { FONTFAMILY } from '../../utility/fonts';

const ProductFilter = (props) => {
  const [searchValue, setsearchValue] = useState('')
  const [homeData, sethomeData] = useState('')
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const userdetaile = useSelector(state => state.user.user_details)
  const [lod, setlod] = useState(false);
  const [promo, setpromo] = useState('')
  const [select2, setselect2] = useState('')
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
  const [data2, setdata2] = useState([
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
  useEffect(() => {

  }, [])



  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1, }}>
      <SafeAreaView />
      <StatusBar />


      {/* ******************Header******************** */}
      <HomeHeader2
        height={60}
        // paddingHorizontal={15}
        title={'Filter'}
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
        <Text style={{fontFamily:FONTFAMILY, fontSize: 19, color: "#fff", fontWeight: "500", marginLeft: 10 }}>Price</Text>

        <View style={{ width: '100%', height: 40, marginTop: 10 }}>
          {/* <Slider
            style={{ width: '95%', height: 40, alignSelf: "center" }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#B357C3"
          /> */}
        </View>



        <Text style={{fontFamily:FONTFAMILY, fontSize: 18, color: "#fff", fontWeight: "400", marginLeft: 10 }}>Category</Text>

        <View style={{ flexDirection: "row", marginLeft: 10, marginTop: 20 }}>

          <TouchableOpacity style={{ width: '15%', height: 35, borderRadius: 5, backgroundColor: "#B357C3", justifyContent: "center", marginLeft: 10, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "center" }}>Tickets</Text>

          </TouchableOpacity>

          <TouchableOpacity style={{ width: '25%', height: 35, borderRadius: 5, backgroundColor: "#B357C3", justifyContent: "center", marginLeft: 5, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "center" }}>CoolJeetTM</Text>

          </TouchableOpacity>

          <TouchableOpacity style={{ width: '40%', height: 35, borderRadius: 5, backgroundColor: "#B357C3", justifyContent: "center", marginLeft: 4, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "center" }}>Plasma Pen</Text>

          </TouchableOpacity>



        </View>

        <View style={{ flexDirection: "row", marginLeft: 10, marginTop: 5 }}>

          <TouchableOpacity style={{ width: '25%', height: 35, borderRadius: 5, backgroundColor: "#B357C3", justifyContent: "center", marginLeft: 10, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "center" }}>Accessories</Text>

          </TouchableOpacity>

          <TouchableOpacity style={{ width: '25%', height: 35, borderRadius: 5, backgroundColor: "#B357C3", justifyContent: "center", marginLeft: 5, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "center" }}>Anaesthetic</Text>

          </TouchableOpacity>

          <TouchableOpacity style={{ width: '40%', height: 35, borderRadius: 5, backgroundColor: "#B357C3", justifyContent: "center", marginLeft: 4, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "center" }}>Extended Warranties</Text>

          </TouchableOpacity>



        </View>

        <View style={{ flexDirection: "row", marginLeft: 10, marginTop: 5 }}>

          <TouchableOpacity style={{ width: '17%', height: 35, borderRadius: 5, backgroundColor: "#B357C3", justifyContent: "center", marginLeft: 10, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "center" }}>Kits</Text>

          </TouchableOpacity>

          <TouchableOpacity style={{ width: '45%', height: 35, borderRadius: 5, backgroundColor: "#B357C3", justifyContent: "center", marginLeft: 5, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "center" }}>Pre-Treatment Products</Text>

          </TouchableOpacity>

          <TouchableOpacity style={{ width: '17%', height: 35, borderRadius: 5, backgroundColor: "#B357C3", justifyContent: "center", marginLeft: 4, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "center" }}>Serums</Text>

          </TouchableOpacity>



        </View>

        <View style={{ flexDirection: "row", marginLeft: 10, marginTop: 5 }}>

          <TouchableOpacity style={{ width: '25%', height: 35, borderRadius: 5, backgroundColor: "#B357C3", justifyContent: "center", marginLeft: 10, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "center" }}>Starter Kits</Text>

          </TouchableOpacity>

          <TouchableOpacity style={{ width: '18%', height: 35, borderRadius: 5, backgroundColor: "#B357C3", justifyContent: "center", marginLeft: 5, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "center" }}>Training</Text>

          </TouchableOpacity>

          <TouchableOpacity style={{ width: '38%', height: 35, borderRadius: 5, backgroundColor: "#B357C3", justifyContent: "center", marginLeft: 4, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "center" }}>Treatment Delivery</Text>

          </TouchableOpacity>



        </View>

        <Text style={{fontFamily:FONTFAMILY, fontSize: 18, color: "#fff", fontWeight: "400", marginLeft: 10, marginTop: 20 }}>Date Upload</Text>

        <View style={{ flexDirection: "row", marginLeft: 10, marginTop: 20 }}>

          <TouchableOpacity style={{ width: '25%', height: 35, borderRadius: 5, backgroundColor: "#B357C3", justifyContent: "center", marginLeft: 10, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "center" }}>Starter Kits</Text>

          </TouchableOpacity>

          <TouchableOpacity style={{ width: '18%', height: 35, borderRadius: 5, backgroundColor: "#B357C3", justifyContent: "center", marginLeft: 5, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "center" }}>Training</Text>

          </TouchableOpacity>

          <TouchableOpacity style={{ width: '38%', height: 35, borderRadius: 5, backgroundColor: "#B357C3", justifyContent: "center", marginLeft: 4, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "center" }}>Treatment Delivery</Text>

          </TouchableOpacity>



        </View>

        <View style={{ flexDirection: "row", marginLeft: 10, marginTop: 5 }}>

          <TouchableOpacity style={{ width: '25%', height: 35, borderRadius: 5, backgroundColor: "#B357C3", justifyContent: "center", marginLeft: 10, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "center" }}>This Week</Text>

          </TouchableOpacity>

          <TouchableOpacity style={{ width: '22%', height: 35, borderRadius: 5, backgroundColor: "#B357C3", justifyContent: "center", marginLeft: 5, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "center" }}>This Month</Text>

          </TouchableOpacity>

          <TouchableOpacity style={{ width: '30%', height: 35, borderRadius: 5, backgroundColor: "#B357C3", justifyContent: "center", marginLeft: 4, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "center" }}>This Year</Text>

          </TouchableOpacity>



        </View>

        <View style={{ flexDirection: "row", marginTop: 20, alignSelf: "center" }}>

          <TouchableOpacity style={{ width: '45%', height: 35, borderRadius: 5, backgroundColor: "#B357C3", justifyContent: "center", marginLeft: 10, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "center" }}>Clear All</Text>

          </TouchableOpacity>

          <TouchableOpacity style={{ width: '45%', height: 35, borderRadius: 5, backgroundColor: "#fff", justifyContent: "center", marginLeft: 5, }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#4556A6", fontWeight: "500", textAlign: "center" }}>Summit</Text>

          </TouchableOpacity>





        </View>


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
export default ProductFilter