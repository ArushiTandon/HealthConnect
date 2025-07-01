import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

const token = localStorage.getItem("authToken");
if (token) {
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default API;
