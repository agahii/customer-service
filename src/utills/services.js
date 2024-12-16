// src/utills/services.js

import axios from "axios";

// Base URL from environment variable or default
export const BASE_DOMAIN = process.env.REACT_APP_API_BASE_URL || "http://135.181.22.115:2323/api/";
export const BASE_URL = BASE_DOMAIN;

// Create an Axios instance
export const API = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    // Add authorization headers or other custom headers if needed
    // Example:
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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
