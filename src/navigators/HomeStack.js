import React, { useEffect, useState } from  'react' ;
 import { createNativeStackNavigator} from '@react-navigation/native-stack'
import Home from "../pages/Home/Home";

import {  useSelector, useDispatch } from 'react-redux';
import HomeViewAll from '../pages/Home/HomeViewAll';
import CourseDetails from '../pages/Home/CourseDetails';
import Cart from '../pages/Home/Cart';
import PaymentMethod from '../pages/Home/PaymentMethod';
import ProductCart from '../pages/Product/ProductCart';
import ProductDetails from '../pages/Product/ProductDetails';
import ProductPaymentMethod from '../pages/Product/ProductPaymentMethod';
import ProductFilter from '../pages/Product/ProductFilter';
import ProductViewAll from '../pages/Product/ProductViewAll';
import SipingAddress from '../pages/Product/SipingAddress';
import Privacy from '../pages/TC/Privacy';
import Term from '../pages/TC/Term';
import Chat from '../pages/Messaging/Chat';
import Blog from '../pages/Blog/Blog';
import BlogDetails from '../pages/Blog/BlogDetails';
import Community from '../pages/community/Community';
import CommunityDetails from '../pages/community/CommunityDetails';
import Notification from '../pages/notification/Notification';
import Disclaimers from '../pages/Disclaimers/Disclaimers';
import DisclaimersPdf from '../pages/Disclaimers/DisclaimersPdf';
import Quiz from '../pages/Disclaimers/Quiz';
import Schedule from '../pages/Schedule/Schedule';
import { CalendarList } from 'react-native-calendars';
import CalendarListScreen from '../pages/CalendarList/CalendarListScreen';
import PostDetails from '../pages/community/PostDetails';
import CreateGoal from '../pages/Goals/CreateGoal';
import GetGoals from '../pages/Goals/GetGoals';
import AllComments from '../pages/community/Comments/AllComments';
import Myorder from '../pages/Myorder/Myorder';
import HomeSearch from '../pages/Search/HomeSearch';
import ScheduleDetail from '../pages/Schedule/ScheduleDetail';
import QuizWebViewModal from '../pages/Disclaimers/QuizWebViewModal';
import SurveyWebview from '../pages/Disclaimers/SurveyWebview';
import AssignmentScreen from '../pages/Disclaimers/AssignmentScreen';
import AllCommunities from '../pages/community/AllCommunities';
import MyCourses from '../pages/Home/MyCourses';
import DocumentList from '../pages/Documents/DocumentList';
import BottomNav from './BottomNav';
import OrderStatus from '../pages/Myorder/OrderStatus';
import WishList from '../pages/WishList/WishList';
import OrderHistory from '../pages/MyProfile/OrderHistory';
import Myprofile from '../pages/MyProfile/Myprofile';
import EditProfile from '../pages/MyProfile/EditProfile';
import ChangPassword from '../pages/MyProfile/ChangPassword';
import MyCetificate from '../pages/MyProfile/MyCetificate';
import NotificationsSetting from '../pages/MyProfile/NotificationsSeting';
import Billing from '../pages/MyProfile/Billing';
import OrderDetails from '../pages/Myorder/OrderDetails';
import Content from '../pages/Disclaimers/Content';

function tryCalendarListScreen() {
    
    try {
        return CalendarListScreen
    } catch (error) {
        console.error({error});
    }
}

    
const HomeStack=(props)=>{
    var logindata  = useSelector(state => state.user.user_details)

    const Stack = createNativeStackNavigator();

    return(
       
           <Stack.Navigator screenOptions={{ headerShown:false,}} >
            <Stack.Screen component = {BottomNav} name="BottomNavNew" />
           <Stack.Screen component = {Home} name="Home" />
           <Stack.Screen component={HomeViewAll} name='HomeViewAll' />
           <Stack.Screen component={MyCourses} name='MyCourses' />
           <Stack.Screen component={CourseDetails} name='CourseDetails' />
           <Stack.Screen component={Cart} name='Cart' />
           <Stack.Screen component={PaymentMethod} name='PaymentMethod' />
           <Stack.Screen component={ProductCart} name='ProductCart' />
           <Stack.Screen component={ProductDetails} name='ProductDetails' />
           <Stack.Screen component={ProductPaymentMethod} name='ProductPaymentMethod' />
           <Stack.Screen component={ProductFilter} name='ProductFilter' />
           <Stack.Screen component={ProductViewAll} name='ProductViewAll' />
           <Stack.Screen component={SipingAddress} name='SipingAddress' />
           <Stack.Screen component={Privacy} name='Privacy' />
           <Stack.Screen component={Term} name='Term' />
           <Stack.Screen component={Chat} name='Chat' />
           <Stack.Screen component={DocumentList} name='DocumentList' />
           <Stack.Screen component={Blog} name='Blog' />
           <Stack.Screen component={BlogDetails} name='BlogDetails' />
           <Stack.Screen component={Community} name='Community' />
           <Stack.Screen component={CommunityDetails} name='CommunityDetails' />
           <Stack.Screen component={AllCommunities} name='AllCommunities' />
           <Stack.Screen component={Notification} name='Notification' />
           <Stack.Screen component={Disclaimers} name='Disclaimers' />
           <Stack.Screen component={DisclaimersPdf} name='DisclaimersPdf' />
           <Stack.Screen component={Quiz} name='Quiz' />
           <Stack.Screen component={Schedule} name='Schedule' />
           <Stack.Screen component={CalendarListScreen} name='CalendarListScreen' />
           <Stack.Screen component={PostDetails} name='PostDetails' />
           <Stack.Screen component={CreateGoal} name='CreateGoal' />
           <Stack.Screen component={GetGoals} name='GetGoals' />
           <Stack.Screen component={AllComments} name='AllComments' />
           <Stack.Screen component={HomeSearch} name='HomeSearch' />
           <Stack.Screen component={ScheduleDetail} name='ScheduleDetail' />
           <Stack.Screen component={QuizWebViewModal} name='QuizWebViewModal' />
           <Stack.Screen component={SurveyWebview} name='SurveyWebview' />
           <Stack.Screen component={AssignmentScreen} name='AssignmentScreen' />
           {/* <Stack.Screen component={Myorder} name='GoToMyorder' /> */}

           <Stack.Screen component={OrderStatus} name='OrderStatus' />
           <Stack.Screen component = {WishList} name="WishList" />

           <Stack.Screen component={Myorder} name="Myorder" />
           <Stack.Screen component={OrderHistory} name='OrderHistory' />

           <Stack.Screen component={Myprofile} name="Myprofile" />
      <Stack.Screen component={EditProfile} name="EditProfile" />
      <Stack.Screen component={ChangPassword} name="ChangPassword" />
      <Stack.Screen component={MyCetificate} name="MyCetificate" />
      <Stack.Screen component={NotificationsSetting} name="NotificationsSetting" />
      <Stack.Screen component={Billing} name="Billing" />
      <Stack.Screen component={OrderDetails} name='OrderDetails' />
      <Stack.Screen component={Content} name='Content' />
           
 
           </Stack.Navigator>

)
}




export default HomeStack