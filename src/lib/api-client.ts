import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Add Bearer token from Session
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    } catch (error) {
      console.error("API Client: Failed to get session", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Filter/Standardize response data if needed
api.interceptors.response.use(
  (response) => {
    // Return the data directly if it matches our standard format
    // Backend format: { success: true, data: ..., message: ... }
    return response;
  },
  (error: AxiosError) => {
    // Standardize error handling
    const data = error.response?.data as { error?: { message?: string; code?: string } };
    const message = data?.error?.message || error.message || "An unexpected error occurred";
    
    // You could trigger a toast here if desired, 
    // but better to handle it in hooks or components for more control
    
    return Promise.reject({
      message,
      code: data?.error?.code || "UNKNOWN_ERROR",
      status: error.response?.status,
      originalError: error,
    });
  }
);

export default api;
