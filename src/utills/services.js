// src/utills/services.js

import axios from "axios";

// Base URL from environment variable or default
export const BASE_DOMAIN = process.env.REACT_APP_API_BASE_URL || "http://207.180.200.61:7131/api/";

//export const BASE_DOMAIN = process.env.REACT_APP_API_BASE_URL || "https://localhost:7131/api/";
//export const BASE_DOMAIN = process.env.REACT_APP_API_BASE_URL || "http://localhost/api/";
export const BASE_URL = BASE_DOMAIN;

// Create an Axios instance
export const API = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
  
});
// Add a request interceptor to include the auth token if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
API.interceptors.response.use(
  (response) => {
    // You can manipulate the response here if needed
    return response;
  },
  (error) => {
    // Global error handling
    // You can log errors or show notifications here
    return Promise.reject(error);
  }
);



export const AccountTypeModel = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Customer Agent" },
  { id: 3, name: "Gcc Supervisor" },
  { id: 4, name: "Customer Supervisor" },
  { id: 5, name: "Gcc Agent" },

];

