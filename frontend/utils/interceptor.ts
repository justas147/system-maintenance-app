import { AxiosError, AxiosRequestConfig } from 'axios'
import instance from './api'

const setUpInterceptor = (store: any) => {
  const handleError = async (error: AxiosError) => {
    return Promise.reject(error)
  }

  instance.interceptors.request.use(
    async (config: any | AxiosRequestConfig) => {
      const token = store.getState().token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  
      return config;
    },
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        console.log("Unauthorized, logging out");
  
        // const refreshToken = useAuthStore.getState().refreshSession; // Call token refresh
        // await refreshToken();
        // return api.request(error.config);
  
        store.getState().logout();
      }
  
      return Promise.reject(error);
    }
  )

  instance.interceptors.response.use((response) => response, handleError)
}

export default setUpInterceptor