import axios from "axios";

const api = axios.create({
  baseURL: "https://localfix-wl5e.onrender.com/api",
});

export const setupInterceptors = (getToken) => {
  api.interceptors.request.clear();
  api.interceptors.request.use(
    async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

export default api;
