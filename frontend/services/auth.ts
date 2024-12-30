import { User } from "@/state/user";
import api from "../utils/api";
import { Platform } from "react-native";
import { Api } from "@/constants/Api";

const register = async (name: string, email: string, password: string, pushTokenString: string): Promise<any> => {
  try {
    const response = await api.post('users/register', {
      name,
      email,
      password,
      pushNotificationToken: pushTokenString,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to register, response: ${response.status}`);
    }

    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const login = async (email: string, password: string) => {
  console.log("Login email: ", email, '/auth/login');
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to login, response: ${response.status}`);
    }

    console.log("Login data: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to login: ", error);
  }
}

const profile = async (): Promise<User | undefined> => {
  try {
    const response = await api.get('/users/profile');

    if (response.status !== 200) {
      throw new Error(`Failed to get profile, response: ${response.status}`);
    }

    console.log("Profile response: ", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export default {
  register,
  login,
  profile,
}