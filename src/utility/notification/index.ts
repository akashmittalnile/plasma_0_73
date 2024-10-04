import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { PermissionsAndroid, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

export const triggerNotification = async (
  title: string = '',
  message: string = '',
  isSchedule: boolean = false,
  scheduleTime: string = '',
) => {
  try {
    if (Platform.OS === 'android') {
      let result;
      // const result = await PermissionsAndroid?.request(
      //   PermissionsAndroid?.PERMISSIONS?.POST_NOTIFICATIONS,
      // );
      if (Platform.Version >= 33) {
        result = await PermissionsAndroid?.request(
          PermissionsAndroid?.PERMISSIONS?.POST_NOTIFICATIONS,
        );
      }
      else
        result = PermissionsAndroid?.RESULTS?.GRANTED

      if (result === PermissionsAndroid?.RESULTS?.GRANTED) {
        PushNotification.createChannel(
          {
            channelId: 'default-channel-id',
            channelName: 'Default Channel',
            channelDescription: 'A default channel',
            playSound: true,
            soundName: 'default',
            importance: 4,
            vibrate: true,
          },
          (created: boolean) => {
            if (created) {
              console.log('Channel created successfully');
            } else {
              console.log('Channel already exists or creation failed');
            }
          },
        );
        if (isSchedule) {
          PushNotification.localNotificationSchedule({
            channelId: 'default-channel-id',
            title,
            message,
            date: scheduleTime ? new Date(scheduleTime) : new Date(),
            allowWhileIdle: true,
            repeatTime: 1,
            background: true,
          });
        } else {
          PushNotification.localNotification({
            channelId: 'default-channel-id',
            title,
            message,
            allowWhileIdle: true,
            background: true,
          });
        }
      } else {
        console.log('Notification permission not granted:', result);
      }
    } else {
      PushNotificationIOS.addNotificationRequest({
        id: '1',
        title,
        body: message,
      });
    }
  } catch (err: any) {
    console.log('Error in notification handling:', err.message);
  }
};