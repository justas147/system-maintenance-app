import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

const registerForPushNotificationsAsync = async (): Promise<string | null> => {
  if (!Device.isDevice) {
    alert('Must use physical device for Push Notifications');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return null;
  }

  // TODO: how to set expo constants, could I just use .env?
  const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  console.log('Expo Push Token:', token);

  return token;
};

export default {
  registerForPushNotificationsAsync,
};