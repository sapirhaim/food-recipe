import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// מוסיף Authorization אוטומטית אם יש token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
 if (token && token !== "null" && token !== "undefined") {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    if (config.headers) delete (config.headers as any).Authorization;
  }
  return config;
});

