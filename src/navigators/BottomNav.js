import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, ImageBackground, StyleSheet, Image, ScrollView, TouchableOpacity, } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { Mycolors } from '../utility/Mycolors';
import { onLogoutUser } from '../redux/actions/user_action';
import HomeStack from './HomeStack';
import WishListStack from './WishListStack';
import MyorderStack from './MyorderStack';
import ProfileStack from './ProfileStack';
import Home from "../pages/Home/Home";
import WishList from '../pages/WishList/WishList';
import Myorder from '../pages/Myorder/Myorder';
import Myprofile from '../pages/MyProfile/Myprofile';
import { useIsFocused } from '@react-navigation/native';
import { FONTFAMILY } from '../utility/fonts';

function BottomTabs(props) {
  const focusedOptions = props.descriptors[props.state.routes[props.state.index].key].options;
  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={{ backgroundColor: '#53045F' }}>
      <View style={styles.container}>
        {props.state.routes.map(
          (route: { key: string | number; name: any }, index: any) => {
            const { options } = props.descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = props.state.index === index;

            const onPress = () => {
              const event = props.navigation.emit({
                type: 'tabPress',
                target: route.key,
              });

              if (!isFocused && !event.defaultPrevented) {
                props.navigation.reset({
                  index: 0,
                  routes: [{ name: route.name }],
                });
              }
            };

            const onLongPress = () => {
              props.navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={[
                  styles.tabButtonContainer,
                  isFocused ? styles.tabActive : null,
                ]}>
                {label === 'HomeStack' ? (
                  <View style={isFocused ? { backgroundColor: 'transparent', justifyContent: 'center', borderRadius: 7 } : {}}>
                    <Image
                      style={[styles.tabIcon]}
                      resizeMode="stretch"
                      tintColor={isFocused ? '#B357C3' : '#000'}
                      source={require('../assets/home2.png')}
                    />
                    <Text
                      style={
                        isFocused ? styles.iconText : styles.iconTextDisable
                      }>
                      Home
                    </Text>
                  </View>
                ) : label === 'WishListStack' ? (
                  <View style={isFocused ? { backgroundColor: 'transparent', justifyContent: 'center', borderRadius: 7 } : {}}>

                    <Image
                      style={styles.tabIcon}
                      tintColor={isFocused ? '#B357C3' : '#000'}
                      resizeMode="stretch"
                      source={require('../assets/heart.png')}
                    />
                    <Text
                      style={
                        isFocused ? styles.iconText : styles.iconTextDisable
                      }>
                      Wishlist
                    </Text>
                  </View>
                ) : label === 'MyorderStack' ? (
                  <View style={isFocused ? { backgroundColor: 'transparent', justifyContent: 'center', borderRadius: 7 } : {}}>

                    <Image
                      style={styles.tabIcon}
                      resizeMode="stretch"
                      tintColor={isFocused ? '#B357C3' : '#000'}
                      source={require('../assets/box.png')}
                    />
                    <Text
                      style={
                        [isFocused ? styles.iconText : styles.iconTextDisable, {}]
                      }>
                      My Orders
                    </Text>
                  </View>
                ) : (
                  <View style={isFocused ? { backgroundColor: 'transparent', justifyContent: 'center', borderRadius: 7 } : {}}>

                    <Image
                      style={styles.tabIcon}
                      resizeMode="stretch"
                      tintColor={isFocused ? '#B357C3' : '#000'}
                      source={require('../assets/profilecircle.png')}
                    />
                    <Text
                      style={
                        isFocused ? styles.iconText : styles.iconTextDisable
                      }>
                      Profile
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          },
        )}
      </View>
    </View>

  );
}


const BottomNav = (props) => {
  const Tab = createBottomTabNavigator();
  const dispatch = useDispatch();
  const screenOptions = {
    showLabel: false,
    headerShown: false,
    tabBarShowLabel: false,
    tabBarStyle: styles.navigatorStyle
  };
  const closeConfig = {
    animation: 'timing',
    config: {
      duration: 200,
      easing: Easing.linear,
      direction: 'vertical',
    },
  };
  const config = {
    // animation: 'bounce',
    config: {
      stiffness: 200,
      damping: 20,
      mass: 1,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };
  const isFocussed = useIsFocused()
  const [currentScreen, setcurrentScreen] = useState(0)
  const isProductRef = useRef(props?.route?.params?.isProduct)
  const [isProduct, setisProduct] = useState(props?.route?.params?.isProduct)
  // let isProduct = isProductRef.current
  // const isFocused = false
  function isFocused(screenIndex) {
    return screenIndex == currentScreen
  }
  
  const label = 'HomeStack'
  console.log("props?.route?.params?.isProduct", props?.route?.params?.isProduct);
  console.log("{isProduct}", isProduct);

  useEffect(() => {
    
    // if (condition) {
      setisProduct(props?.route?.params?.isProduct)
    // }
    // return () => {
    //   
    // }
  }, [props?.route?.params?.isProduct])
  

  useEffect(() => {

    if (isFocussed) {



      if (props?.route?.params?.screenIndex != undefined) {
        setcurrentScreen(props?.route?.params?.screenIndex)
      }
      console.log({ bottomuseEffect: props?.route?.params });
    }
  }, [props?.route?.params])


  return (<>
    {currentScreen == 0 ? <Home {...props} /> : currentScreen == 1 ? <WishList {...props} /> : currentScreen == 2 ? <Myorder {...props} isProduct={isProduct ? true : false} /> : currentScreen == 3 ? <Myprofile {...props} /> : <></>}
    <View style={{ backgroundColor: '#53045F' }}>
      <View style={styles.container}>

        <View
          // key={route.key}
          accessibilityRole="button"
          accessibilityState={isFocused() ? { selected: true } : {}}
          // accessibilityLabel={options.tabBarAccessibilityLabel}
          // testID={options.tabBarTestID}
          // onPress={onPress}
          // onLongPress={onLongPress}
          style={[
            styles.tabButtonContainer,
            isFocused(0) ? styles.tabActive : null,
          ]}>

          <TouchableOpacity onPress={() => setcurrentScreen(0)} style={isFocused(0) ? { backgroundColor: 'transparent', justifyContent: 'center', borderRadius: 7 } : {}}>
            <Image
              style={[styles.tabIcon]}
              resizeMode="stretch"
              tintColor={isFocused(0) ? '#B357C3' : '#000'}
              source={require('../assets/home2.png')}
            />
            <Text
              style={
                isFocused(0) ? styles.iconText : styles.iconTextDisable
              }>
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setcurrentScreen(1)} style={isFocused(1) ? { backgroundColor: 'transparent', justifyContent: 'center', borderRadius: 7 } : {}}>

            <Image
              style={styles.tabIcon}
              tintColor={isFocused(1) ? '#B357C3' : '#000'}
              resizeMode="stretch"
              source={require('../assets/heart.png')}
            />
            <Text
              style={
                isFocused(1) ? styles.iconText : styles.iconTextDisable
              }>
              Wishlist
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {

            setcurrentScreen(2)
            // isProductRef.current = false
            setisProduct(false)
            }} style={isFocused(2) ? { backgroundColor: 'transparent', justifyContent: 'center', borderRadius: 7 } : {}}>

            <Image
              style={styles.tabIcon}
              resizeMode="stretch"
              tintColor={isFocused(2) ? '#B357C3' : '#000'}
              source={require('../assets/box.png')}
            />
            <Text
              style={
                [isFocused(2) ? styles.iconText : styles.iconTextDisable, {}]
              }>
              My Orders
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setcurrentScreen(3)} style={isFocused(3) ? { backgroundColor: 'transparent', justifyContent: 'center', borderRadius: 7 } : {}}>

            <Image
              style={styles.tabIcon}
              resizeMode="stretch"
              tintColor={isFocused(3) ? '#B357C3' : '#000'}
              source={require('../assets/profilecircle.png')}
            />
            <Text
              style={
                isFocused(3) ? styles.iconText : styles.iconTextDisable
              }>
              Profile
            </Text>
          </TouchableOpacity>

        </View>


      </View>
    </View>
  </>
  )

  // return (


  //   <Tab.Navigator
  //     initialRouteName={'HomeStack'}
  //     backBehavior="none"
  //     screenOptions={screenOptions}
  //     tabBar={(props) => <BottomTabs {...props} />}
  //   >
  //     <Tab.Screen name="HomeStack" options={{ headerShown: false, transitionSpec: { open: config, close: closeConfig, }, }} component={HomeStack} />
  //     <Tab.Screen name="WishListStack" options={{ headerShown: false, transitionSpec: { open: config, close: closeConfig, }, }} component={WishListStack} />
  //     <Tab.Screen name="MyorderStack" options={{ headerShown: false, transitionSpec: { open: config, close: closeConfig, }, }} component={MyorderStack} />
  //     <Tab.Screen name="ProfileStack" options={{ headerShown: false, transitionSpec: { open: config, close: closeConfig, }, }} component={ProfileStack} />

  //   </Tab.Navigator>
  // );
};
const styles = StyleSheet.create({
  tabButtonContainer: {
    flex: 1,
    // height: 85,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    // backgroundColor: 'green',
  },
  tabIcon: {
    height: 25,
    width: 25,
    alignSelf: 'center'
  },
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    elevation: 24,
    borderRadius: 40,
    top: -30,
    height: 70,
    width: '95%',
    alignSelf: 'center',

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,
  },
  tabActive: {
    // borderBottomWidth: 3,
    borderRadius: 10,
    // borderBottomColor: 'transparent',
    // backgroundColor:'green',
    // height:70,top:10
  },
  image: { height: '100%', width: '100%' },
  iconText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B357C3',
    textAlign: 'center',
    marginTop: 2,
    fontFamily: FONTFAMILY
  },
  iconTextDisable: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginTop: 2,
    fontFamily: FONTFAMILY
  },
});
export default BottomNav