import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useSelector, useDispatch } from 'react-redux';
import Myorder from '../pages/Myorder/Myorder';
import OrderStatus from '../pages/Myorder/OrderStatus';
import ProductCart from '../pages/Product/ProductCart';
import Notification from '../pages/notification/Notification';
import OrderDetails from '../pages/Myorder/OrderDetails';
import CourseDetails from '../pages/Home/CourseDetails';
import ProductDetails from '../pages/Product/ProductDetails';
import Disclaimers from '../pages/Disclaimers/Disclaimers';
import DisclaimersPdf from '../pages/Disclaimers/DisclaimersPdf';
import Quiz from '../pages/Disclaimers/Quiz';
import Schedule from '../pages/Schedule/Schedule';
import QuizWebViewModal from '../pages/Disclaimers/QuizWebViewModal';
import SurveyWebview from '../pages/Disclaimers/SurveyWebview';
import AssignmentScreen from '../pages/Disclaimers/AssignmentScreen';



const MyorderStack = (props) => {
    var logindata = useSelector(state => state.user.user_details)

    const Stack = createNativeStackNavigator();

    return (

        <Stack.Navigator screenOptions={{ headerShown: false, }} >
            <Stack.Screen component={Myorder} name="Myorder" />
            <Stack.Screen component={OrderStatus} name='OrderStatus' />
            
            <Stack.Screen component={ProductCart} name='ProductCart' />
            <Stack.Screen component={Notification} name='Notification' />
            <Stack.Screen component={OrderDetails} name='OrderDetails' />
            <Stack.Screen component={CourseDetails} name='CourseDetails' />
            <Stack.Screen component={ProductDetails} name='ProductDetails' />
            <Stack.Screen component={Disclaimers} name='Disclaimers' />
            <Stack.Screen component={DisclaimersPdf} name='DisclaimersPdf' />
            <Stack.Screen component={Quiz} name='Quiz' />
            <Stack.Screen component={Schedule} name='Schedule' />
            <Stack.Screen component={QuizWebViewModal} name='QuizWebViewModal' />
            <Stack.Screen component={SurveyWebview} name='SurveyWebview' />
            <Stack.Screen component={AssignmentScreen} name='AssignmentScreen' />
        </Stack.Navigator>

    )
}




export default MyorderStack