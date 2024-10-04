import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DrawerNav from './DrawerNav';
import AuthNav from './AuthNav'
import Splash from './Splash';
import {View ,StyleSheet,ActivityIndicator,SafeAreaView,ImageBackground ,Text, Platform} from 'react-native';
import {  useSelector, useDispatch } from 'react-redux';
import { setLoading,saveUserResult} from '../redux/actions/user_action';
// import messaging from '@react-native-firebase/messaging';
import {setNotificationData,setNotify,setDeviceToken} from '../redux/actions/latLongAction';
// import firestore from '@react-native-firebase/firestore'


    const MainNav =() => {
     const [showSplash , setShowSplash ]  = useState(true);
    const dispatch =  useDispatch();
    const isSignedIn  = useSelector(state => state.user.user_details)
   // var mydata=isSignedIn.type
     const getAllValues = async() => {
        const user = await AsyncStorage.getItem("plasmapen");
        console.log('thre are ashish ==>>',user);
        //  SplashScreen.hide();
         setShowSplash(false);
         if(user){
             dispatch(saveUserResult(JSON.parse(user)))
         }else{
            console.log('hello');
            var dddd= {"about": "", "address": "", "cert_no": "", "city": "", "country": "0", "created_at": "", "current_salon": "", "dob": "", "email": "", "experience": "", "expiry_date": "", "expiry_date1": "", "facilities": "", "featured": "0", "gender": "", "hobbies": "", "id": null, "id_proof": "", "language": "", "license": "", "license_num": "", "license_num1": "", "location": "", "name": "", "nationality": "", "otp": "", "owner_image": "", "owner_name": "", "password": "4e652ad08eba102e0658176641dc6da6", "phone": "", "phone1": "", "previous_location": "", "previous_salon": "", "profile": "1", "qualification": "", "salon_image": "", "salon_type": "", "service": "", "slogan": "", "state": "", "status": "1", "type": "customer", "unique_id": "", "vat": "", "video": ""}
            dispatch(saveUserResult(null))
         }
    }
    useEffect(()=> {  
        // gettoken()
        const timeout = setTimeout(async () => {
            getAllValues();
              },7000);  
    },[]);

   

    if(showSplash){
        return <Splash /> 
    }
   

    return (
        isSignedIn ?
        (
            <DrawerNav />
        )
       :
        (
          
             <AuthNav />
            
         
        )
    )
}
export default MainNav ;