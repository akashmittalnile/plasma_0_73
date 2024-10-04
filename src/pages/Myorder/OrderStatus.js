
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
// import Video, {VideoRef} from 'react-native-video';
import Video from 'react-native-video';
import TextInputArea from '../../component/TextInputArea';
import { FONTFAMILY } from '../../utility/fonts';

const OrderStatus = (props) => {
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
   
  ])
 
  useEffect(() => {

  }, [])


  const goToMap = (l, n) => {
    console.log('saloondetaile.address', saloondetaile.address);
    openMap(
      {
        latitude: l,
        longitude: n,
        provider: 'google',
        //  start:'Noida ,Uttar Pradesh,India',
        end: saloondetaile.address,
      }
    );
  }
  const addressToLatlong = (address) => {
    Geocoder.from(address)
      .then(json => {
        var location = json.results[0].geometry.location;
        var latitude = location.lat
        var longitude = location.lng
        var destinationLatlon = { "latitude": latitude, "longitude": longitude }
        setDestPos(destinationLatlon)
        dispatch(setDestnationPosition(destinationLatlon))

      })
      .catch(error => console.warn(error));
  }

  const myposition = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log('latitude longitude', location);
        setlat(location.latitude)
        setlan(location.longitude)
        //  {"latitude": 37.4220936, "longitude": -122.083922, }
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
  }
  // 

  const getDistanceFromLatLonInKm = (coordinates, lat2, lon2) => {
    const [l, lo] = coordinates?.split(','); //"coordinates": "25.6341728, 85.0596258",
    var lat1 = l
    var lon1 = lo
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    // if (unit=="K") { dist = dist * 1.609344 }
    // if (unit=="M") { dist = dist * 0.8684 }
    return dist * 1.609344
  }



  const getHomeData = async () => {
    // console.log('hihihihihihihihihihi===>>>>',userdetaile.id);
    setLoading(true)
    let formdata = new FormData();
    formdata.append("user_id", userdetaile.id);
    const { responseJson, err } = await requestPostApi(home, formdata, 'POST', '')
    setLoading(false)
    if (err == null) {
      if (responseJson.status) {
        // console.log('jjjjjjjjjjjjjjj salons data ==>>>',responseJson.data.salons[0]) 
        console.log('jjjjjjjjjjjjjjj hairdresser data ==>>>', responseJson.data.featured_salons)
        sethomeData(responseJson.data)
        var myarr = []
        for (let i = 1; i <= responseJson.data.banners.length; i++) {
          myarr.push({ img: 'https://www.sailoons.com/upload/' + responseJson.data.banners[i - 1].image })
        }
        setBanerImg(myarr)
        // Toast.show(responseJson.message); 
      } else {

      }
    } else {
      // Alert.alert(err)
    }
  }

  const ServiceLikePressed = async (item) => {
    if (userdetaile.id != null) {
      setLoading(true)
      let formdata = new FormData();

      formdata.append("user_id", userdetaile.id);
      formdata.append("service_id", item.id);
      console.log(formdata);
      const { responseJson, err } = await requestPostApi(favorite, formdata, 'POST', '')
      setLoading(false)
      if (err == null) {
        if (responseJson.api_status) {
          // LikePressed(item)
          getHomeData()
        } else {
          //setdata(null)
        }
      } else {

      }
    }
  }

  const ServiceUnLikePressed = async (item) => {
    if (userdetaile.id != null) {
      setLoading(true)
      let formdata = new FormData();

      formdata.append("user_id", userdetaile.id);
      formdata.append("service_id", item.service_id);
      formdata.append("remove", '1');
      // formdata.append("service_id", '');    
      console.log(formdata);
      const { responseJson, err } = await requestPostApi(favorite, formdata, 'POST', '')
      setLoading(false)
      if (err == null) {
        if (responseJson.api_status) {
          // LikePressed(item)
          getHomeData()

        } else {
          //setdata(null)
        }
      } else {

      }
    } else {
      dispatch(onLogoutUser())
    }
  }

  const hairdresseraddfavorite = async (item) => {
    if (userdetaile.id != null) {
      setLoading(true)
      let formdata = new FormData();

      formdata.append("user_id", userdetaile.id);
      // formdata.append("salon_id", item.id);  
      formdata.append("hairdresser_id", item.id);
      //  formdata.append("service_id", item.service_id);    
      console.log(formdata);
      const { responseJson, err } = await requestPostApi(favorite, formdata, 'POST', '')
      setLoading(false)
      if (err == null) {
        if (responseJson.api_status) {
          // LikePressed(item)
          getHomeData()
          Alert.alert(responseJson.message)
        } else {
          //setdata(null)
        }
      } else {

      }
    }
  }

  const hairdresserUnLikePressed = async (item) => {
    if (userdetaile.id != null) {
      setLoading(true)
      let formdata = new FormData();

      formdata.append("user_id", userdetaile.id);
      formdata.append("remove", '1');
      formdata.append("hairdresser_id", item.id);
      //  formdata.append("service_id", item.service_id);    
      console.log(formdata);
      const { responseJson, err } = await requestPostApi(favorite, formdata, 'POST', '')
      setLoading(false)
      if (err == null) {
        if (responseJson.api_status) {
          // LikePressed(item)
          getHomeData()
          Alert.alert(responseJson.message)
        } else {
          //setdata(null)
        }
      } else {

      }
    }
  }

  const getSaloonData = async (item) => {
    setLoading(true)
    let formdata = new FormData();
    formdata.append("user_id", item.current_salon);
    const { responseJson, err } = await requestPostApi(current_salon_by_hairdresser, formdata, 'POST', '')
    setLoading(false)
    if (err == null) {
      if (responseJson.status) {
        console.log('kllklklklk===>>>', responseJson.data.salons[0]);
        dispatch(saveSaloonDetails(responseJson.data.salons[0]))
        props.navigation.navigate('ListOfServices', { salunId: responseJson.data.salons[0].id })
      } else {

      }
    } else {
      // Alert.alert(err)
    }
  }

  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1, }}>
      <SafeAreaView />
      <StatusBar />
    
      
        {/* ******************Header******************** */}
        <HomeHeader2
          height={60}
          // paddingHorizontal={15}
          title={'Order Status'}
          press1={() => {
            props.navigation.goBack();
          }}
          img1={require('../../assets/arrow_right_black.png')}
          img1width={25}
          img1height={25}
          press2={() => {props.navigation.navigate('Notification')}}
          img2={require('../../assets/notification.png')}
          img2width={25}
          img2height={25}
          press3={() => {}}
          img3={require('../../assets/shoppingbag.png')}
          img3width={25}
          img3height={25}
          backgroundColor={'transparent'}
        />
    
  <ScrollView>
  {data.length<0 ? 
  <>
         <View style={{ marginTop: 10, }}>
          <FlatList
            data={data}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <View style={{flexDirection:"row", width: dimensions.SCREEN_WIDTH * 95 / 100,alignSelf:'center' ,marginTop:15,backgroundColor:'#fff',borderRadius:7,padding:10}}>
                 <Image style={{ height: 70,  width: dimensions.SCREEN_WIDTH * 30 / 100,borderRadius:7}} source={require("../../assets/Rectangle104.png")}></Image>
                 <View style={{marginLeft:10}}>
                 <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000", }}>CoolJet Starter Kit</Text>

                <View style={{flexDirection:"row",marginTop:8}}>
                 <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#B357C3", }}>$13.00</Text>
                 <Image style={{ height: 10, width: 10,marginLeft:15,marginTop:2 }} source={require("../../assets/star.png")}></Image>
               <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#000", }}> 4.7</Text>
               </View>
               <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:10}}>

                <TouchableOpacity style={{width:30,height:25,backgroundColor:"#B357C3",justifyContent:"center",borderRadius:8}}>
                <Text style={{fontFamily:FONTFAMILY,fontSize:20,color:"#fff",textAlign:"center",fontWeight:"400"}}>-</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{width:47,height:25,backgroundColor:"#FBE7FE",justifyContent:"center",borderRadius:4}}>
                <Text style={{fontFamily:FONTFAMILY,fontSize:15,color:"#000",textAlign:"center",fontWeight:"400"}}>1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{width:30,height:25,backgroundColor:"#B357C3",justifyContent:"center",borderRadius:7}}>
                <Text style={{fontFamily:FONTFAMILY,fontSize:20,color:"#fff",textAlign:"center",fontWeight:"400"}}>+</Text>
                </TouchableOpacity>
                
                </View>





                 </View>
                </View>

              )
            }}
            keyExtractor={item => item.id}
          />
        </View>


