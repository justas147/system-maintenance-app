import { StateCreator } from 'zustand';
import AuthService from "../services/auth";
import * as SecureStore from 'expo-secure-store';

export interface AuthSlice {
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, username: string, password: string, pushTokenString: string) => Promise<void>;
  logout: () => Promise<void>;
}

const TOKEN_KEY = 'jwt-token';

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  isAuthenticated: false,
  token: null,

  login: async (email, password): Promise<any> => {
    try {
      const results = await AuthService.login(email, password);

      console.log("Login results: ", results);
  
      set({ isAuthenticated: true, token: results.token });
  
      await SecureStore.setItemAsync(TOKEN_KEY, results.token);

      return results;
    } catch (error) {
      console.error("Failed to login: ", error);
      return { error: true, message: (error as any).message };
    }
  },

  register: async (username, email, password, pushTokenString) => {
    try {
      const result = await AuthService.register(username, email, password, pushTokenString);

      if (!result) {
        throw new Error('Failed to register');
      }
    } catch (error) {
      console.error("Failed to register: ", error);
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      set({ token: null, isAuthenticated: false });
    } catch (error) {
      console.error("Failed to logout: ", error);
    }
  }
});
