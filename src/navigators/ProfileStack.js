import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Myprofile from '../pages/MyProfile/Myprofile';
import EditProfile from '../pages/MyProfile/EditProfile';
import ChangPassword from '../pages/MyProfile/ChangPassword';
import Billing from '../pages/MyProfile/Billing';
import NotificationsSetting from '../pages/MyProfile/NotificationsSeting';
import MyCetificate from '../pages/MyProfile/MyCetificate';
import OrderHistory from '../pages/MyProfile/OrderHistory';
import WishList from '../pages/WishList/WishList';
import Myorder from '../pages/Myorder/Myorder';

const ProfileStack = props => {
  var logindata = useSelector(state => state.user.user_details);
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen component={Myprofile} name="Myprofile" />
      <Stack.Screen component={EditProfile} name="EditProfile" />
      <Stack.Screen component={ChangPassword} name="ChangPassword" />
      <Stack.Screen component={MyCetificate} name="MyCetificate" />
      <Stack.Screen component={NotificationsSetting} name="NotificationsSetting" />
      <Stack.Screen component={Billing} name="Billing" />
      <Stack.Screen component={OrderHistory} name='OrderHistory' />
      
      <Stack.Screen component={WishList} name='WishList' />
      <Stack.Screen component={Myorder} name="Myorder" />

    </Stack.Navigator>
  );
};

export default ProfileStack;
