
import axios from "axios";
import { setCredentials, logout } from "../store/slices/authSlice";
import { store } from "../store";


let refreshPromise: Promise<string> | null = null;

const api = axios.create({
  baseURL: "https://bank-management-system-4-d2qx.onrender.com/api",
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-token"
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          
          refreshPromise = api
            .post("/auth/refresh-token")
            .then((res) => {
              const token = res.data.accessToken;

              store.dispatch(setCredentials({ accessToken: token }));

              return token;
            })
            .finally(() => {
              
              refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;