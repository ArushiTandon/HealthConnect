import axios from 'axios';
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 100000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("authToken");
        if(accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isOnLoginPage = window.location.pathname === "/login";

    if (status === 401) {
      console.warn("401 Unauthorized");

      if (!isOnLoginPage) {
        window.location.href = "/login";
      }
    } else if (status === 500) {
      console.error("500 Server Error:", error);
    } else if (error.code === "ECONNABORTED") {
      console.error("Request Timeout:", error);
    } else {
      console.error("Unhandled Axios Error:", error.message || error);
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;