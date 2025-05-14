import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  // Add timeout
  timeout: 10000,
})

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Ensure method is uppercase
    if (config.method) {
      config.method = config.method.toUpperCase();
    }

    // Get token from localStorage if available
    const token = localStorage.getItem("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log request for debugging
    console.log('Making request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });

    return config
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error)
  },
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log successful response for debugging
    console.log('Response received:', {
      status: response.status,
      data: response.data
    });
    return response
  },
  (error) => {
    // Log error response for debugging
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data
      }
    });

    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")

      // Only redirect if we're in the browser
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default api
