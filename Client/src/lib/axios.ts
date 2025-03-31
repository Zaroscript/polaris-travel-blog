import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for logging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to:`,
      `${config.baseURL}${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
