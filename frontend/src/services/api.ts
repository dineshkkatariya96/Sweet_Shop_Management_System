// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// INTERCEPTOR: Attach token before every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("[API] sending token:", token);
    } else {
      console.log("[API] sending token: null");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
