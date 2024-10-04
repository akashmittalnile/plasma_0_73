import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

export const getFCMToken = async () => {

    try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            //   console.log("dsdds", { fcmToken });
            //   Alert.alert(JSON.stringify(fcmToken))
            //   Clipboard.setString(JSON.stringify(fcmToken))
            return fcmToken
        }
        else {
            console.error("Error in FCM Token!");
            Alert.alert("FCM Error", "Something Went Wrong, Please Try Again!")
            return null
        }
    } catch (error) {
        console.log("checkToken", error);
        Alert.alert("FCM Error", "Something Went Wrong, Please Try Again!")
        return null
    }
}