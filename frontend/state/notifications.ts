import { StateCreator } from 'zustand';
import * as Notifications from 'expo-notifications';
import NotificationService from '@/services/notifications';

export interface NotificationSlice {
  token: string | null;
  notificationListener: Notifications.EventSubscription | null;
  responseListener: Notifications.EventSubscription | null;
  getToken: () => Promise<string | null>;
  removeToken: () => void;
  // setNotificationListener: (listener: Notifications.EventSubscription) => void;
  // setResponseListener: (listener: Notifications.EventSubscription) => void;
  // removeNotificationListener: () => void;
  // removeResponseListener: () => void;
};

export const createNotificationSlice: StateCreator<
  NotificationSlice,
  [],
  [],
  NotificationSlice
> = (set) => ({
  token: null,
  notificationListener: null,
  responseListener: null,
  getToken: async () => {
    const token = await NotificationService.registerForPushNotificationsAsync();
    console.log('Expo Push Token:', token);
    set({ token });
    return token;
  },
  removeToken: () => set({ token: null }),
});