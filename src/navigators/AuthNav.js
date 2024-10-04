import React, { useEffect, useState } from  'react' ;
 import { createNativeStackNavigator} from '@react-navigation/native-stack'
import Login from "../pages/Auth/Login";
import Otp from "../pages/Auth/Otp";
import SignUp from '../pages/Auth/SignUp';
import Welcome from '../pages/Auth/Welcome';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ChangePassword from '../pages/Auth/ChangePassword';


const AuthNav=(props)=>{
   
    const Stack = createNativeStackNavigator();


    return(
           <Stack.Navigator
            screenOptions={{ headerShown:false,}}
             >
            <Stack.Screen component = {Welcome} name="Welcome" />
            <Stack.Screen component = {Login}  name="Login" />
            <Stack.Screen component = {Otp}  name="Otp" />
            <Stack.Screen component={SignUp} name='SignUp'/>
            <Stack.Screen component={ForgotPassword} name='ForgotPassword' />
            <Stack.Screen component={ChangePassword} name='ChangePassword' />
        </Stack.Navigator>

)
}




export default AuthNav