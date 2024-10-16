import React, { Component, useEffect, useState } from 'react';
import { Alert, Text, Image, StatusBar, ScrollView, SafeAreaView, Platform, TextInput, View, StyleSheet, TouchableOpacity, ActivityIndicator, Keyboard, Dimensions, FlatList, BackHandler, Linking } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, StackActions, CommonActions, useIsFocused } from '@react-navigation/native';
import { Mycolors, dimensions } from '../utility/Mycolors';
import { useSelector, useDispatch } from 'react-redux';
import { onLogoutUser } from '../redux/actions/user_action';
import { baseUrl, deactive_account, booking_cancel_ride, driver_logout, driver_ride_details, booking_verify_ride, driver_current_location, requestPostApi, requestGetApi } from '../WebApi/Service'
import Loader from '../WebApi/Loader';
import MyAlert from './MyAlert';
import LinearGradient from 'react-native-linear-gradient'
import Toast from 'react-native-simple-toast';
import useAPI from '../utility/hooks/useAPI';
import { FONTFAMILY } from '../utility/fonts';

const MyView = (props) => {
  return (
    <>
      <TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 15, padding: 5, }} onPress={props.touch}>
        <Image source={props.img ? props.img : require('../assets/HouseGray.png')} style={{ height: 25, width: 25, tintColor: '#fff' }}></Image>
        <Text style={{fontFamily:FONTFAMILY, color: '#fff', fontSize: 15, fontWeight: '600', marginLeft: 10, fontFamily:FONTFAMILY }}>{props.name}
        {/* <View style={{width: 5, height:5, position: 'absolute', backgroundColor: 'red', right:0}}/> */}
        </Text>
        

        
      </TouchableOpacity>
    </>
  );
}

