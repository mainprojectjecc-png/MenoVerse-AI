import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (user?.access_token) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }

  return config;
});

export default api;