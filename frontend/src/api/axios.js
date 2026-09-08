import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://192.168.64.212:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;