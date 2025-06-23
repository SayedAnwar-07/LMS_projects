import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    // Always attach token if exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Special handling for FormData
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else if (config.data) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(handleApiError(error));
  }
);

const handleApiError = (error) => {
  const defaultMessage = "An unexpected error occurred";

  if (error.code === "ECONNABORTED") {
    return { message: "Request timeout" };
  }

  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data?.message || defaultMessage,
      data: error.response.data,
      headers: error.response.headers,
    };
  }

  if (error.request) {
    return { message: "No response received from server" };
  }

  return {
    message: error.message || defaultMessage,
    stack:
      import.meta.env.VITE_NODE_ENV === "development" ? error.stack : undefined,
  };
};

export { api, handleApiError };
