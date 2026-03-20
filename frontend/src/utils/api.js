import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const setupInterceptors = (getToken) => {
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
