import { Api } from "../constants/Api";
import { Platform } from "react-native";
import * as Device from 'expo-device';
// import Constants from 'expo-constants';

export function getApiUrl() {
  let url: string;
  if (Device.isDevice) {
    // TODO: set in build configuration?
    // url = "http://192.168.1.114:3000/v1"
    url = "http://4.210.242.233:3000/v1"
  } else {
    if (Platform.OS === 'web') {
      url = 'http://localhost:3000/v1';
    } else {
      url = Api.url ?? "http://10.0.2.2:3000/v1";
    }
  }

  return url;
}