
import axios from "axios";
import { setCredentials, logout } from "../store/slices/authSlice";
import { store } from "../store";


const api = axios.create({
  baseURL: "http://localhost:5000/api/",
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
      !originalRequest.url.includes("refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const res=await api.post('auth/refresh-token',{},
          {
            withCredentials:true
          }
        );
        const newAccessToken=res.data.accessToken
       
        store.dispatch(setCredentials({accessToken:newAccessToken}))
        localStorage.setItem("accessToken",newAccessToken)
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;