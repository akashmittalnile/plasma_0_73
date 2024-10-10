import React, { useEffect } from 'react';
import { SafeAreaView, LogBox, StatusBar, BackHandler, useColorScheme, View, Image, Text, Alert, TextInput, Clipboard, } from 'react-native';
import MainNav from './src/navigators/MainNav'
import store from './src/redux/store/store';
import 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { Provider } from 'react-redux';
import { StripeProvider } from '@stripe/stripe-react-native';
import Modal from 'react-native-modal';
import { Mycolors } from './src/utility/Mycolors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MyButtons from './src/component/MyButtons';
import AddToCartErrorComponent from './src/component/AddToCartErrorComponent';
import messaging from '@react-native-firebase/messaging';
import { triggerNotification } from './src/utility/notification';
import { getFCMToken } from './src/utility/FirebaseUtility';

const publishable = 'pk_test_51PcigMGUc4aB3e1raFrvITDpN7fUVFhSdltYwyrbn5aiMfDxW0pKTNcbER5wr74XlVylp32DQiCpIjCECWihqzmU00tjozHLa4'

function App(): React.JSX.Element {
  LogBox.ignoreAllLogs()


  const requestUserPermission = async (): Promise<boolean> => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      console.log({ authStatus });

      return enabled;
    } catch (error) {
      console.log('Error requesting FCM permission:', error);
      return false;
    }
  };



  const checkToken = async () => {

    console.log("dddd");

    // const fcmToken = await messaging().getToken();
    // if (fcmToken) {
    //   console.log("dsdds", { fcmToken });
    //   Alert.alert(JSON.stringify(fcmToken))
    //   Clipboard.setString(JSON.stringify(fcmToken))
    // }
    // else {
    //   console.error("Error in FCM Token!");
    //   Alert.alert("", "Error in FCM Token!")

    // }

    const fcmToken = await getFCMToken();
    if (fcmToken) {
      console.log("dsdds", { fcmToken });
      Alert.alert(JSON.stringify(fcmToken))
      Clipboard.setString(JSON.stringify(fcmToken))
    }
    else {
      console.error("Error in FCM Token!");
      // Alert.alert("", "Error in FCM Token!")

    }
    
  }

  useEffect(() => {

    // triggerNotification('fghj','dxfghjk')

    let unsubscribe: any

    requestUserPermission()
      .then(permissionGranted => {
        if (permissionGranted) {

          // checkToken()

          messaging().onMessage(async remoteMessage => {
            console.log('Foreground message received!', { remoteMessage });
            // store.dispatch(notificationCounter({notificationCount: 1}));
            triggerNotification(
              remoteMessage?.notification?.title,
              remoteMessage?.notification?.body,
            );
          });
          console.log({ permissionGranted });



        } else {
          console.log('Permission denied for FCM');
        }
      })
      .catch(err => {
        console.log('err in push notification', err);
      });

    return () => {
      return unsubscribe;
    }

  }, []);


  useEffect(() => {

    // // Override Text scaling
    // if (Text.defaultProps) {
    //   Text.defaultProps.allowFontScaling = false;
    // } else {
    //   Text.defaultProps = {};
    //   Text.defaultProps.allowFontScaling = false;
    // }

    // // Override Text scaling in input fields
    // if (TextInput.defaultProps) {
    //   TextInput.defaultProps.allowFontScaling = false;
    // } else {
    //   TextInput.defaultProps = {};
    //   TextInput.defaultProps.allowFontScaling = false;
    // }
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.maxFontSizeMultiplier = 1;
    TextInput.defaultProps = Text.defaultProps || {};
    TextInput.defaultProps.maxFontSizeMultiplier = 1;

    return () => {

    }
  }, [])



  return (<>
    <StripeProvider publishableKey={publishable}>
      <Provider store={store}>
        <NavigationContainer theme={DefaultTheme}>
          <MainNav />
        </NavigationContainer>

      </Provider>
    </StripeProvider>
  </>
  );
}


export default App;




