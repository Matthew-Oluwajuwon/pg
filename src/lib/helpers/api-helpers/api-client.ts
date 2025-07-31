import { storageHelper } from "@/lib";
import axios, { type AxiosInstance } from "axios";

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use(
  async (config) => {
    // Get the token
    const token = storageHelper.getItem<string>("token");

    // If the token exists
    if (token) {
      // Set the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Return the config
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
