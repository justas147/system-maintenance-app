import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from 'expo-router/drawer';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Redirect } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useBoundStore } from '@/state';
import setUpInterceptor from '@/utils/interceptor';
import { Platform } from 'react-native';
// import PushNotification from 'react-native-push-notification';
// import { startAlarm } from "@/services/alarm";

// When a notification is received while the app is running, 
// using this function you can set a callback that will decide 
// whether the notification should be shown to the user or not.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    console.log('Getting push token for push notification');
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    console.log('Existing status:', existingStatus);

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    console.log('Project ID:', projectId);

    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }

    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      console.log(pushTokenString);

      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

export default function RootLayout() {
  const isAutehnticated = useBoundStore((state) => state.isAuthenticated);
  const setSelectTeam = useBoundStore((state) => state.setSelectTeam);
  const setSelectTeams = useBoundStore((state) => state.setSelectTeams);
  const fetchUser = useBoundStore((state) => state.fetchUser);

  const [expoPushToken, setExpoPushToken] = useState('');
  
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();
  
  useEffect(() => {
    // TODO: is this the right place to fetch the user data?
    const fetchData = async () => {
      // TODO: is this the right place to set up the interceptor?
      setUpInterceptor(useBoundStore);
      
      const user = await fetchUser();

      if (!user) {
        console.error("User not found");
        return;
      }

      setSelectTeams(user.teamIds);
      setSelectTeam(user.teamIds[0]);
    };

    console.log("isAuthenticated", isAutehnticated);

    if (!isAutehnticated) {
      console.log("Redirecting to login");
      return;
    }

    fetchData();

    // Set up push notifications
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    // Listeners registered by this method will be called whenever a notification is received while the app is running
    notificationListener.current = Notifications.addNotificationReceivedListener( async (notification) => {
      if (!notification.request.content.data) {
        return;
      }

      let data = typeof notification.request.content.data.body === 'string' ? 
        JSON.parse(notification.request.content.data.body) : 
        notification.request.content.data.body;
      const type = data.alertType;

      if (type === 'alert') {
        console.log('Received alert notification:', data);

        const alarmNotifData = {
          title: data.alertTitle,
          message: data.alertMessage,
          channel: "default",
        };

        // startAlarm();

      } else {
        console.log('Received push notification:', notification.request.content.title, notification.request.content.body);
      }
    });

    // Listeners registered by this method will be called whenever a user interacts with a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!isAutehnticated) {
    return <Redirect href="/login" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            title: 'Home',
          }}
        />
        <Drawer.Screen
          name="profile/index"
          options={{
            drawerLabel: 'Profile',
            title: 'Profile',
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="profile/[id]/edit"
          options={{
            title: 'Profile edit',
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="teams/index"
          options={{
            drawerLabel: 'Teams',
            title: 'Teams',
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="teams/[id]"
          options={{
            title: 'Team edit',
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="teams/create"
          options={{
            title: 'Team edit',
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="teams/[id]/add"
          options={{
            title: 'Team edit',
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="teams/[id]/index"
          options={{
            title: 'Team edit',
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="teams/[id]/edit"
          options={{
            title: 'Team edit',
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