const MyDrawer = (props) => {
  const dispatch = useDispatch();
  const userdetaile = useSelector(state => state.user.user_details);
  const unseenMsgCount = useSelector(state => state.unseenMessageCount.msgUnseenDataObj);
  const [name, setname] = useState('John Dev.')
  const [loder, setLoder] = useState(false)
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [msgCount, setmsgCount] = useState(null)
  const [subExp, setsubExp] = useState(false)
  const [loading, setLoading] = useState(false)
  const {getAPI} = useAPI()
  const isFocussed = useIsFocused()
  var logindata = useSelector(state => state.user.user_details)
  var mydata = logindata.type
  const resetStacks = (page) => {
    props.navigation.reset({
      index: 0,
      routes: [{ name: page }],
    });
  }
  const deleteAcount = async () => {
    setMy_Alert(false)
    loder(true)
    let formdata = new FormData();
    formdata.append("user_id", logindata.id);
    // formdata.append("service_status", userdetaile.type); 
    console.log(formdata);
    const { responseJson, err } = await requestPostApi(deactive_account, formdata, 'POST', '')
    loder(false)
    console.log('the update_booking_status data==>>', responseJson)
    if (err == null) {
      if (responseJson.api_status) {
        logoutPressed()
        //  Toast.show(responseJson.message)
      } else {

      }
    } else {

    }



  }

  async function unseen_message_count() {
    try {
      const res = await getAPI({endPoint: 'unseen-message-count'})
      console.log("unseen_message_count", {res});
      setmsgCount(res)
  
    } catch (error) {
      console.log("unseen_message_count", {error});
    }

  }

  useEffect(() => {
    console.log("unseen_message_count");
    // unseen_message_count()
    

    return () => {
      
    }
  }, [isFocussed])
  

  const logoutPressed = () => {
    AsyncStorage.clear();
    dispatch(onLogoutUser())
  }
  const Popreturn = () => {
    return (
      <TouchableOpacity style={{ width: '80%', height: 55, backgroundColor: 'red', justifyContent: 'center', borderRadius: 10, alignSelf: 'center', }}
        onPress={() => { }}>
        <Text style={{fontFamily:FONTFAMILY, textAlign: 'center', color: Mycolors.BG_COLOR , fontFamily:FONTFAMILY}}>'Your Subscription Has Expired'</Text>
      </TouchableOpacity>
    )
  }

  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1, }}>
      <SafeAreaView />
      <StatusBar />


      <ScrollView style={{ flex: 1, paddingLeft: 10, paddingVertical: 10, paddingRight: 10 }}>

        <View style={{ height: 60, width: '78%', marginHorizontal: 20 }}>
          <Image
            resizeMode="contain"
            source={require('../assets/Plasmapen_icon.png')}
            style={{ height: '100%', width: '100%' }}
          />
        </View>

        <View style={{ width: '100%', backgroundColor: "#B357C3", borderRadius: 7, justifyContent: "center", padding: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <Image style={{ width: 40, height: 40, borderRadius: 20 }} source={{uri: userdetaile?.user?.profile_image}}></Image>
            <View style={{ width: '70%', marginLeft: 5 }}>
              <Text style={{fontFamily:FONTFAMILY, fontSize: 15, color: '#fff', marginLeft: 3, fontWeight: '600', fontFamily:FONTFAMILY }}>{userdetaile?.user?.name}</Text>
              <Text style={{fontFamily:FONTFAMILY, fontSize: 15, color: '#fff', marginLeft: 3, fontFamily:FONTFAMILY }}>{userdetaile?.user?.email}</Text>
            </View>
            {/* <TouchableOpacity onPress={()=>{console.log(userdetaile); }} style={{width:'32%',height:35,borderRadius:7,backgroundColor:'#fff',justifyContent:"center",marginLeft:3}}>
<Text style={{fontFamily:FONTFAMILY,fontSize:11,color:'#000',alignSelf:"center"}}>View Profile</Text>
</TouchableOpacity> */}



          </View>


        </View>




        <View style={{ width: '100%', marginTop: 10, }}>

          <MyView name="Home" touch={() => { props.navigation.navigate('BottomNavNew', {screenIndex: 0}) }} img={require('../assets/homeIconEnd.png')} imgstyle={{ width: 25, height: 25, }} />
          <MyView name="My Wishlist" touch={() => { props.navigation.navigate('BottomNavNew', {screenIndex: 1}) }} img={require('../assets/heart.png')} imgstyle={{ width: 25, height: 25, tintColor: "#fff" }} />
          <MyView name="My Courses" touch={() => { 
            // props.navigation.navigate('MyCourses')
            props.navigation.navigate('HomeSearch', {comingFrom: {
              baseUrl: 'my-courses?'
            }})
            
            }} img={require('../assets/book.png')} imgstyle={{ width: 25, height: 25, tintColor: "#fff" }} />
          <MyView name="PlasmaPen Community" touch={() => { props.navigation.navigate('AllCommunities') }} img={require('../assets/people.png')} imgstyle={{ width: 25, height: 25, tintColor: "#fff" }} />
          {/* <MyView name="PlasmaPen Blogs" touch={() => { props.navigation.navigate('Blog') }} img={require('../assets/menu-board.png')} imgstyle={{ width: 25, height: 25, tintColor: "#fff" }} /> */}
          {/* <MyView name="Disclaimer Video" touch={() => { props.navigation.navigate('Disclaimers') }} img={require('../assets/menu-board.png')} imgstyle={{ width: 25, height: 25, tintColor: "#fff" }} />
          <MyView name="Disclaimer PDF" touch={() => { props.navigation.navigate('DisclaimersPdf') }} img={require('../assets/menu-board.png')} imgstyle={{ width: 25, height: 25, tintColor: "#fff" }} /> */}
          <MyView name="Schedule" touch={() => { props.navigation.navigate('Schedule') }} img={require('../assets/schedule.png')} imgstyle={{ width: 25, height: 25, tintColor: "#fff" }} />
          <MyView name="Documents" touch={() => { props.navigation.navigate('DocumentList') }} img={require('../assets/document-text.png')} imgstyle={{ width: 25, height: 25, tintColor: "#fff" }} />
          <MyView name="Goals" touch={() => { props.navigation.navigate('GetGoals') }} img={require('../assets/Target.png')} imgstyle={{ width: 25, height: 25, tintColor: "#fff" }} />
          {/* <MyView name="Quiz" touch={() => { props.navigation.navigate('Quiz') }} img={require('../assets/menu-board.png')} imgstyle={{ width: 25, height: 25, tintColor: "#fff" }} /> */}
          <MyView name={unseenMsgCount?.data != '0' ? "Chat Support " + "("+unseenMsgCount?.data+")" : "Chat Support"} touch={() => { 
            props.navigation.navigate('Chat') 
            console.log(unseenMsgCount);
            }} img={require('../assets/message.png')} imgstyle={{ width: 25, height: 25, tintColor: "#fff" }} />
          {/* <MyView name="Help & Support" touch={() => { }} img={require('../assets/headphone.png')} imgstyle={{ width: 25, height: 25, tintColor: "#fff" }} /> */}
          <MyView name="Terms & Conditions" touch={() => { props.navigation.navigate('Term') }} img={require('../assets/stickynote.png')} imgstyle={{ width: 25, height: 25, tintColor: "#fff" }} />
          <MyView name="Privacy Policy" touch={() => { props.navigation.navigate('Privacy') }} img={require('../assets/privacypolicy.png')} imgstyle={{ width: 25, height: 25, tintColor: "#fff" }} />


          <MyView name="Logout" img={require('../assets/logout.png')} touch={() => {
            if (logindata.id == null) {
              Toast.show('Logged Out Successfully')
              // return
              AsyncStorage.clear()
              dispatch(onLogoutUser())

            } else {
              setalert_sms('Are you sure want to logout?')
              setMy_Alert(true)
            }
          }} imgstyle={{ width: 18, height: 18 }} />



          <View style={{ width: '100%', backgroundColor: "#B357C3", justifyContent: "center", padding: 10, marginTop: 20 }}>
            <Text style={{fontFamily:FONTFAMILY, color: '#fff',  fontFamily:FONTFAMILY}}>Follow Us!</Text>
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Image style={{ width: 30, height: 30, }} source={require('../assets/Layer1.png')}></Image>
              <Image style={{ width: 40, height: 30, marginHorizontal: 10 }} source={require('../assets/youtube.png')}></Image>
              <Image style={{ width: 30, height: 30, }} source={require('../assets/Group.png')}></Image>
            </View>

          </View>



        </View>

        <View style={{ width: 100, height: 100 }} />

      </ScrollView>



      {My_Alert ? <MyAlert sms={alert_sms} sms2={'Logout'} okPress={() => { logoutPressed() }} canclePress={() => { setMy_Alert(false) }} /> : null}

      {loder ? <Loader /> : null}


    </LinearGradient>
  );

}

export default MyDrawer
