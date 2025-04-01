import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_BACKEND_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
