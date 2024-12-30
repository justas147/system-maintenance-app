import { StateCreator } from 'zustand';
import AuthService from "../services/auth";
import * as SecureStore from 'expo-secure-store';

export interface AuthSlice {
  isAuthenticated: boolean;
  token: string | null;
  authError: string;
  isLoadingAuth: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, username: string, password: string, pushTokenString: string) => Promise<void>;
  logout: () => Promise<void>;
}

const TOKEN_KEY = 'jwt-token';

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  isAuthenticated: false,
  token: null,
  authError: "",
  isLoadingAuth: false,

  login: async (email, password): Promise<any> => {
    set({ isLoadingAuth: true });

    try {
      const results = await AuthService.login(email, password);

      console.log("Login results: ", results);
  
      set({ isAuthenticated: true, token: results.token });
  
      await SecureStore.setItemAsync(TOKEN_KEY, results.token);

      set({ isLoadingAuth: false });
      return results;
    } catch (error) {
      console.error("Failed to login: ", error);
      const errorMessage = error instanceof Error ? error.message : "unknown error";
      set({ isLoadingAuth: false, authError: errorMessage });
    }
  },

  register: async (username, email, password, pushTokenString) => {
    set({ isLoadingAuth: true });

    try {
      const result = await AuthService.register(username, email, password, pushTokenString);

      if (!result) {
        throw new Error('Failed to register');
      }

      set({ isLoadingAuth: false });
    } catch (error) {
      console.error("Failed to register: ", error);
      set({ isLoadingAuth: false, authError: "Failed to register" });
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