<View style={{flexDirection:"row", width: dimensions.SCREEN_WIDTH * 95 / 100,alignSelf:'center' ,marginTop:15,backgroundColor:'#fff',borderRadius:7,padding:10}}>
                
                
</View>


<TouchableOpacity style={{ width:'90%',height:50,backgroundColor:"#B357C3",borderRadius:7,marginTop:20,justifyContent:"center",alignSelf:'center'}}
onPress={()=>{props.navigation.navigate('SipingAddress')}}>
<Text style={{fontFamily:FONTFAMILY,fontSize:10,color:"#fff",textAlign:"center",fontWeight:"600"}}>GO BACK</Text>
</TouchableOpacity>

</>

        : 
<View style={{alignSelf:'center',marginTop:50}}>
<Image style={{ height: 104,  width: 150,borderRadius:22,alignSelf:'center'}} source={require("../../assets/Group645141.png")}></Image>
<Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#fff",textAlign:'center',marginTop:10 }}>No Data Found</Text>
<Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#fff",textAlign:'center',marginTop:10,width:dimensions.SCREEN_WIDTH*70/100 }}>There is no data to show you right now</Text>
<TouchableOpacity style={{ width:dimensions.SCREEN_WIDTH*60/100,height:50,backgroundColor:"#B357C3",borderRadius:7,marginTop:40,justifyContent:"center",alignSelf:'center'}}
onPress={()=>{props.navigation.navigate('SipingAddress')}}>
<Text style={{fontFamily:FONTFAMILY,fontSize:14,color:"#fff",textAlign:"center",fontWeight:"600"}}>Refresh</Text>
</TouchableOpacity>
</View>

}








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
export default OrderStatus