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
        if (error.response) {
            if (error.response.status === 401) {
                console.warn("Unauthorized - possibly invalid token");
                window.location.href = "/login";
            } else if (error.response.status === 500) {
                console.error("Server Error:", error);
                toast.error("Internal server error. Please try again later.");
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Request Timeout:", error);
            toast.error("Server is starting up. Please wait a few seconds and retry.");
        } else {
            console.error("Unhandled Axios Error:", error.message || error);
            toast.error("Failed to fetch data. Try again.");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;